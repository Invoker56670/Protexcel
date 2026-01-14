import { useState } from 'react';

const FamilyCircle = () => {
    const [lessonActive, setLessonActive] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const contacts = [
        { name: 'Son (Rohan)', phone: '+91 98765 43210', status: 'Active' },
        { name: 'Daughter (Priya)', phone: '+91 98765 12345', status: 'Active' },
        { name: 'Nephew (Amit)', phone: '+91 98765 67890', status: 'Pending' }
    ];

    const questions = [
        {
            text: "A 'Bank Manager' calls and asks for your OTP to stop a fraudulent transaction. What do you do?",
            options: ["Give the OTP immediately", "Hang up and call the bank directly", "Share it only if they verify your confusing details"],
            correct: 1
        },
        {
            text: "You receive a message saying you won a lottery but need to pay a 'processing fee'.",
            options: ["Pay the fee", "Ignore it, it's a scam", "Ask for proof first"],
            correct: 1
        },
        {
            text: "Someone asks you to download 'AnyDesk' to fix your phone.",
            options: ["Download it", "Ask your son first", "Never download remote access apps for strangers"],
            correct: 2
        }
    ];

    const handleAnswer = (optionIndex) => {
        setSelectedOption(optionIndex);
        setTimeout(() => {
            if (optionIndex === questions[questionIndex].correct) {
                setScore(score + 1);
            }

            if (questionIndex + 1 < questions.length) {
                setQuestionIndex(questionIndex + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
            }
        }, 500); // 500ms delay for "Instant Snap" feeling but enough to see selection
    };

    const resetLesson = () => {
        setLessonActive(false);
        setQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedOption(null);
    };

    return (
        <div className="grid-2">
            <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="grid-overlay"></div>

                {/* Development Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(5, 6, 9, 0.6)',
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 20, // Higher than content
                    borderRadius: '4px'
                }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚧</div>
                    <h3>IN DEVELOPMENT</h3>
                    <p className="label-mono">FEATURE LOCKED</p>
                </div>

                {/* Trusted Contacts Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <h3>TRUSTED CONTACTS</h3>
                    <button className="btn btn-outline" style={{ fontSize: '0.8rem' }}>+ ADD NEW</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
                    {contacts.map((c, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{c.name}</div>
                                <div className="label-mono">{c.phone}</div>
                            </div>
                            <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                {c.status}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--primary)', borderRadius: '4px', background: 'rgba(37, 99, 235, 0.1)', position: 'relative', zIndex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.9rem' }}>ℹ️ Operational Protocol</h4>
                    <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-muted)' }}>
                        If a high-level threat is identified, trusted contacts will receive immediate encrypted alerts.
                    </p>
                </div>
            </div>

            <div className="glass-panel">
                <div className="grid-overlay"></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3>SECURITY TRAINING (COACH)</h3>

                    {!lessonActive ? (
                        <>
                            <p style={{ marginBottom: '1.5rem' }}>Review core security protocols before engaging network.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ padding: '1rem', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                                    <strong style={{ color: 'var(--primary)' }}>Rule #1: NO SHARED CODES</strong>
                                    <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Never share OTP or 2FA codes. No exceptions.</p>
                                </div>
                                <div style={{ padding: '1rem', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                                    <strong style={{ color: 'var(--primary)' }}>Rule #2: ZERO TRUST URGENCY</strong>
                                    <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0' }}>"Act Immediately" = High Probability Threat.</p>
                                </div>
                                <div style={{ padding: '1rem', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                                    <strong style={{ color: 'var(--primary)' }}>Rule #3: REMOTE ACCESS DENIED</strong>
                                    <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Reject all requests to download AnyDesk/TeamViewer.</p>
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setLessonActive(true)}>BEGIN TRAINING MODULE</button>
                        </>
                    ) : (
                        <div style={{ marginTop: '1rem' }}>
                            {!showResult ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span className="label-mono">PROGRESS</span>
                                        <span className="label-mono">{questionIndex + 1} / {questions.length}</span>
                                    </div>
                                    <div style={{ height: '2px', background: '#374151', width: '100%', marginBottom: '2rem' }}>
                                        <div style={{ height: '100%', background: 'var(--primary)', width: `${((questionIndex + 1) / questions.length) * 100}%`, transition: 'width 0.3s ease' }}></div>
                                    </div>

                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>{questions[questionIndex].text}</h4>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {questions[questionIndex].options.map((option, idx) => {
                                            const isSelected = selectedOption === idx;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleAnswer(idx)}
                                                    style={{
                                                        textAlign: 'left',
                                                        padding: '1rem',
                                                        background: isSelected ? '#1E3A8A' : 'transparent',
                                                        border: isSelected ? '1px solid #3B82F6' : '1px solid #374151',
                                                        color: isSelected ? 'white' : 'var(--text-muted)',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        transition: 'all 75ms ease-out',
                                                        fontFamily: 'var(--font-ui)',
                                                        fontSize: '0.9rem'
                                                    }}
                                                    className="quiz-option"
                                                >
                                                    <span style={{ marginRight: '0.75rem', color: isSelected ? '#60A5FA' : '#6B7280' }}>
                                                        {['A', 'B', 'C'][idx]}.
                                                    </span>
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                                        {score === questions.length ? '🎖️' : '⚠️'}
                                    </div>
                                    <h2 style={{ textTransform: 'uppercase' }}>Module Complete</h2>
                                    <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
                                        SCORE: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{score}/{questions.length}</span>
                                    </p>

                                    {score === questions.length ? (
                                        <div className="badge badge-success" style={{ padding: '1rem', fontSize: '1rem', marginBottom: '2rem' }}>CERTIFIED SECURE</div>
                                    ) : (
                                        <p style={{ marginBottom: '2rem', color: 'var(--warning-text)' }}>Retraining Recommended.</p>
                                    )}

                                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={resetLesson}>RETURN TO MENU</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FamilyCircle;
