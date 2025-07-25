from pydantic import BaseModel, Field
from typing import Dict, Optional
from datetime import datetime
import uuid

class ExerciseScore(BaseModel):
    score: int = Field(..., ge=0, le=3)
    pain: bool = Field(default=False)
    notes: Optional[str] = None

class TestResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    test_date: datetime = Field(default_factory=datetime.utcnow)
    scores: Dict[str, ExerciseScore]
    total_score: int = Field(..., ge=0, le=21)
    assessor_notes: Optional[str] = None

class TestResultCreate(BaseModel):
    client_id: str
    scores: Dict[str, ExerciseScore]
    assessor_notes: Optional[str] = None
    
    def calculate_total_score(self) -> int:
        return sum(exercise_score.score for exercise_score in self.scores.values())