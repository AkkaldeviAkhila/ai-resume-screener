import { useState } from 'react';
import { analyseResume, analyseResumeText } from './api';
import ScoreGauge from './components/ScoreGauge';
import SkillsGap from './components/SkillsGap';
import JobCard from './components/JobCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function App() {
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [location, setLocation] = useState('India');
    const [inputMode, setInputMode] = useState('pdf');  // 'pdf' or 'text'
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('score');

    const handleAnalyse = async () => {
        if (!jobDescription.trim()) { setError('Please enter a job description'); return; }
        if (inputMode === 'pdf' && !resumeFile) { setError('Please upload a PDF resume'); return; }
        if (inputMode === 'text' && !resumeText.trim()) { setError('Please paste your resume text'); return; }

        setLoading(true); setError('');
        try {
            const data = inputMode === 'pdf'
                ? await analyseResume(resumeFile, jobDescription, location)
                : await analyseResumeText(resumeText, jobDescription, location);
            setResults(data);
            setActiveTab('score');
        } catch (err) {
            setError(err.response?.data?.detail || 'Analysis failed. Check backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const chartData = results ? [
        { name: 'ATS Score', value: results.analysis.ats_score },
        { name: 'Keyword Match', value: results.analysis.keyword_match_rate },
        { name: 'Skills Found', value: Math.min(results.skills_found.length * 5, 100) },
    ] : [];

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Arial' }}>

            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg, #5B2D8E, #0F6E56)', padding: '24px 40px' }}>
                <h1 style={{ color: 'white', margin: 0, fontSize: 28 }}>🤖 AI Resume Screener</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0' }}>
                    Get your ATS score · Find skill gaps · Discover matching jobs
                </p>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

                {/* INPUT SECTION */}
                <div style={{ background: 'white', borderRadius: 12, padding: 24,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 24 }}>

                    {/* Mode toggle */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                        {['pdf', 'text'].map(mode => (
                            <button key={mode} onClick={() => setInputMode(mode)}
                                style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                         background: inputMode === mode ? '#5B2D8E' : '#f0f0f0',
                                         color: inputMode === mode ? 'white' : '#333', fontWeight: 600 }}>
                                {mode === 'pdf' ? '📄 Upload PDF' : '📝 Paste Text'}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        {/* Resume input */}
                        <div>
                            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
                                Your Resume
                            </label>
                            {inputMode === 'pdf' ? (
                                <input type='file' accept='.pdf'
                                    onChange={e => setResumeFile(e.target.files[0])}
                                    style={{ width: '100%', padding: 12, border: '2px dashed #5B2D8E',
                                             borderRadius: 8, cursor: 'pointer' }} />
                            ) : (
                                <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
                                    placeholder='Paste your resume text here...'
                                    style={{ width: '100%', height: 200, padding: 12, border: '1px solid #ddd',
                                             borderRadius: 8, resize: 'vertical', fontSize: 13 }} />
                            )}
                        </div>

                        {/* Job description */}
                        <div>
                            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
                                Job Description
                            </label>
                            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                                placeholder='Paste the job description here...'
                                style={{ width: '100%', height: 200, padding: 12, border: '1px solid #ddd',
                                         borderRadius: 8, resize: 'vertical', fontSize: 13 }} />
                        </div>
                    </div>

                    {/* Location + Analyse button */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
                        <input value={location} onChange={e => setLocation(e.target.value)}
                            placeholder='Job location (e.g. Hyderabad)'
                            style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8, width: 220 }} />
                        <button onClick={handleAnalyse} disabled={loading}
                            style={{ padding: '12px 32px', background: loading ? '#9CA3AF' : '#5B2D8E',
                                     color: 'white', border: 'none', borderRadius: 8,
                                     cursor: loading ? 'not-allowed' : 'pointer',
                                     fontWeight: 700, fontSize: 16 }}>
                            {loading ? '⏳ Analysing...' : '🔍 Analyse Resume'}
                        </button>
                    </div>

                    {error && <p style={{ color: '#EF4444', marginTop: 12 }}>❌ {error}</p>}
                </div>

                {/* RESULTS SECTION */}
                {results && (
                    <div>
                        {/* Tab nav */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                            {[
                                ['score', '📊 ATS Score'],
                                ['skills', '🛠️ Skills Gap'],
                                ['chart', '📈 Analysis'],
                                ['jobs', `💼 Jobs (${results.job_recommendations.length})`]
                            ].map(([id, label]) => (
                                <button key={id} onClick={() => setActiveTab(id)}
                                    style={{ padding: '10px 20px', borderRadius: 8, border: 'none',
                                             cursor: 'pointer', fontWeight: 600, fontSize: 14,
                                             background: activeTab === id ? '#5B2D8E' : 'white',
                                             color: activeTab === id ? 'white' : '#333',
                                             boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div style={{ background: 'white', borderRadius: 12, padding: 24,
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>

                            {/* SCORE TAB */}
                            {activeTab === 'score' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
                                    <ScoreGauge score={results.analysis.ats_score} />
                                    <div>
                                        <h3 style={{ color: '#1a1a2e', marginTop: 0 }}>AI Feedback</h3>
                                        {results.analysis.feedback.map((f, i) => (
                                            <p key={i} style={{ padding: '10px 14px', background: '#f8f9fa',
                                                                 borderRadius: 8, marginBottom: 8, fontSize: 14 }}>
                                                {f}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SKILLS TAB */}
                            {activeTab === 'skills' && (
                                <SkillsGap
                                    matched={results.analysis.matched_keywords}
                                    missing={results.analysis.missing_keywords}
                                />
                            )}

                            {/* CHART TAB */}
                            {activeTab === 'chart' && (
                                <div>
                                    <h3 style={{ color: '#1a1a2e', marginTop: 0 }}>Score Breakdown</h3>
                                    <ResponsiveContainer width='100%' height={280}>
                                        <BarChart data={chartData} barSize={60}>
                                            <CartesianGrid strokeDasharray='3 3' />
                                            <XAxis dataKey='name' />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip formatter={(v) => `${v}%`} />
                                            <Bar dataKey='value' fill='#5B2D8E' radius={[6,6,0,0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {/* JOBS TAB */}
                            {activeTab === 'jobs' && (
                                <div>
                                    <h3 style={{ color: '#1a1a2e', marginTop: 0 }}>
                                        Recommended Jobs Based on Your Resume
                                    </h3>
                                    <p style={{ color: '#6b7280', marginBottom: 16, fontSize: 13 }}>
                                        Based on your skills: {results.skills_found.slice(0,5).join(', ')}
                                    </p>
                                    {results.job_recommendations.map((job, i) => (
                                        <JobCard key={i} job={job} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
