from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class AnalyzeRequest(BaseModel):
    cover_letter_text: str
    qualifications: List[str]

class RequirementList(BaseModel):
    requirements: List[str] = Field(..., min_items=1)

class AnalysisResponse(BaseModel):
    applicant_id: str
    matches: Dict[str, str]

class DecisionRequest(BaseModel):
    verdict: str = Field(..., regex="^(accepted|rejected)$")
