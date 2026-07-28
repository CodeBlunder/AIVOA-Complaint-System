# backend/app/services/document_parser.py
import pypdf          # replaces fitz/PyMuPDF — pure Python, no C libs needed
import docx
import io
from PIL import Image
import pytesseract

def extract_text_from_file(content: bytes, filename: str, content_type: str) -> str:
    filename_lower = filename.lower()

    if filename_lower.endswith(".pdf"):
        return _extract_from_pdf(content)
    elif filename_lower.endswith(".docx"):
        return _extract_from_docx(content)
    elif filename_lower.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")
    elif any(filename_lower.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".bmp"]):
        return _extract_from_image(content)
    else:
        return content.decode("utf-8", errors="ignore")

def _extract_from_pdf(content: bytes) -> str:
    reader = pypdf.PdfReader(io.BytesIO(content))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()

def _extract_from_docx(content: bytes) -> str:
    doc = docx.Document(io.BytesIO(content))
    return "\n".join([para.text for para in doc.paragraphs]).strip()

def _extract_from_image(content: bytes) -> str:
    image = Image.open(io.BytesIO(content))
    return pytesseract.image_to_string(image).strip()