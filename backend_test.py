#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Crochê Catalog Site
Tests all endpoints including auth and product CRUD operations
"""

import requests
import sys
import json
from datetime import datetime
from pymongo import MongoClient

class CrochetAPITester:
    def __init__(self):
        self.base_url = "https://amigurumi-shop-3.preview.emergentagent.com"
        self.session_token = None
        self.test_user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
        # MongoDB connection for test data setup
        self.mongo_client = MongoClient("mongodb://localhost:27017")
        self.db = self.mongo_client.test_database
        
        print(f"🔍 Testing Crochê Catalog API at: {self.base_url}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, description=""):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
            
        if self.session_token:
            test_headers['Authorization'] = f'Bearer {self.session_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        if description:
            print(f"   {description}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    return True, response_data
                except:
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                print(f"❌ FAILED - {error_msg}")
                try:
                    print(f"   Response: {response.text[:200]}")
                except:
                    pass
                self.failed_tests.append({
                    "test": name,
                    "error": error_msg,
                    "response": response.text[:200] if hasattr(response, 'text') else 'No response'
                })
                return False, {}

        except Exception as e:
            error_msg = f"Request failed: {str(e)}"
            print(f"❌ FAILED - {error_msg}")
            self.failed_tests.append({
                "test": name,
                "error": error_msg
            })
            return False, {}

    def setup_test_auth_data(self):
        """Create test user and session in MongoDB for auth testing"""
        try:
            # Clean up previous test data
            self.db.users.delete_many({"email": {"$regex": "test\\.user\\."}})
            self.db.user_sessions.delete_many({"session_token": {"$regex": "test_session"}})
            
            # Create test user
            timestamp = str(int(datetime.now().timestamp()))
            self.test_user_id = f"test-user-{timestamp}"
            session_token = f"test_session_{timestamp}"
            
            user_doc = {
                "user_id": self.test_user_id,
                "email": f"test.user.{timestamp}@example.com",
                "name": "Test User",
                "picture": "https://via.placeholder.com/150",
                "created_at": datetime.utcnow()
            }
            self.db.users.insert_one(user_doc)
            
            # Create test session
            session_doc = {
                "user_id": self.test_user_id,
                "session_token": session_token,
                "expires_at": datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
                "created_at": datetime.utcnow()
            }
            self.db.user_sessions.insert_one(session_doc)
            
            self.session_token = session_token
            print(f"✅ Created test user: {self.test_user_id}")
            print(f"✅ Created test session: {session_token}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to setup test auth data: {e}")
            return False

    def test_public_endpoints(self):
        """Test all public endpoints"""
        print("\n" + "="*50)
        print("🌐 TESTING PUBLIC ENDPOINTS")
        print("="*50)
        
        # Test GET /products (public)
        success, products = self.run_test(
            "Get All Products",
            "GET",
            "products",
            200,
            description="Should return list of products without authentication"
        )
        
        if success and products:
            print(f"   Found {len(products)} products")
            
            # Test individual product if any exist
            if len(products) > 0:
                product_id = products[0].get('product_id')
                if product_id:
                    self.run_test(
                        "Get Single Product",
                        "GET",
                        f"products/{product_id}",
                        200,
                        description=f"Should return details for product {product_id}"
                    )
        
        # Test invalid product ID
        self.run_test(
            "Get Non-existent Product",
            "GET",
            "products/invalid-id",
            404,
            description="Should return 404 for non-existent product"
        )

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n" + "="*50)
        print("🔐 TESTING AUTH ENDPOINTS")
        print("="*50)
        
        # Test /auth/me without token
        self.run_test(
            "Get Current User - No Auth",
            "GET",
            "auth/me",
            401,
            description="Should return 401 without authentication"
        )
        
        # Test /auth/me with valid token
        if self.session_token:
            success, user_data = self.run_test(
                "Get Current User - With Auth",
                "GET",
                "auth/me",
                200,
                description="Should return user data with valid session token"
            )
            
            if success and user_data:
                print(f"   User: {user_data.get('name')} ({user_data.get('email')})")
        
        # Test logout
        if self.session_token:
            self.run_test(
                "Logout",
                "POST",
                "auth/logout",
                200,
                description="Should logout current user"
            )

    def test_admin_endpoints(self):
        """Test admin-only product CRUD endpoints"""
        print("\n" + "="*50)
        print("👨‍💼 TESTING ADMIN ENDPOINTS")
        print("="*50)
        
        if not self.session_token:
            print("❌ No session token available, skipping admin tests")
            return
            
        # Test create product
        test_product = {
            "name": "Teste Bolsa de Crochê",
            "description": "Uma linda bolsa de crochê feita para testes",
            "price": 45.99,
            "sizes": ["P", "M", "G"],
            "colors": ["#FFFFFF", "#FF0000", "#0000FF"],
            "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD//2Q=="]
        }
        
        success, created_product = self.run_test(
            "Create Product",
            "POST",
            "products",
            201,
            data=test_product,
            description="Should create new product with admin auth"
        )
        
        if success and created_product:
            product_id = created_product.get('product_id')
            print(f"   Created product ID: {product_id}")
            
            # Test update product
            update_data = {
                "name": "Teste Bolsa de Crochê ATUALIZADA",
                "price": 55.99
            }
            
            self.run_test(
                "Update Product",
                "PUT",
                f"products/{product_id}",
                200,
                data=update_data,
                description="Should update existing product"
            )
            
            # Test delete product
            self.run_test(
                "Delete Product",
                "DELETE",
                f"products/{product_id}",
                200,
                description="Should delete the test product"
            )
        
        # Test admin endpoints without auth
        temp_token = self.session_token
        self.session_token = None
        
        self.run_test(
            "Create Product - No Auth",
            "POST",
            "products",
            401,
            data=test_product,
            description="Should return 401 without authentication"
        )
        
        self.session_token = temp_token

    def test_error_handling(self):
        """Test error handling and validation"""
        print("\n" + "="*50)
        print("⚠️ TESTING ERROR HANDLING")
        print("="*50)
        
        if not self.session_token:
            print("❌ No session token available, skipping error tests")
            return
        
        # Test create product with missing fields
        invalid_product = {
            "name": "Incomplete Product",
            # Missing required fields
        }
        
        self.run_test(
            "Create Product - Invalid Data",
            "POST",
            "products",
            422,
            data=invalid_product,
            description="Should return validation error for incomplete product data"
        )
        
        # Test update non-existent product
        self.run_test(
            "Update Non-existent Product",
            "PUT",
            "products/invalid-id",
            404,
            data={"name": "Test"},
            description="Should return 404 for non-existent product update"
        )
        
        # Test delete non-existent product
        self.run_test(
            "Delete Non-existent Product",
            "DELETE",
            "products/invalid-id",
            404,
            description="Should return 404 for non-existent product deletion"
        )

    def cleanup_test_data(self):
        """Clean up test data"""
        try:
            if self.test_user_id:
                # Clean up test user and sessions
                self.db.users.delete_many({"email": {"$regex": "test\\.user\\."}})
                self.db.user_sessions.delete_many({"session_token": {"$regex": "test_session"}})
                print("✅ Cleaned up test auth data")
            
            # Clean up any test products
            self.db.products.delete_many({"name": {"$regex": "Teste"}})
            print("✅ Cleaned up test products")
            
        except Exception as e:
            print(f"⚠️ Warning: Failed to clean up test data: {e}")

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*50)
        print("📊 TEST SUMMARY")
        print("="*50)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"Total Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for i, test in enumerate(self.failed_tests, 1):
                print(f"{i}. {test['test']}: {test['error']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test runner"""
    tester = CrochetAPITester()
    
    try:
        # Setup test authentication data
        print("🔧 Setting up test authentication data...")
        if not tester.setup_test_auth_data():
            print("❌ Failed to setup auth data, some tests will be skipped")
        
        # Run all test suites
        tester.test_public_endpoints()
        tester.test_auth_endpoints()
        tester.test_admin_endpoints()
        tester.test_error_handling()
        
        # Print summary and cleanup
        all_passed = tester.print_summary()
        tester.cleanup_test_data()
        
        return 0 if all_passed else 1
        
    except KeyboardInterrupt:
        print("\n⚠️ Tests interrupted by user")
        tester.cleanup_test_data()
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        tester.cleanup_test_data()
        return 1
    finally:
        if tester.mongo_client:
            tester.mongo_client.close()

if __name__ == "__main__":
    sys.exit(main())