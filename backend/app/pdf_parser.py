import pdfplumber
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    '''
    Extract all text from a PDF file.
    file_bytes: the raw bytes of the uploaded PDF file
    Returns: a single string with all text from all pages
    '''
    text = ''

    # io.BytesIO converts raw bytes into a file-like object
    # pdfplumber needs a file-like object, not raw bytes
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:   # Some pages might be images (scanned) — skip those
                text += page_text + '\n'

    return text.strip()


def clean_text(text: str) -> str:
    '''Remove excessive whitespace and special characters from extracted text.'''
    import re
    # Replace multiple spaces/newlines with single space
    text = re.sub(r'\s+', ' ', text)
    # Remove non-printable characters
    text = re.sub(r'[^\x20-\x7E\n]', '', text)
    return text.strip()
