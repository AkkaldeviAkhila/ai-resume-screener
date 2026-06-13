export default function SkillsGap({ matched, missing }) {
    return (
        <div>
            <h3 style={{ color: '#1a1a2e', marginTop: 0 }}>Skills Gap Analysis</h3>

            <div style={{ marginBottom: 24 }}>
                <h4 style={{ color: '#10B981', marginBottom: 8 }}>
                    ✅ Matched Keywords ({matched.length})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {matched.length > 0 ? matched.map((kw, i) => (
                        <span key={i} style={{
                            background: '#D1FAE5', color: '#065F46',
                            padding: '6px 12px', borderRadius: 20,
                            fontSize: 13, fontWeight: 500
                        }}>
                            {kw}
                        </span>
                    )) : <p style={{ color: '#6b7280', fontSize: 13 }}>No matched keywords found.</p>}
                </div>
            </div>

            <div>
                <h4 style={{ color: '#EF4444', marginBottom: 8 }}>
                    ❌ Missing Keywords ({missing.length})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {missing.length > 0 ? missing.map((kw, i) => (
                        <span key={i} style={{
                            background: '#FEE2E2', color: '#991B1B',
                            padding: '6px 12px', borderRadius: 20,
                            fontSize: 13, fontWeight: 500
                        }}>
                            {kw}
                        </span>
                    )) : <p style={{ color: '#6b7280', fontSize: 13 }}>No missing keywords — great job!</p>}
                </div>
            </div>
        </div>
    );
}
