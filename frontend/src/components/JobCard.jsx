export default function JobCard({ job }) {
    return (
        <div style={{
            border: '1px solid #e5e7eb', borderRadius: 10,
            padding: 16, marginBottom: 12,
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', gap: 16, flexWrap: 'wrap'
        }}>
            <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#1a1a2e' }}>{job.title}</h4>
                <p style={{ margin: '0 0 8px 0', color: '#5B2D8E', fontWeight: 600, fontSize: 14 }}>
                    {job.company}
                </p>
                <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: 13 }}>
                    📍 {job.location} &nbsp;•&nbsp; 💰 {job.salary} &nbsp;•&nbsp; 🕒 {job.posted}
                </p>
                <p style={{ margin: 0, color: '#374151', fontSize: 13 }}>
                    {job.snippet}
                </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span style={{
                    background: '#F3E8FF', color: '#5B2D8E',
                    padding: '4px 10px', borderRadius: 12,
                    fontSize: 12, fontWeight: 600
                }}>
                    {job.type}
                </span>
                <a href={job.url} target="_blank" rel="noopener noreferrer"
                    style={{
                        background: '#5B2D8E', color: 'white',
                        padding: '8px 16px', borderRadius: 8,
                        textDecoration: 'none', fontSize: 13, fontWeight: 600,
                        whiteSpace: 'nowrap'
                    }}>
                    Apply →
                </a>
            </div>
        </div>
    );
}
