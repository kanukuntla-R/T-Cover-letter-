import json
import uuid
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.utils.parser import extract_text_from_bytes
from backend.utils.matcher import best_sentence_per_requirement
from backend.models.schemas import (
    AnalyzeRequest,
    RequirementList,
    AnalysisResponse,
    DecisionRequest,
    UploadResponse,
)

app = FastAPI(title="T‑Cover‑Letter API")

# --------------------------- Configuration ---------------------------

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=["*"],
)

# --------------------------- Routes ---------------------------

@app.post("/upload", response_model=UploadResponse)
async def upload_files(
    cover_letter: UploadFile = File(...),
    resume: UploadFile | None = File(None),
    requirements: str = Form(...),
):
    """Receive files & requirements, return applicant_id plus extracted text."""
    if not cover_letter.filename.lower().endswith((".pdf", ".docx", ".txt", ".md")):
        raise HTTPException(400, "Unsupported cover-letter format (PDF/DOCX/TXT/MD)")

    data = await cover_letter.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(413, "Cover letter too large (max 5 MB)")

    try:
        reqs_json = json.loads(requirements)
        if not isinstance(reqs_json, list):
            raise ValueError
    except ValueError:
        raise HTTPException(400, "`requirements` must be a JSON list of strings")

    try:
        text = extract_text_from_bytes(cover_letter.filename, data)
    except Exception as exc:
        raise HTTPException(500, f"Could not extract text: {exc}")

    applicant_id = str(uuid.uuid4())
    applicant_dir = UPLOAD_DIR / applicant_id
    applicant_dir.mkdir(parents=True, exist_ok=True)

    ext = Path(cover_letter.filename).suffix or ".txt"
    cover_path = applicant_dir / f"cover_letter{ext}"
    cover_path.write_bytes(data)

    if resume and resume.filename:
        (applicant_dir / "resume").write_bytes(await resume.read())
        has_resume = True
    else:
        has_resume = False

    (applicant_dir / "requirements.json").write_text(
        json.dumps(reqs_json, indent=2), encoding="utf-8"
    )

    return {
        "status": "success",
        "applicant_id": applicant_id,
        "text": text,
        "has_resume": has_resume,
    }

# --------------------------- Further processing – LLM analysis ---------------------------

@app.post("/analyze/{applicant_id}", response_model=AnalysisResponse)
async def analyze_applicant(applicant_id: str, body: RequirementList):
    folder = UPLOAD_DIR / applicant_id
    cover_path = next(folder.glob("cover_letter*"), None)

    if not cover_path or not cover_path.exists():
        raise HTTPException(404, "Cover letter not found")

    analysis_path = folder / "analysis.json"
    if analysis_path.exists():
        return json.loads(analysis_path.read_text())

    raw_text = extract_text_from_bytes(cover_path.name, cover_path.read_bytes())

    # Clean weird OCR symbols and invisible characters
    text_no_unicode = raw_text.encode("ascii", errors="ignore").decode("utf-8", errors="ignore")
    cleaned_text = (
        text_no_unicode
        .replace("•", " ")
        .replace("‭", "")
        .replace("‬", "")
        .replace("\ufeff", "")
    )

    print("Extracted cover letter text:\n", cleaned_text)
    matches = best_sentence_per_requirement(cleaned_text, body.requirements)

    result = {"applicant_id": applicant_id, "matches": matches}
    analysis_path.write_text(json.dumps(result, indent=2), encoding="utf-8")

    return result

# --------------------------- Record reviewer decision ---------------------------

@app.patch("/decision/{applicant_id}")
async def decision(applicant_id: str, payload: DecisionRequest):
    folder = UPLOAD_DIR / applicant_id
    if not folder.exists():
        raise HTTPException(404, "Applicant not found")

    (folder / "decision.txt").write_text(payload.verdict, encoding="utf-8")
    return {"status": "ok"}

# --------------------------- Legacy endpoint (flat text + requirements list) ---------------------------

@app.post("/analyze")
async def analyze_cover_letter(request: AnalyzeRequest):
    matches = best_sentence_per_requirement(request.cover_letter_text, request.qualifications)
    return {"matches": matches}
