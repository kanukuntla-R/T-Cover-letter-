import fitz  # PyMuPDF
from docx import Document
import os

def extract_text_from_file(upload_file):
    filename = upload_file.filename.lower()
    contents = upload_file.file.read()

    # Handle PDF
    if filename.endswith(".pdf"):
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text

    # Handle DOCX
    elif filename.endswith(".docx"):
        # Save file temporarily to parse with python-docx
        temp_path = "uploads/temp.docx"
        os.makedirs("uploads", exist_ok=True)
        with open(temp_path, "wb") as temp_file:
            temp_file.write(contents)
        doc = Document(temp_path)
        return "\n".join([para.text for para in doc.paragraphs])

    # Handle TXT
    elif filename.endswith(".txt"):
        return contents.decode("utf-8")

    else:
        raise ValueError("Unsupported file format. Please upload PDF, DOCX, or TXT.")
