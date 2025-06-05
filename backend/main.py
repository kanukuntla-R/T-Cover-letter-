import json
import os
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from utils.parser import extract_text_from_file, extract_text
from utils.matcher import best_sentence_per_requirement
from models.schemas import AnalyzeRequest, RequirementList, AnalysisResponse, DecisionRequest

app = FastAPI()

# Configuration
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_files(
    cover_letter: UploadFile = File(...),
    resume: UploadFile = File(None),
    requirements: str = Form(...)
):
    """
    Upload files and requirements for a new applicant.
    Returns the applicant_id for further operations.
    """
    try:
        import uuid
        
        # Generate a unique applicant ID
        applicant_id = str(uuid.uuid4())
        applicant_dir = UPLOAD_DIR / applicant_id
        applicant_dir.mkdir(parents=True, exist_ok=True)
        
        # Save cover letter
        cover_letter_path = applicant_dir / "cover_letter"
        with open(cover_letter_path, "wb") as buffer:
            content = await cover_letter.read()
            buffer.write(content)
        
        # Save resume if provided
        resume_path = None
        if resume and resume.filename:
            resume_path = applicant_dir / "resume"
            with open(resume_path, "wb") as buffer:
                content = await resume.read()
                buffer.write(content)
        
        # Save requirements
        try:
            requirements_data = json.loads(requirements)
            if isinstance(requirements_data, list):
                requirements_path = applicant_dir / "requirements.json"
                requirements_path.write_text(json.dumps(requirements_data, indent=2), encoding="utf-8")
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid requirements format")
        
        # Extract text from cover letter for immediate response
        text = extract_text(cover_letter_path)
        
        return {
            "status": "success",
            "applicant_id": applicant_id,
            "text": text,
            "has_resume": resume_path is not None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/analyze/{applicant_id}", response_model=AnalysisResponse)
async def analyze_applicant(applicant_id: str, body: RequirementList):
    """Analyze an applicant's cover letter against requirements"""
    try:
        folder = UPLOAD_DIR / applicant_id
        cover_letter_path = folder / "cover_letter"
        analysis_file = folder / "analysis.json"

        if not cover_letter_path.exists():
            raise HTTPException(status_code=404, detail="Applicant not found")

        # Return cached analysis if available
        if analysis_file.exists():
            return json.loads(analysis_file.read_text())

        # Process the cover letter
        text = extract_text(cover_letter_path)
        matches = best_sentence_per_requirement(text, body.requirements)

        # Save analysis for future use
        result = {"applicant_id": applicant_id, "matches": matches}
        analysis_file.write_text(json.dumps(result, indent=2))
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/decision/{applicant_id}")
async def decision(applicant_id: str, verdict: str = Body(..., pattern="^(accepted|rejected)$")):
    """
    Store the reviewer's verdict as plain text.
    Front-end sends raw string: 'accepted' or 'rejected'.
    """
    folder = UPLOAD_DIR / applicant_id
    if not folder.exists():
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    # Ensure the folder exists
    folder.mkdir(parents=True, exist_ok=True)
    
    # Save the verdict to a file
    decision_file = folder / "decision.txt"
    decision_file.write_text(verdict, encoding="utf-8")
    
    return {"status": "ok"}

# Keep the old analyze endpoint for backward compatibility
@app.post("/analyze")
async def analyze_cover_letter(request: AnalyzeRequest):
    """Legacy endpoint - kept for backward compatibility"""
    matches = best_sentence_per_requirement(
        request.cover_letter_text,
        request.qualifications
    )
    return {"matches": matches}
