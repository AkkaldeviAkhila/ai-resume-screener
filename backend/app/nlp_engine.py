from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import re
import os
from dotenv import load_dotenv

load_dotenv()

# Load the AI model ONCE when the server starts
# Loading takes ~5 seconds — we never want to do this per request
# all-MiniLM-L6-v2: small, fast, very accurate — perfect for resume matching
# First run downloads ~80MB from HuggingFace automatically
MODEL_NAME = os.getenv('MODEL_NAME', 'sentence-transformers/all-MiniLM-L6-v2')
model = SentenceTransformer(MODEL_NAME)
print(f'✅ NLP Model loaded: {MODEL_NAME}')


# ── IMPORTANT TECH KEYWORDS ──────────────────────────────────────
# This list covers 95% of tech job requirements
# We check which of these appear in the job description but NOT in resume
TECH_KEYWORDS = [
    # Languages
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust',
    'kotlin', 'swift', 'r', 'scala', 'php', 'ruby',
    # Web
    'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'fastapi',
    'html', 'css', 'rest api', 'graphql', 'spring boot',
    # Data / AI
    'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch',
    'scikit-learn', 'pandas', 'numpy', 'huggingface', 'transformers',
    'data analysis', 'power bi', 'tableau', 'sql', 'excel',
    # Infrastructure
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'linux', 'git',
    'ci/cd', 'jenkins', 'terraform', 'redis', 'postgresql', 'mongodb',
    # Soft skills
    'agile', 'scrum', 'communication', 'leadership', 'problem solving',
]


def calculate_ats_score(resume_text: str, job_description: str) -> dict:
    '''
    Main function: takes resume text and job description,
    returns ATS score + analysis.
    '''
    # ── STEP 1: Generate embeddings for both texts ────────────────
    # encode() sends text through the neural network → returns a vector
    # The vector has 384 numbers (dimensions) for this model
    resume_embedding = model.encode([resume_text])      # shape: (1, 384)
    jd_embedding = model.encode([job_description])      # shape: (1, 384)

    # ── STEP 2: Calculate cosine similarity ──────────────────────
    # Result is between 0.0 (no match) and 1.0 (perfect match)
    similarity = cosine_similarity(resume_embedding, jd_embedding)[0][0]
    ats_score = round(float(similarity) * 100, 1)   # Convert to percentage

    # ── STEP 3: Keyword gap analysis ─────────────────────────────
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()

    # Find keywords in job description
    jd_keywords = [kw for kw in TECH_KEYWORDS if kw in jd_lower]

    # Find keywords present in both
    matched_keywords = [kw for kw in jd_keywords if kw in resume_lower]

    # Keywords in JD but missing from resume — these are the GAPS
    missing_keywords = [kw for kw in jd_keywords if kw not in resume_lower]

    # ── STEP 4: Generate intelligent feedback ────────────────────
    feedback = generate_feedback(ats_score, missing_keywords, resume_text)

    return {
        'ats_score': ats_score,
        'matched_keywords': matched_keywords,
        'missing_keywords': missing_keywords,
        'feedback': feedback,
        'keyword_match_rate': round(
            len(matched_keywords) / len(jd_keywords) * 100 if jd_keywords else 0, 1
        )
    }


def generate_feedback(score: float, missing: list, resume_text: str) -> list:
    '''Generate human-readable feedback based on the analysis.'''
    feedback = []

    if score >= 80:
        feedback.append('🟢 Excellent match! Your resume is very well aligned.')
    elif score >= 60:
        feedback.append('🟡 Good match. A few improvements will make it stronger.')
    elif score >= 40:
        feedback.append('🟠 Moderate match. Your resume needs significant tailoring.')
    else:
        feedback.append('🔴 Low match. This role may not align with your current profile.')

    if missing:
        top_missing = missing[:5]  # Show top 5 most important gaps
        feedback.append(f"📌 Add these missing skills: {', '.join(top_missing)}")

    # Check resume length
    word_count = len(resume_text.split())
    if word_count < 200:
        feedback.append('📝 Your resume is too short. Add more detail to projects.')
    elif word_count > 800:
        feedback.append('✂️ Resume is long. Keep it under 2 pages for better ATS results.')

    # Check for action verbs
    action_verbs = ['built', 'developed', 'designed', 'implemented', 'led', 'achieved']
    has_action = any(verb in resume_text.lower() for verb in action_verbs)
    if not has_action:
        feedback.append('💡 Use action verbs: Built, Developed, Designed, Implemented.')

    return feedback


def extract_resume_skills(resume_text: str) -> list:
    '''Extract skills from resume for job search queries.'''
    resume_lower = resume_text.lower()
    return [kw for kw in TECH_KEYWORDS if kw in resume_lower]
