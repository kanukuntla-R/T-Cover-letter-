import fitz  # PyMuPDF
from docx import Document
import os
from pathlib import Path

def extract_text(file_path: Path) -> str:
    """Extract text from a file given its path."""
    suffix = file_path.suffix.lower()
    
    if suffix == ".pdf":
        doc = fitz.open(file_path)
        return " ".join(page.get_text() for page in doc)
        
    elif suffix in [".docx", ".doc"]:
        return " ".join(p.text for p in Document(file_path).paragraphs)
        
    elif suffix in [".txt", ".md"]:
        return file_path.read_text(encoding="utf-8", errors="ignore")
        
    else:
        raise ValueError(f"Unsupported file type: {suffix}")

def extract_text_from_file(upload_file):
    """Extract text from an uploaded file object."""
    filename = upload_file.filename.lower()
    contents = upload_file.file.read()
    
    # Create a temporary file with the correct extension
    temp_ext = ".txt"
    if "." in filename:
        temp_ext = "" + filename[filename.rindex("."):]
    
    temp_path = Path(f"temp{temp_ext}")
    try:
        # Save the uploaded content to a temporary file
        with open(temp_path, "wb") as f:
            f.write(contents)
        
        # Use the path-based extract_text function
        return extract_text(temp_path)
    except Exception as e:
        raise ValueError(f"Error processing file: {str(e)}")
    finally:
        # Clean up the temporary file
        if temp_path.exists():
            try:
                temp_path.unlink()
            except:
                pass  # Ignore cleanup errors
