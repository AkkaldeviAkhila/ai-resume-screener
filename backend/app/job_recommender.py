import httpx
import os
from dotenv import load_dotenv

load_dotenv()

JOOBLE_API_KEY = os.getenv('JOOBLE_API_KEY')
JOOBLE_API_URL = f'https://jooble.org/api/{JOOBLE_API_KEY}'


async def get_job_recommendations(skills: list, location: str = 'India') -> list:
    '''
    Fetch real job listings from Jooble API.
    skills: list of skills extracted from resume
    location: where to search for jobs
    Returns: list of job objects with title, company, location, salary, url
    '''
    if not JOOBLE_API_KEY or JOOBLE_API_KEY == 'your_jooble_api_key_here':
        # Return sample data if no API key — useful for testing
        return get_sample_jobs(skills)

    # Build search query from top 3 skills
    # Example: 'python machine learning data analysis'
    keywords = ' '.join(skills[:3]) if skills else 'software developer'

    payload = {
        'keywords': keywords,
        'location': location,
        'resultsOnPage': 10  # Get 10 jobs
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(JOOBLE_API_URL, json=payload)
            data = response.json()

            jobs = []
            for job in data.get('jobs', []):
                jobs.append({
                    'title': job.get('title', 'N/A'),
                    'company': job.get('company', 'N/A'),
                    'location': job.get('location', 'India'),
                    'salary': job.get('salary', 'Not disclosed'),
                    'snippet': job.get('snippet', '')[:200],  # Preview of job description
                    'url': job.get('link', '#'),   # Direct apply link
                    'posted': job.get('updated', 'Recent'),
                    'type': job.get('type', 'Full-time')
                })
            return jobs

    except Exception as e:
        print(f'Jooble API error: {e}')
        return get_sample_jobs(skills)


def get_sample_jobs(skills: list) -> list:
    '''Sample jobs for testing when API key not set.'''
    skill = skills[0] if skills else 'developer'
    return [
        {
            'title': f'Senior {skill.title()} Developer',
            'company': 'TechCorp India',
            'location': 'Hyderabad, India',
            'salary': '₹8-15 LPA',
            'snippet': f'We are looking for an experienced {skill} developer...',
            'url': 'https://naukri.com',
            'posted': '2 days ago',
            'type': 'Full-time'
        },
        {
            'title': f'{skill.title()} Engineer — Remote',
            'company': 'Startup Hub',
            'location': 'Remote, India',
            'salary': '₹6-12 LPA',
            'snippet': 'Join our growing team and work on exciting AI products...',
            'url': 'https://linkedin.com/jobs',
            'posted': '1 day ago',
            'type': 'Remote'
        }
    ]
