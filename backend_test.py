#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for FMS Assessment System
Tests all endpoints systematically according to requirements
"""

import requests
import json
import uuid
from datetime import datetime
from typing import Dict, Any, List

# Configuration
BASE_URL = "https://937738aa-97b7-44db-b573-d428599a7a33.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class FMSBackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS
        self.test_results = []
        self.created_clients = []
        self.created_test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response_data"] = response_data
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()

    def test_api_health_check(self):
        """Test basic API connectivity"""
        print("=== 1. BASIC API HEALTH CHECK ===")
        
        try:
            response = requests.get(f"{self.base_url}/", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "FMS Assessment API" in data["message"]:
                    self.log_test("API Health Check", True, f"API is running: {data['message']}")
                else:
                    self.log_test("API Health Check", False, "Unexpected response format", data)
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")

    def test_fms_exercises_api(self):
        """Test FMS Exercises endpoints"""
        print("=== 2. FMS EXERCISES API ===")
        
        # Test GET all exercises
        try:
            response = requests.get(f"{self.base_url}/fms-exercises/", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                exercises = response.json()
                
                if isinstance(exercises, list) and len(exercises) == 7:
                    # Verify all 7 exercises are present with correct structure
                    expected_exercises = [
                        "deepSquat", "hurdleStep", "inLineLunge", "shoulderMobility",
                        "activeStraightLeg", "trunkStabilityPushup", "rotaryStability"
                    ]
                    
                    found_exercises = [ex.get("id") for ex in exercises]
                    missing = set(expected_exercises) - set(found_exercises)
                    
                    if not missing:
                        # Verify structure of first exercise
                        first_ex = exercises[0]
                        required_fields = ["id", "name", "description", "instructions", "scoring_criteria"]
                        
                        if all(field in first_ex for field in required_fields):
                            self.log_test("Get All FMS Exercises", True, f"Found all 7 exercises with correct structure")
                            
                            # Test individual exercise endpoint
                            test_exercise_id = exercises[0]["id"]
                            self.test_individual_exercise(test_exercise_id)
                        else:
                            missing_fields = [f for f in required_fields if f not in first_ex]
                            self.log_test("Get All FMS Exercises", False, f"Missing fields: {missing_fields}")
                    else:
                        self.log_test("Get All FMS Exercises", False, f"Missing exercises: {missing}")
                else:
                    self.log_test("Get All FMS Exercises", False, f"Expected 7 exercises, got {len(exercises) if isinstance(exercises, list) else 'non-list'}")
            else:
                self.log_test("Get All FMS Exercises", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get All FMS Exercises", False, f"Connection error: {str(e)}")

    def test_individual_exercise(self, exercise_id: str):
        """Test individual exercise endpoint"""
        try:
            response = requests.get(f"{self.base_url}/fms-exercises/{exercise_id}", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                exercise = response.json()
                required_fields = ["id", "name", "description", "instructions", "scoring_criteria"]
                
                if all(field in exercise for field in required_fields):
                    if exercise["id"] == exercise_id:
                        self.log_test("Get Individual FMS Exercise", True, f"Retrieved exercise: {exercise['name']}")
                    else:
                        self.log_test("Get Individual FMS Exercise", False, f"ID mismatch: expected {exercise_id}, got {exercise['id']}")
                else:
                    missing_fields = [f for f in required_fields if f not in exercise]
                    self.log_test("Get Individual FMS Exercise", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Get Individual FMS Exercise", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Individual FMS Exercise", False, f"Connection error: {str(e)}")

        # Test non-existent exercise
        try:
            response = requests.get(f"{self.base_url}/fms-exercises/nonexistent", headers=self.headers, timeout=10)
            if response.status_code == 404:
                self.log_test("Get Non-existent Exercise (404 test)", True, "Correctly returned 404 for non-existent exercise")
            else:
                self.log_test("Get Non-existent Exercise (404 test)", False, f"Expected 404, got {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.log_test("Get Non-existent Exercise (404 test)", False, f"Connection error: {str(e)}")

    def test_client_management_api(self):
        """Test Client Management CRUD operations"""
        print("=== 3. CLIENT MANAGEMENT API ===")
        
        # Test POST - Create new client
        client_data = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@email.com",
            "phone": "+1-555-0123",
            "date_of_birth": "1985-03-15",
            "occupation": "Physical Therapist"
        }
        
        created_client = self.test_create_client(client_data)
        if created_client:
            client_id = created_client["id"]
            self.created_clients.append(client_id)
            
            # Test GET all clients
            self.test_get_all_clients()
            
            # Test GET individual client
            self.test_get_individual_client(client_id)
            
            # Test PUT - Update client
            self.test_update_client(client_id)
            
            # Test DELETE will be done in cleanup

    def test_create_client(self, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """Test client creation"""
        try:
            response = requests.post(f"{self.base_url}/clients/", 
                                   json=client_data, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                client = response.json()
                required_fields = ["id", "name", "email", "created_at", "total_tests", "latest_score", "last_test_date"]
                
                if all(field in client for field in required_fields):
                    if (client["name"] == client_data["name"] and 
                        client["email"] == client_data["email"] and
                        client["total_tests"] == 0):
                        self.log_test("Create Client", True, f"Created client: {client['name']}")
                        return client
                    else:
                        self.log_test("Create Client", False, "Client data doesn't match input")
                else:
                    missing_fields = [f for f in required_fields if f not in client]
                    self.log_test("Create Client", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Create Client", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("Create Client", False, f"Connection error: {str(e)}")
        
        return None

    def test_get_all_clients(self):
        """Test getting all clients"""
        try:
            response = requests.get(f"{self.base_url}/clients/", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                clients = response.json()
                
                if isinstance(clients, list):
                    if len(clients) > 0:
                        # Verify structure of first client
                        first_client = clients[0]
                        required_fields = ["id", "name", "email", "created_at", "total_tests"]
                        
                        if all(field in first_client for field in required_fields):
                            self.log_test("Get All Clients", True, f"Retrieved {len(clients)} clients")
                        else:
                            missing_fields = [f for f in required_fields if f not in first_client]
                            self.log_test("Get All Clients", False, f"Missing fields in client: {missing_fields}")
                    else:
                        self.log_test("Get All Clients", True, "No clients found (empty list)")
                else:
                    self.log_test("Get All Clients", False, "Response is not a list")
            else:
                self.log_test("Get All Clients", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get All Clients", False, f"Connection error: {str(e)}")

    def test_get_individual_client(self, client_id: str):
        """Test getting individual client"""
        try:
            response = requests.get(f"{self.base_url}/clients/{client_id}", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                client = response.json()
                required_fields = ["id", "name", "email", "created_at", "total_tests"]
                
                if all(field in client for field in required_fields):
                    if client["id"] == client_id:
                        self.log_test("Get Individual Client", True, f"Retrieved client: {client['name']}")
                    else:
                        self.log_test("Get Individual Client", False, f"ID mismatch: expected {client_id}, got {client['id']}")
                else:
                    missing_fields = [f for f in required_fields if f not in client]
                    self.log_test("Get Individual Client", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Get Individual Client", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Individual Client", False, f"Connection error: {str(e)}")

    def test_update_client(self, client_id: str):
        """Test updating client"""
        update_data = {
            "name": "Sarah Johnson-Smith",
            "occupation": "Senior Physical Therapist"
        }
        
        try:
            response = requests.put(f"{self.base_url}/clients/{client_id}", 
                                  json=update_data, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                client = response.json()
                
                if (client["name"] == update_data["name"] and 
                    client["occupation"] == update_data["occupation"]):
                    self.log_test("Update Client", True, f"Updated client: {client['name']}")
                else:
                    self.log_test("Update Client", False, "Update data not reflected in response")
            else:
                self.log_test("Update Client", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("Update Client", False, f"Connection error: {str(e)}")

    def test_test_results_api(self):
        """Test Test Results API"""
        print("=== 4. TEST RESULTS API ===")
        
        if not self.created_clients:
            self.log_test("Test Results API", False, "No clients available for testing")
            return
        
        client_id = self.created_clients[0]
        
        # Create test result data
        test_result_data = {
            "client_id": client_id,
            "scores": {
                "deepSquat": {"score": 2, "pain": False, "notes": "Good depth, slight knee valgus"},
                "hurdleStep": {"score": 3, "pain": False, "notes": "Perfect form"},
                "inLineLunge": {"score": 1, "pain": False, "notes": "Balance issues"},
                "shoulderMobility": {"score": 2, "pain": False, "notes": "Limited right shoulder"},
                "activeStraightLeg": {"score": 3, "pain": False, "notes": "Excellent flexibility"},
                "trunkStabilityPushup": {"score": 2, "pain": False, "notes": "Good core stability"},
                "rotaryStability": {"score": 1, "pain": False, "notes": "Coordination challenges"}
            },
            "assessor_notes": "Overall good movement patterns with some areas for improvement"
        }
        
        # Test POST - Create test result
        created_test = self.test_create_test_result(test_result_data)
        if created_test:
            test_id = created_test["id"]
            self.created_test_results.append(test_id)
            
            # Test GET by client
            self.test_get_client_test_results(client_id)
            
            # Test GET individual test result
            self.test_get_individual_test_result(test_id)
            
            # Verify client statistics were updated
            self.test_client_statistics_update(client_id)

    def test_create_test_result(self, test_data: Dict[str, Any]) -> Dict[str, Any]:
        """Test test result creation"""
        try:
            response = requests.post(f"{self.base_url}/test-results/", 
                                   json=test_data, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                test_result = response.json()
                required_fields = ["id", "client_id", "test_date", "scores", "total_score"]
                
                if all(field in test_result for field in required_fields):
                    # Verify total score calculation (should be 14 based on test data)
                    expected_total = sum(score["score"] for score in test_data["scores"].values())
                    
                    if (test_result["client_id"] == test_data["client_id"] and
                        test_result["total_score"] == expected_total):
                        self.log_test("Create Test Result", True, f"Created test result with total score: {test_result['total_score']}")
                        return test_result
                    else:
                        self.log_test("Create Test Result", False, f"Data mismatch - expected total: {expected_total}, got: {test_result['total_score']}")
                else:
                    missing_fields = [f for f in required_fields if f not in test_result]
                    self.log_test("Create Test Result", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Create Test Result", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("Create Test Result", False, f"Connection error: {str(e)}")
        
        return None

    def test_get_client_test_results(self, client_id: str):
        """Test getting test results for a client"""
        try:
            response = requests.get(f"{self.base_url}/test-results/client/{client_id}", 
                                  headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                test_results = response.json()
                
                if isinstance(test_results, list):
                    if len(test_results) > 0:
                        # Verify structure of first test result
                        first_test = test_results[0]
                        required_fields = ["id", "client_id", "test_date", "scores", "total_score"]
                        
                        if all(field in first_test for field in required_fields):
                            if first_test["client_id"] == client_id:
                                self.log_test("Get Client Test Results", True, f"Retrieved {len(test_results)} test results for client")
                            else:
                                self.log_test("Get Client Test Results", False, f"Client ID mismatch in results")
                        else:
                            missing_fields = [f for f in required_fields if f not in first_test]
                            self.log_test("Get Client Test Results", False, f"Missing fields: {missing_fields}")
                    else:
                        self.log_test("Get Client Test Results", True, "No test results found for client (empty list)")
                else:
                    self.log_test("Get Client Test Results", False, "Response is not a list")
            else:
                self.log_test("Get Client Test Results", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Client Test Results", False, f"Connection error: {str(e)}")

    def test_get_individual_test_result(self, test_id: str):
        """Test getting individual test result"""
        try:
            response = requests.get(f"{self.base_url}/test-results/{test_id}", 
                                  headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                test_result = response.json()
                required_fields = ["id", "client_id", "test_date", "scores", "total_score"]
                
                if all(field in test_result for field in required_fields):
                    if test_result["id"] == test_id:
                        self.log_test("Get Individual Test Result", True, f"Retrieved test result with score: {test_result['total_score']}")
                    else:
                        self.log_test("Get Individual Test Result", False, f"ID mismatch: expected {test_id}, got {test_result['id']}")
                else:
                    missing_fields = [f for f in required_fields if f not in test_result]
                    self.log_test("Get Individual Test Result", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Get Individual Test Result", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Individual Test Result", False, f"Connection error: {str(e)}")

    def test_client_statistics_update(self, client_id: str):
        """Test that client statistics are updated after test creation"""
        try:
            response = requests.get(f"{self.base_url}/clients/{client_id}", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                client = response.json()
                
                if (client["total_tests"] > 0 and 
                    client["latest_score"] is not None and 
                    client["last_test_date"] is not None):
                    self.log_test("Client Statistics Update", True, 
                                f"Client stats updated - Tests: {client['total_tests']}, Latest Score: {client['latest_score']}")
                else:
                    self.log_test("Client Statistics Update", False, 
                                f"Stats not updated - Tests: {client['total_tests']}, Score: {client['latest_score']}")
            else:
                self.log_test("Client Statistics Update", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_test("Client Statistics Update", False, f"Connection error: {str(e)}")

    def test_data_validation(self):
        """Test data validation"""
        print("=== 5. DATA VALIDATION TESTS ===")
        
        # Test invalid client creation (missing required fields)
        invalid_client = {"name": ""}  # Missing email, empty name
        
        try:
            response = requests.post(f"{self.base_url}/clients/", 
                                   json=invalid_client, headers=self.headers, timeout=10)
            
            if response.status_code in [400, 422]:  # Validation error
                self.log_test("Invalid Client Validation", True, "Correctly rejected invalid client data")
            else:
                self.log_test("Invalid Client Validation", False, f"Expected validation error, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Invalid Client Validation", False, f"Connection error: {str(e)}")

        # Test invalid test result (invalid score range)
        if self.created_clients:
            invalid_test = {
                "client_id": self.created_clients[0],
                "scores": {
                    "deepSquat": {"score": 5, "pain": False}  # Invalid score > 3
                }
            }
            
            try:
                response = requests.post(f"{self.base_url}/test-results/", 
                                       json=invalid_test, headers=self.headers, timeout=10)
                
                if response.status_code in [400, 422]:  # Validation error
                    self.log_test("Invalid Score Validation", True, "Correctly rejected invalid score range")
                else:
                    self.log_test("Invalid Score Validation", False, f"Expected validation error, got {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test("Invalid Score Validation", False, f"Connection error: {str(e)}")

    def test_error_handling(self):
        """Test error handling for various scenarios"""
        print("=== 6. ERROR HANDLING TESTS ===")
        
        # Test non-existent client
        fake_client_id = str(uuid.uuid4())
        try:
            response = requests.get(f"{self.base_url}/clients/{fake_client_id}", 
                                  headers=self.headers, timeout=10)
            
            if response.status_code == 404:
                self.log_test("Non-existent Client Error", True, "Correctly returned 404 for non-existent client")
            else:
                self.log_test("Non-existent Client Error", False, f"Expected 404, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Non-existent Client Error", False, f"Connection error: {str(e)}")

        # Test non-existent test result
        fake_test_id = str(uuid.uuid4())
        try:
            response = requests.get(f"{self.base_url}/test-results/{fake_test_id}", 
                                  headers=self.headers, timeout=10)
            
            if response.status_code == 404:
                self.log_test("Non-existent Test Result Error", True, "Correctly returned 404 for non-existent test result")
            else:
                self.log_test("Non-existent Test Result Error", False, f"Expected 404, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Non-existent Test Result Error", False, f"Connection error: {str(e)}")

    def cleanup_test_data(self):
        """Clean up created test data"""
        print("=== 7. CLEANUP & DELETE TESTS ===")
        
        # Delete test results first
        for test_id in self.created_test_results:
            try:
                response = requests.delete(f"{self.base_url}/test-results/{test_id}", 
                                         headers=self.headers, timeout=10)
                
                if response.status_code == 200:
                    self.log_test("Delete Test Result", True, f"Deleted test result: {test_id}")
                else:
                    self.log_test("Delete Test Result", False, f"HTTP {response.status_code}", response.text)
                    
            except requests.exceptions.RequestException as e:
                self.log_test("Delete Test Result", False, f"Connection error: {str(e)}")

        # Delete clients
        for client_id in self.created_clients:
            try:
                response = requests.delete(f"{self.base_url}/clients/{client_id}", 
                                         headers=self.headers, timeout=10)
                
                if response.status_code == 200:
                    self.log_test("Delete Client", True, f"Deleted client: {client_id}")
                else:
                    self.log_test("Delete Client", False, f"HTTP {response.status_code}", response.text)
                    
            except requests.exceptions.RequestException as e:
                self.log_test("Delete Client", False, f"Connection error: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting FMS Assessment Backend API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Run tests in order
        self.test_api_health_check()
        self.test_fms_exercises_api()
        self.test_client_management_api()
        self.test_test_results_api()
        self.test_data_validation()
        self.test_error_handling()
        self.cleanup_test_data()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for test in self.test_results if test["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for test in self.test_results:
                if not test["success"]:
                    print(f"   ❌ {test['test']}: {test['details']}")
        
        print("\n" + "=" * 60)
        return passed_tests, failed_tests

if __name__ == "__main__":
    tester = FMSBackendTester()
    passed, failed = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if failed == 0 else 1)