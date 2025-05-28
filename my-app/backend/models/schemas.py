from pydantic import BaseModel
from typing import List

class AnalyzeRequest(BaseModel):
    cover_letter_text: str
    qualifications: List[str]
