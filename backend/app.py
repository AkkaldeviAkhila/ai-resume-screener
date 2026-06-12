# app.py — HuggingFace Spaces entry point
# This file is what HuggingFace Spaces looks for

import uvicorn
from app.main import app   # Import your FastAPI app

if __name__ == '__main__':
    # HuggingFace Spaces runs on port 7860
    uvicorn.run(app, host='0.0.0.0', port=7860)
