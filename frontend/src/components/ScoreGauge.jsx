export default function ScoreGauge({ score }) {
    const rounded = Math.round(score);
    const color = rounded >= 75 ? '#10B981' : rounded >= 50 ? '#F59E0B' : '#EF4444';
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (rounded / 100) * circumference;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="14" />
                <circle
                    cx="90" cy="90" r={radius} fill="none"
                    stroke={color} strokeWidth="14"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                <text x="90" y="95" textAnchor="middle" fontSize="36" fontWeight="700" fill="#1a1a2e">
                    {rounded}%
                </text>
            </svg>
            <p style={{ marginTop: 12, fontWeight: 600, color: '#1a1a2e', fontSize: 16 }}>
                ATS Score
            </p>
            <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center' }}>
                {rounded >= 75 ? 'Great match!' : rounded >= 50 ? 'Decent match, room to improve' : 'Needs improvement'}
            </p>
        </div>
    );
}
