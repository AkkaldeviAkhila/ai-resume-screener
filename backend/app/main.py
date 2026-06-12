from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .nlp_engine import calculate_ats_score, extract_resume_skills
from .pdf_parser import extract_text_from_pdf, clean_text
from .job_recommender import get_job_recommendations
from .schemas import FullAnalysisResponse

app = FastAPI(
    title='AI Resume Screener API',
    description='NLP-powered resume analysis and job matching',
    version='1.0.0'
)

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000', 'https://*.hf.space'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health')
async def health():
    return {'status': 'healthy', 'model': 'all-MiniLM-L6-v2 loaded'}


@app.post('/api/analyse')
async def analyse_resume(
    resume: UploadFile = File(...),        # PDF file upload
    job_description: str = Form(...),      # Job description text
    location: str = Form(default='India')  # Location for job search
):
    '''
    Main endpoint: receives resume PDF + job description,
    returns ATS score, keyword analysis, and job recommendations.
    '''
    # ── Step 1: Validate file type ────────────────────────────────
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail='Please upload a PDF file')

    # ── Step 2: Read and extract PDF text ─────────────────────────
    pdf_bytes = await resume.read()     # Read file bytes from upload
    resume_text = extract_text_from_pdf(pdf_bytes)
    resume_text = clean_text(resume_text)

    if len(resume_text) < 50:   # PDF might be image-based (scanned)
        raise HTTPException(
            status_code=400,
            detail='Could not extract text from PDF. Please use a text-based PDF.'
        )

    # ── Step 3: Run NLP analysis ──────────────────────────────────
    analysis_result = calculate_ats_score(resume_text, job_description)

    # ── Step 4: Extract skills for job search ─────────────────────
    skills = extract_resume_skills(resume_text)

    # ── Step 5: Get job recommendations ──────────────────────────
    jobs = await get_job_recommendations(skills, location)

    # ── Step 6: Return everything ────────────────────────────────
    return {
        'analysis': {
            **analysis_result,
            'resume_text_preview': resume_text[:300] + '...'
        },
        'job_recommendations': jobs,
        'skills_found': skills
    }


@app.post('/api/analyse-text')
async def analyse_resume_text(
    resume_text: str = Form(...),
    job_description: str = Form(...),
    location: str = Form(default='India')
):
    '''Alternative endpoint for when user pastes resume text directly.'''
    resume_clean = clean_text(resume_text)
    analysis_result = calculate_ats_score(resume_clean, job_description)
    skills = extract_resume_skills(resume_clean)
    jobs = await get_job_recommendations(skills, location)
    return {
        'analysis': {**analysis_result, 'resume_text_preview': resume_clean[:300]},
        'job_recommendations': jobs,
        'skills_found': skills
    }