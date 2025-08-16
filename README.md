# T Cover Letter

**One‑liner:** Turn any cover letter into a clear T‑format view showing job requirements vs. candidate responses.

---

## Problem & Solution

* **Problem:** Recruiters waste time digging through long, unstructured cover letters.
* **Solution:** Convert them into a simple T‑letter format: requirements on the left, candidate evidence on the right, with quick checkboxes for ✅/❌.

---

## Architecture
Our system uses a pipeline and layered architecture:

* **Frontend:** React + Tailwind CSS
* **Backend:** Python + FastAPI
* **AI/NLP:** spaCy, HuggingFace, LLMs (e.g., GPT)
* **Database:** SQLite / PostgreSQL

---
## Framework Flow

flowchart LR
    A[Recruiter Input<br/>(Requirements + Cover Letter)] --> B[FastAPI Backend<br/>(Upload / Analyze)]
    B --> C[NLP / LLM Processing<br/>(spaCy, Transformers, GPT Models)]
    C --> D[JSON Output<br/>(Requirement → Candidate Match)]
    D --> E[T-Letter Frontend<br/>(React + Tailwind)]



---

## Features

* Input job requirements as tags
* Upload cover letter (PDF/DOCX/TXT) + optional résumé
* Generate structured T‑letter table
* Checkboxes for recruiter validation
* Live scoring & accept/reject buttons

---

## API Flow

1. **POST /upload** → Extract cover letter text
2. **POST /analyze** → Match text with requirements
3. **JSON Output** → { requirement : candidate response }

---

## Status

*  Frontend + backend prototypes
*  LLM integration in progress
*  Recruiter dashboard & exports

---

## License

MIT

---

**Built by Ruthvik Kanukuntla**
