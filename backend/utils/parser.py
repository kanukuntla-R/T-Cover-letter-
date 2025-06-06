import fitz  # PyMuPDF
from docx import Document
from pathlib import Path

# ---------------------------------------------------------------------------
# Text‑extraction helpers
# ---------------------------------------------------------------------------

def extract_text_from_bytes(filename: str, data: bytes) -> str:
    """Return *plain text* from file **bytes**.

    Supports PDF, DOCX, TXT/MD. Raises ValueError for any other extension.
    """
    name = filename.lower()

    # ---- PDF ---------------------------------------------------------------
    if name.endswith(".pdf"):
        doc = fitz.open(stream=data, filetype="pdf")
        return " ".join(page.get_text() for page in doc)

    # ---- DOCX --------------------------------------------------------------
    if name.endswith(".docx"):
        # python‑docx needs a temp file on disk
        temp_path = Path("uploads") / "_upload_tmp.docx"
        temp_path.parent.mkdir(exist_ok=True)
        with open(temp_path, "wb") as f:
            f.write(data)
        try:
            text = " ".join(p.text for p in Document(temp_path).paragraphs)
        finally:
            temp_path.unlink(missing_ok=True)
        return text

    # ---- TXT/MD ------------------------------------------------------------
    if name.endswith((".txt", ".md")):
        return data.decode("utf-8", errors="ignore")

    # -----------------------------------------------------------------------
    raise ValueError("Unsupported file type; only PDF, DOCX, TXT/MD are allowed.")

# ---------------------------------------------------------------------------
# Legacy path‑based wrapper (older code may still call this)
# ---------------------------------------------------------------------------

def extract_text(file_path: Path) -> str:
    """Back‑compat convenience: read bytes from *file_path* and delegate."""
    return extract_text_from_bytes(file_path.name, file_path.read_bytes())