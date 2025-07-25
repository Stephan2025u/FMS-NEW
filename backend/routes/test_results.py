from fastapi import APIRouter, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.test_result import TestResult, TestResultCreate
from database import get_database
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/test-results", tags=["test-results"])

@router.post("/", response_model=TestResult)
async def create_test_result(
    test_data: TestResultCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new test result"""
    try:
        # Calculate total score
        total_score = test_data.calculate_total_score()
        
        # Create test result
        test_result = TestResult(
            **test_data.dict(),
            total_score=total_score
        )
        
        test_dict = test_result.dict()
        
        # Convert datetime to string for MongoDB
        test_dict["test_date"] = test_dict["test_date"].isoformat()
        
        # Convert ExerciseScore objects to dicts
        for exercise_id, exercise_score in test_dict["scores"].items():
            test_dict["scores"][exercise_id] = exercise_score.dict() if hasattr(exercise_score, 'dict') else exercise_score
        
        result = await db.test_results.insert_one(test_dict)
        if result.inserted_id:
            # Update client's test statistics
            await update_client_test_stats(test_data.client_id, total_score, test_result.test_date, db)
            
            logger.info(f"Created test result for client: {test_data.client_id}")
            return test_result
        else:
            raise HTTPException(status_code=500, detail="Failed to create test result")
    except Exception as e:
        logger.error(f"Error creating test result: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/client/{client_id}", response_model=List[TestResult])
async def get_client_test_results(
    client_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all test results for a specific client"""
    try:
        test_results = await db.test_results.find({"client_id": client_id}).to_list(1000)
        
        # Convert datetime strings back to datetime objects and scores back to ExerciseScore objects
        for test in test_results:
            test["test_date"] = test["test_date"]
            # Convert score dicts back to ExerciseScore objects
            for exercise_id, score_data in test["scores"].items():
                if isinstance(score_data, dict):
                    from models.test_result import ExerciseScore
                    test["scores"][exercise_id] = ExerciseScore(**score_data)
        
        return [TestResult(**test) for test in test_results]
    except Exception as e:
        logger.error(f"Error fetching test results for client {client_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{test_id}", response_model=TestResult)
async def get_test_result(
    test_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get a specific test result by ID"""
    try:
        test_result = await db.test_results.find_one({"id": test_id})
        if not test_result:
            raise HTTPException(status_code=404, detail="Test result not found")
        
        # Convert datetime string back to datetime object
        test_result["test_date"] = test_result["test_date"]
        
        # Convert score dicts back to ExerciseScore objects
        for exercise_id, score_data in test_result["scores"].items():
            if isinstance(score_data, dict):
                from ..models.test_result import ExerciseScore
                test_result["scores"][exercise_id] = ExerciseScore(**score_data)
        
        return TestResult(**test_result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching test result {test_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{test_id}")
async def delete_test_result(
    test_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a test result"""
    try:
        # Get test result first to get client_id
        test_result = await db.test_results.find_one({"id": test_id})
        if not test_result:
            raise HTTPException(status_code=404, detail="Test result not found")
        
        # Delete the test result
        result = await db.test_results.delete_one({"id": test_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Test result not found")
        
        # Update client's test statistics
        await recalculate_client_test_stats(test_result["client_id"], db)
        
        logger.info(f"Deleted test result: {test_id}")
        return {"message": "Test result deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting test result {test_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def update_client_test_stats(client_id: str, latest_score: int, test_date: datetime, db: AsyncIOMotorDatabase):
    """Update client's test statistics after a new test"""
    try:
        # Get current client
        client = await db.clients.find_one({"id": client_id})
        if not client:
            return
        
        # Update statistics
        total_tests = client.get("total_tests", 0) + 1
        
        await db.clients.update_one(
            {"id": client_id},
            {
                "$set": {
                    "total_tests": total_tests,
                    "latest_score": latest_score,
                    "last_test_date": test_date.isoformat()
                }
            }
        )
    except Exception as e:
        logger.error(f"Error updating client test stats: {str(e)}")

async def recalculate_client_test_stats(client_id: str, db: AsyncIOMotorDatabase):
    """Recalculate client's test statistics after a test is deleted"""
    try:
        # Get all remaining test results for this client
        test_results = await db.test_results.find({"client_id": client_id}).to_list(1000)
        
        if not test_results:
            # No tests left, reset stats
            await db.clients.update_one(
                {"id": client_id},
                {
                    "$set": {
                        "total_tests": 0,
                        "latest_score": None,
                        "last_test_date": None
                    }
                }
            )
        else:
            # Find the most recent test
            most_recent_test = max(test_results, key=lambda x: x["test_date"])
            
            await db.clients.update_one(
                {"id": client_id},
                {
                    "$set": {
                        "total_tests": len(test_results),
                        "latest_score": most_recent_test["total_score"],
                        "last_test_date": most_recent_test["test_date"]
                    }
                }
            )
    except Exception as e:
        logger.error(f"Error recalculating client test stats: {str(e)}")