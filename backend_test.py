#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class ReclaimAfricaAPITester:
    def __init__(self, base_url="https://reclaim-dashboard.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None
        self.user_token = None
        self.test_user_id = None
        self.test_claim_id = None

    def log(self, message):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, cookies=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers, cookies=cookies)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers, cookies=cookies)
            elif method == 'PATCH':
                response = self.session.patch(url, json=data, headers=test_headers, cookies=cookies)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    self.log(f"   Error: {error_detail}")
                except:
                    self.log(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            self.log(f"❌ {name} - Error: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin login"""
        self.log("\n=== TESTING ADMIN AUTHENTICATION ===")
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": "reclaimafrica.founder@gmail.com",
                "password": "Founder12344"
            }
        )
        
        if success:
            # Check if cookies are set
            if 'access_token' in self.session.cookies:
                self.log("✅ Admin login cookies set successfully")
                return True
            else:
                self.log("❌ Admin login cookies not set")
                return False
        return False

    def test_user_registration(self):
        """Test user registration"""
        self.log("\n=== TESTING USER REGISTRATION ===")
        
        test_email = f"testuser_{datetime.now().strftime('%H%M%S')}@example.com"
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "full_name": "Test User",
                "email": test_email,
                "phone": "+2348012345678",
                "password": "TestPassword123!"
            }
        )
        
        if success:
            self.test_user_id = response.get('id')
            if 'access_token' in self.session.cookies:
                self.log("✅ User registration cookies set successfully")
                return True, test_email
            else:
                self.log("❌ User registration cookies not set")
                return False, test_email
        return False, test_email

    def test_user_login(self, email):
        """Test user login"""
        self.log("\n=== TESTING USER LOGIN ===")
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": email,
                "password": "TestPassword123!"
            }
        )
        
        if success:
            if 'access_token' in self.session.cookies:
                self.log("✅ User login cookies set successfully")
                return True
            else:
                self.log("❌ User login cookies not set")
                return False
        return False

    def test_get_current_user(self):
        """Test get current user endpoint"""
        self.log("\n=== TESTING GET CURRENT USER ===")
        
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        
        if success:
            required_fields = ['id', 'email', 'full_name', 'role']
            for field in required_fields:
                if field not in response:
                    self.log(f"❌ Missing field in user response: {field}")
                    return False
            self.log("✅ User profile data complete")
            return True
        return False

    def test_create_claim(self):
        """Test claim creation"""
        self.log("\n=== TESTING CLAIM CREATION ===")
        
        claim_data = {
            "asset_type": "Unclaimed Dividends",
            "claiming_for": "I am the shareholder",
            "documents": ["Share certificate", "National ID or passport of claimant"],
            "full_name": "Test User",
            "phone": "+2348012345678",
            "email": "testuser@example.com",
            "state": "Lagos",
            "company_name": "Test Company Ltd",
            "estimated_shares": "1000",
            "estimated_value": "50000",
            "service_tier": "Guided Self Recovery"
        }
        
        success, response = self.run_test(
            "Create Claim",
            "POST",
            "claims",
            200,
            data=claim_data
        )
        
        if success:
            self.test_claim_id = response.get('id')
            required_fields = ['id', 'user_id', 'asset_type', 'status', 'created_at']
            for field in required_fields:
                if field not in response:
                    self.log(f"❌ Missing field in claim response: {field}")
                    return False
            
            if response.get('status') != 'Submitted':
                self.log(f"❌ Expected status 'Submitted', got '{response.get('status')}'")
                return False
                
            self.log("✅ Claim created successfully with correct status")
            return True
        return False

    def test_get_user_claims(self):
        """Test getting user claims"""
        self.log("\n=== TESTING GET USER CLAIMS ===")
        
        success, response = self.run_test(
            "Get User Claims",
            "GET",
            "claims",
            200
        )
        
        if success:
            if isinstance(response, list):
                self.log(f"✅ Retrieved {len(response)} claims for user")
                return True
            else:
                self.log("❌ Claims response is not a list")
                return False
        return False

    def test_admin_get_all_claims(self):
        """Test admin getting all claims"""
        self.log("\n=== TESTING ADMIN GET ALL CLAIMS ===")
        
        # First login as admin
        if not self.test_admin_login():
            return False
        
        success, response = self.run_test(
            "Admin Get All Claims",
            "GET",
            "admin/claims",
            200
        )
        
        if success:
            if isinstance(response, list):
                self.log(f"✅ Admin retrieved {len(response)} total claims")
                return True
            else:
                self.log("❌ Admin claims response is not a list")
                return False
        return False

    def test_admin_update_claim_status(self):
        """Test admin updating claim status"""
        self.log("\n=== TESTING ADMIN UPDATE CLAIM STATUS ===")
        
        if not self.test_claim_id:
            self.log("❌ No claim ID available for status update test")
            return False
        
        # Ensure admin is logged in
        if not self.test_admin_login():
            return False
        
        success, response = self.run_test(
            "Admin Update Claim Status",
            "PATCH",
            f"admin/claims/{self.test_claim_id}/status",
            200,
            data={"status": "Under Review"}
        )
        
        if success:
            if response.get('status') == 'Under Review':
                self.log("✅ Claim status updated successfully")
                return True
            else:
                self.log(f"❌ Status not updated correctly: {response}")
                return False
        return False

    def test_logout(self):
        """Test logout functionality"""
        self.log("\n=== TESTING LOGOUT ===")
        
        success, response = self.run_test(
            "User Logout",
            "POST",
            "auth/logout",
            200
        )
        
        if success:
            # Check if cookies are cleared
            if 'access_token' not in self.session.cookies:
                self.log("✅ Logout successful - cookies cleared")
                return True
            else:
                self.log("❌ Logout failed - cookies still present")
                return False
        return False

    def test_unauthorized_access(self):
        """Test unauthorized access to protected endpoints"""
        self.log("\n=== TESTING UNAUTHORIZED ACCESS ===")
        
        # Clear session cookies
        self.session.cookies.clear()
        
        # Test accessing protected endpoints without authentication
        endpoints = [
            ("claims", "GET"),
            ("claims", "POST"),
            ("admin/claims", "GET"),
            ("auth/me", "GET")
        ]
        
        unauthorized_tests_passed = 0
        for endpoint, method in endpoints:
            success, _ = self.run_test(
                f"Unauthorized {method} {endpoint}",
                method,
                endpoint,
                401,
                data={"test": "data"} if method == "POST" else None
            )
            if success:
                unauthorized_tests_passed += 1
        
        if unauthorized_tests_passed == len(endpoints):
            self.log("✅ All unauthorized access tests passed")
            return True
        else:
            self.log(f"❌ {len(endpoints) - unauthorized_tests_passed} unauthorized access tests failed")
            return False

def main():
    """Main test execution"""
    print("🚀 Starting Reclaim Africa API Tests")
    print("=" * 50)
    
    tester = ReclaimAfricaAPITester()
    
    # Test sequence
    test_results = []
    
    # 1. Test user registration and login
    reg_success, test_email = tester.test_user_registration()
    test_results.append(("User Registration", reg_success))
    
    if reg_success:
        # 2. Test get current user
        user_success = tester.test_get_current_user()
        test_results.append(("Get Current User", user_success))
        
        # 3. Test claim creation
        claim_success = tester.test_create_claim()
        test_results.append(("Create Claim", claim_success))
        
        # 4. Test get user claims
        user_claims_success = tester.test_get_user_claims()
        test_results.append(("Get User Claims", user_claims_success))
        
        # 5. Test user login (separate session)
        login_success = tester.test_user_login(test_email)
        test_results.append(("User Login", login_success))
    
    # 6. Test admin functionality
    admin_login_success = tester.test_admin_login()
    test_results.append(("Admin Login", admin_login_success))
    
    if admin_login_success:
        admin_claims_success = tester.test_admin_get_all_claims()
        test_results.append(("Admin Get All Claims", admin_claims_success))
        
        if tester.test_claim_id:
            status_update_success = tester.test_admin_update_claim_status()
            test_results.append(("Admin Update Claim Status", status_update_success))
    
    # 7. Test logout
    logout_success = tester.test_logout()
    test_results.append(("Logout", logout_success))
    
    # 8. Test unauthorized access
    unauth_success = tester.test_unauthorized_access()
    test_results.append(("Unauthorized Access Protection", unauth_success))
    
    # Print final results
    print("\n" + "=" * 50)
    print("📊 FINAL TEST RESULTS")
    print("=" * 50)
    
    for test_name, success in test_results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
    
    passed = sum(1 for _, success in test_results if success)
    total = len(test_results)
    
    print(f"\n📈 Overall: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the logs above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())