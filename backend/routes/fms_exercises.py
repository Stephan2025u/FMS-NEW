from fastapi import APIRouter
from typing import List
from models.fms_exercise import FMSExercise, FMS_EXERCISES

router = APIRouter(prefix="/fms-exercises", tags=["fms-exercises"])

@router.get("/", response_model=List[FMSExercise])
async def get_fms_exercises():
    """Get all FMS exercises with their scoring criteria"""
    return FMS_EXERCISES

@router.get("/{exercise_id}", response_model=FMSExercise)
async def get_fms_exercise(exercise_id: str):
    """Get a specific FMS exercise by ID"""
    for exercise in FMS_EXERCISES:
        if exercise.id == exercise_id:
            return exercise
    
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Exercise not found")