# Resume Analyzer Backend

This is the backend service for the Resume Analyzer application. It provides API endpoints for uploading resumes, analyzing them against job requirements, and tracking hiring decisions.

## Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file based on `.env.example` and configure any necessary environment variables.

## Running the Server

```bash
uvicorn main:app --reload
```

The server will start on `http://127.0.0.1:8000`.

## API Endpoints

- `POST /upload/{applicant_id}` - Upload a resume/cover letter for an applicant
- `POST /analyze/{applicant_id}` - Analyze an applicant's resume against requirements
- `PATCH /decision/{applicant_id}` - Update the hiring decision for an applicant

## Development

- The server uses FastAPI with automatic documentation available at:
  - Swagger UI: `http://127.0.0.1:8000/docs`
  - ReDoc: `http://127.0.0.1:8000/redoc`

## Dependencies

- FastAPI - Web framework
- Uvicorn - ASGI server
- PyMuPDF - PDF text extraction
- python-docx - DOCX text extraction
- sentence-transformers - Semantic text matching
- python-dotenv - Environment variable management
