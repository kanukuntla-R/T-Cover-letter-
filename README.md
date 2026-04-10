Here’s a polished `README.md` you can use for this project, based on the app structure and current codebase. 

````md
# TalentMatch AI

TalentMatch AI is a full-stack application that helps recruiters evaluate applicants by comparing cover letter content against job qualifications. It uses AI to extract relevant evidence from uploaded cover letters and present those matches in a reviewer-friendly format.

## Features

- Upload cover letters in PDF, DOCX, or TXT format
- Extract text from uploaded files
- Enter required job qualifications
- Use AI to match qualifications against candidate content
- Review candidate responses in a structured evaluation interface
- Navigate between applicants and verify qualification matches

## Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Heroicons

### Backend
- FastAPI
- Python
- PyMuPDF
- python-docx
- OpenAI API

## Project Structure

```bash
kanukuntla-r-t-cover-letter/
├── README.md
└── my-app/
    ├── package.json
    ├── backend/
    │   ├── main.py
    │   ├── .env.example
    │   ├── models/
    │   │   └── schemas.py
    │   └── utils/
    │       ├── llm.py
    │       ├── matcher.py
    │       └── parser.py
    ├── public/
    └── src/
        ├── components/
        ├── data/
        └── pages/
````

## How It Works

1. A recruiter enters desired qualifications.
2. A candidate cover letter is uploaded.
3. The backend extracts text from the file.
4. The AI model compares the cover letter text to the qualification list.
5. The app returns matched phrases or sentences for each qualification.
6. The recruiter reviews and verifies each match in the evaluation UI.

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js 16+
* npm
* Python 3.8+

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd kanukuntla-r-t-cover-letter/my-app
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install fastapi uvicorn python-docx pymupdf python-multipart python-dotenv openai
```

Create your environment file:

```bash
cp .env.example .env
```

Then add your OpenAI API key to `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd my-app
npm install
```

## Running the App

### Start the backend

From the `backend` folder:

```bash
uvicorn main:app --reload
```

The backend will run at:

```bash
http://localhost:8000
```

### Start the frontend

From the `my-app` folder:

```bash
npm start
```

The frontend will run at:

```bash
http://localhost:3000
```

## API Endpoints

### `POST /upload`

Uploads a cover letter file and extracts its text.

**Accepted file types:**

* PDF
* DOCX
* TXT

**Response:**

```json
{
  "text": "Extracted cover letter text"
}
```

### `POST /analyze`

Matches cover letter content against a list of qualifications.

**Request body:**

```json
{
  "cover_letter_text": "Candidate cover letter content",
  "qualifications": [
    "Leadership",
    "Python",
    "Team Collaboration"
  ]
}
```

**Response:**

```json
{
  "matches": {
    "Leadership": "Managed a team of 6 developers for 2 years.",
    "Python": "Built Python-based data processing tools."
  }
}
```

## Environment Variables

Create a `.env` file in `backend/`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Current Notes

* The project currently uses mock applicant data in the evaluation flow.
* The frontend includes an upload and evaluation interface, but some integration pieces may still need refinement.
* The backend contains a duplicate `upload_cover_letter` function definition that should be cleaned up.
* The OpenAI integration in `llm.py` uses an older client style and may need updating depending on the installed OpenAI package version.

## Future Improvements

* Connect frontend upload and qualification input directly to backend APIs
* Store applicants and job postings in a database
* Add authentication for recruiter accounts
* Improve scoring and ranking logic
* Add support for resumes in addition to cover letters
* Export evaluation reports
* Add unit and integration tests

## Security Notes

* Never commit `.env` files
* Keep API keys private
* Rotate keys immediately if exposed
* Restrict CORS settings before production deployment

## License

This project is licensed under the MIT License.
