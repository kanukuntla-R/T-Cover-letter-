from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from utils.parser import extract_text_from_file
from models.schemas import AnalyzeRequest
from utils.llm import match_qualifications_with_llm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_cover_letter(file: UploadFile = File(...)):
    try:
        text = extract_text_from_file(file)
        return {"text": text}
    except Exception as e:
        return {"error": str(e)}

@app.post("/analyze")
async def analyze_cover_letter(request: AnalyzeRequest):
    result_json = match_qualifications_with_llm(
        request.cover_letter_text,
        request.qualifications
    )
    return {"matches": result_json}


async def upload_cover_letter(file: UploadFile = File(...)):
    try:
        text = extract_text_from_file(file)
        return {"text": text}
    except Exception as e:
        return {"error": str(e)}
