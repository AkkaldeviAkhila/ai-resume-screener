from pydantic import BaseModel
from typing import Optional


class AnalysisResponse(BaseModel):
    ats_score: float                    # 0.0 to 100.0
    keyword_match_rate: float           # % of JD keywords found in resume
    matched_keywords: list[str]         # Keywords present in both
    missing_keywords: list[str]         # Keywords in JD but missing in resume
    feedback: list[str]                 # Human-readable suggestions
    resume_text_preview: str            # First 300 chars of extracted text


class JobRecommendation(BaseModel):
    title: str
    company: str
    location: str
    salary: str
    snippet: str
    url: str
    posted: str
    type: str


class FullAnalysisResponse(BaseModel):
    analysis: AnalysisResponse
    job_recommendations: list[JobRecommendation]
    skills_found: list[str]             # All skills detected in resume
