import axios from 'axios';

const API_BASE_URL = 'https://akhila2202-ai-resume-screener.hf.space';

export const analyseResume = async (resumeFile, jobDescription, location) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('job_description', jobDescription);
  formData.append('location', location);

  const response = await axios.post(`${API_BASE_URL}/api/analyse`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const analyseResumeText = async (resumeText, jobDescription, location) => {
  const formData = new FormData();
  formData.append('resume_text', resumeText);
  formData.append('job_description', jobDescription);
  formData.append('location', location);

  const response = await axios.post(`${API_BASE_URL}/api/analyse-text`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
