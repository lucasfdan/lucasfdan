from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Set
import uuid
from datetime import datetime, timezone, timedelta
import base64
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# -----------------------------
# Config / Environment
# -----------------------------
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

def _require_env(name: str) -> str:
    val = os.environ.get(name)
    if not val:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return val

MONGO_URL = _require_env("MONGO_URL")
DB_NAME = _require_env("DB_NAME")

# Allowlist de admins (hardcoded + opcional override via env)
# Se você quiser configurar no Render por env:
# ADMIN_EMAILS="lucasfdandrea@gmail.com,gigidepollo123@gmail.com"
DEFAULT_ADMIN_EMAILS: Set[str] = {
    "lucasfdandrea@gmail.com",
    "gigidepollo123@gmail.com",
}

def get_admin_emails() -> Set[str]:
    env_val = os.environ.get("ADMIN_EMAILS", "").strip()
    if not env_val:
        return DEFAULT_ADMIN_EMAILS
    return {e.strip().lower() for e in env_val.split(",") if e.strip()}

# CORS origins
def parse_cors_origins() -> List[str]:
    raw = os.environ.get("CORS_ORIGINS", "*").strip()
    if raw == "*":
        return ["*"]
    return [o.strip() for o in raw.split(",") if o.strip()]

CORS_ORIGINS = parse_cors_origins()

# -----------------------------
# Database
# -----------------------------
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# -----------------------------
# App
# -----------------------------
app = FastAPI()
api_router = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Models
# -----------------------------
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product_id: str
    name: str
    description: str
    price: float
    sizes: List[str]
    colors: List[str]
    images: List[str]
    created_at: datetime
    updated_at: datetime

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    sizes: List[str]
    colors: List[str]
    images: List[str]

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    images: Optional[List[str]] = None

class SessionCreate(BaseModel):
    session_id: str

# -----------------------------
# Auth helpers
# -----------------------------
def is_admin_email(email: str) -> bool:
    if not email:
        return False
    return email.strip().lower() in get_admin_emails()

async def get_current_user(request: Request) -> Optional[User]:
    # cookie first, then Authorization header
    session_token = request.cookies.get("session_token")

    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "").strip()

    if not session_token:
        return None

    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    if not session_doc:
        return None

    expires_at = session_doc.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if not expires_at or expires_at < datetime.now(timezone.utc):
        await db.user_sessions.delete_one({"session_token": session_token})
        return None

    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    if not user_doc:
        return None

    if isinstance(user_doc.get("created_at"), str):
        user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])

    return User(**user_doc)

async def require_auth(request: Request) -> User:
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

async def require_admin(request: Request) -> User:
    user = await require_auth(request)
    if not is_admin_email(user.email):
        raise HTTPException(status_code=403, detail="Not authorized (admin only)")
    return user

# -----------------------------
# Health check
# -----------------------------
@api_router.get("/health")
async def health():
    return {"status": "ok"}

# -----------------------------
# Auth endpoints
# -----------------------------
@api_router.post("/auth/session")
async def create_session(data: SessionCreate, response: Response):
    """
    Exchange session_id for session_token.
    Mantém o fluxo atual baseado no endpoint externo que retorna:
    email, name, picture, session_token.
    """
    session_id = data.session_id

    async with httpx.AsyncClient() as http_client:
        try:
            auth_response = await http_client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id},
                timeout=10.0
            )
            auth_response.raise_for_status()
            user_data = auth_response.json()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to validate session: {str(e)}")

    email = (user_data.get("email") or "").strip()
    name = (user_data.get("name") or "").strip()
    picture = user_data.get("picture")
    session_token = (user_data.get("session_token") or "").strip()

    if not all([email, name, session_token]):
        raise HTTPException(status_code=400, detail="Invalid session data")

    # Upsert user
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})

    if existing_user:
        user_id = existing_user["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture}}
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(user_doc)

    # Create session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.user_sessions.insert_one(session_doc)

    # Cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60,
    )

    # Return user
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    if isinstance(user_doc.get("created_at"), str):
        user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
    return User(**user_doc)

@api_router.get("/auth/me")
async def get_current_user_endpoint(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    # inclui flag útil (não quebra o frontend; é extra)
    return {
        **user.model_dump(),
        "is_admin": is_admin_email(user.email),
    }

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# -----------------------------
# Products (public)
# -----------------------------
@api_router.get("/products", response_model=List[Product])
async def get_products():
    products = await db.products.find({}, {"_id": 0}).to_list(1000)

    for product in products:
        if isinstance(product.get("created_at"), str):
            product["created_at"] = datetime.fromisoformat(product["created_at"])
        if isinstance(product.get("updated_at"), str):
            product["updated_at"] = datetime.fromisoformat(product["updated_at"])

    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if isinstance(product.get("created_at"), str):
        product["created_at"] = datetime.fromisoformat(product["created_at"])
    if isinstance(product.get("updated_at"), str):
        product["updated_at"] = datetime.fromisoformat(product["updated_at"])

    return Product(**product)

# -----------------------------
# Products (admin only)
# -----------------------------
@api_router.post("/products", response_model=Product)
async def create_product(
    data: ProductCreate,
    user: User = Depends(require_admin),
):
    product_id = f"prod_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)

    product_doc = {
        "product_id": product_id,
        "name": data.name,
        "description": data.description,
        "price": data.price,
        "sizes": data.sizes,
        "colors": data.colors,
        "images": data.images,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
    }

    await db.products.insert_one(product_doc)

    product_doc["created_at"] = now
    product_doc["updated_at"] = now
    return Product(**product_doc)

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    data: ProductUpdate,
    user: User = Depends(require_admin),
):
    existing = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.products.update_one({"product_id": product_id}, {"$set": update_data})

    updated_product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if isinstance(updated_product.get("created_at"), str):
        updated_product["created_at"] = datetime.fromisoformat(updated_product["created_at"])
    if isinstance(updated_product.get("updated_at"), str):
        updated_product["updated_at"] = datetime.fromisoformat(updated_product["updated_at"])

    return Product(**updated_product)

@api_router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    user: User = Depends(require_admin),
):
    result = await db.products.delete_one({"product_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@api_router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    user: User = Depends(require_admin),
):
    contents = await file.read()
    base64_image = base64.b64encode(contents).decode("utf-8")
    ext = (file.content_type or "image/jpeg").split("/")[-1]
    return {"image": f"data:image/{ext};base64,{base64_image}"}

# -----------------------------
# Include router / Shutdown
# -----------------------------
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
