from pydantic import BaseModel, Field
from typing import List, Dict

# ---------------------------------------------------------------------------
# Incoming payloads
# ---------------------------------------------------------------------------

class AnalyzeRequest(BaseModel):
    cover_letter_text: str
    qualifications: List[str]

class RequirementList(BaseModel):
    requirements: List[str] = Field(..., min_items=1)

class DecisionRequest(BaseModel):
    verdict: str = Field(..., pattern="^(accepted|rejected)$")

# ---------------------------------------------------------------------------
# Outgoing responses
# ---------------------------------------------------------------------------

class AnalysisResponse(BaseModel):
    applicant_id: str
    matches: Dict[str, str]

class UploadResponse(BaseModel):
    status: str
    applicant_id: str
    text: str
    has_resume: bool