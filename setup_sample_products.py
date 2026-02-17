#!/usr/bin/env python3
"""
Script to add sample products to the crochê catalog for testing
"""

import requests
import json
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient

# Sample product data
SAMPLE_PRODUCTS = [
    {
        "name": "Bolsa de Crochê Colorida",
        "description": "Uma linda bolsa de crochê com cores vibrantes, perfeita para o dia a dia. Feita com linha 100% algodão.",
        "price": 45.90,
        "sizes": ["P", "M", "G"],
        "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFFFFF"],
        "images": [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
            "https://images.unsplash.com/photo-1594633313885-c4c4ec63a049?w=500"
        ]
    },
    {
        "name": "Top de Crochê Verão",
        "description": "Top elegante de crochê ideal para o verão. Design moderno e confortável.",
        "price": 35.50,
        "sizes": ["P", "M", "G"],
        "colors": ["#FFFFFF", "#F4E4BC", "#E8B4B8"],
        "images": [
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
            "https://images.unsplash.com/photo-1515372039661-2a1b7a6c55aa?w=500"
        ]
    },
    {
        "name": "Amigurumi Coelhinho",
        "description": "Adorável coelhinho amigurumi feito com muito carinho. Perfeito como presente ou decoração.",
        "price": 25.00,
        "sizes": ["Tamanho único"],
        "colors": ["#F8F8F8", "#FFB6C1", "#87CEEB"],
        "images": [
            "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500"
        ]
    }
]

def create_admin_session():
    """Create admin user and session for adding products"""
    try:
        # MongoDB connection
        client = MongoClient("mongodb://localhost:27017")
        db = client.test_database
        
        # Clean up previous test data
        db.users.delete_many({"email": {"$regex": "admin\\.test\\."}})
        db.user_sessions.delete_many({"session_token": {"$regex": "admin_session"}})
        
        # Create admin user
        timestamp = str(int(datetime.now().timestamp()))
        user_id = f"admin-user-{timestamp}"
        session_token = f"admin_session_{timestamp}"
        
        user_doc = {
            "user_id": user_id,
            "email": f"admin.test.{timestamp}@example.com",
            "name": "Admin Test User",
            "picture": "https://via.placeholder.com/150",
            "created_at": datetime.now(timezone.utc)
        }
        db.users.insert_one(user_doc)
        
        # Create admin session
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        session_doc = {
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        db.user_sessions.insert_one(session_doc)
        
        client.close()
        print(f"✅ Created admin user: {user_id}")
        print(f"✅ Created admin session: {session_token}")
        return session_token
        
    except Exception as e:
        print(f"❌ Failed to create admin session: {e}")
        return None

def add_sample_products():
    """Add sample products to the catalog"""
    session_token = create_admin_session()
    if not session_token:
        return False
    
    base_url = "https://amigurumi-shop-3.preview.emergentagent.com"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {session_token}'
    }
    
    print(f"\n🛍️ Adding {len(SAMPLE_PRODUCTS)} sample products...")
    
    for i, product in enumerate(SAMPLE_PRODUCTS, 1):
        try:
            response = requests.post(
                f"{base_url}/api/products",
                json=product,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                product_data = response.json()
                print(f"✅ {i}. Added: {product['name']} (ID: {product_data.get('product_id')})")
            else:
                print(f"❌ {i}. Failed to add: {product['name']} - Status: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                
        except Exception as e:
            print(f"❌ {i}. Error adding {product['name']}: {e}")
    
    # Clean up admin session
    try:
        client = MongoClient("mongodb://localhost:27017")
        db = client.test_database
        db.users.delete_many({"email": {"$regex": "admin\\.test\\."}})
        db.user_sessions.delete_many({"session_token": {"$regex": "admin_session"}})
        client.close()
        print("✅ Cleaned up admin session")
    except:
        pass
    
    return True

if __name__ == "__main__":
    print("🏪 Setting up sample products for Crochê Catalog...")
    if add_sample_products():
        print("\n✅ Sample products added successfully!")
        
        # Verify products were added
        try:
            response = requests.get("https://amigurumi-shop-3.preview.emergentagent.com/api/products")
            if response.status_code == 200:
                products = response.json()
                print(f"📦 Total products in catalog: {len(products)}")
            else:
                print("❌ Failed to verify products")
        except Exception as e:
            print(f"❌ Error verifying products: {e}")
    else:
        print("\n❌ Failed to add sample products")