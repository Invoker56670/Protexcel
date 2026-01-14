import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SCAM_SCRIPT = [
    "Hello, am I speaking with Mr. Sharma?",
    "This is calling from your bank's security department.",
    "We have detected a suspicious transaction of 50,000 rupees.",
    "To stop this, we need to verify your identity immediately.",
    "I have sent a 6-digit OTP to your mobile.",
    "Please share the OTP with me to block the hacker.",
    "Sir, do not worry, just give me the code."
];

const CallShield = ({ seniorMode = false }) => {
    const { t } = useTranslation();
    const [callStatus, setCallStatus] = useState('idle');
    const [transcript, setTranscript] = useState([]);
    const [currentAlert, setCurrentAlert] = useState(null);
    const [timer, setTimer] = useState(0);
    const [scriptIndex, setScriptIndex] = useState(0);

    const startCall = () => {
        setCallStatus('ringing');
        setTranscript([]);
        setCurrentAlert(null);
        setTimer(0);
        setScriptIndex(0);
        setTimeout(() => setCallStatus('active'), 2500);
    };

    const endCall = () => {
        setCallStatus('ended');
        setCurrentAlert(null);
    };

    // Timer Logic
    useEffect(() => {
        let interval;
        if (callStatus === 'active') {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [callStatus]);

    // Script & Analysis Logic
    useEffect(() => {
        let interval;
        if (callStatus === 'active' && scriptIndex < SCAM_SCRIPT.length) {
            interval = setInterval(() => {
                const line = SCAM_SCRIPT[scriptIndex];
                setTranscript(prev => [...prev, { speaker: 'Caller', text: line }]);

                // Real-time analysis rule
                if (line.toLowerCase().includes('otp') || line.toLowerCase().includes('code')) {
                    setCurrentAlert("NEVER SHARE OTP / CODES");
                }
                if (line.toLowerCase().includes('bank') && line.toLowerCase().includes('verify')) {
                    setCurrentAlert("VERIFY CALLER IDENTITY");
                }

                setScriptIndex(prev => prev + 1);
            }, 3000);
        } else if (scriptIndex >= SCAM_SCRIPT.length && callStatus === 'active') {
            setTimeout(endCall, 2000);
        }
        return () => clearInterval(interval);
    }, [callStatus, scriptIndex]);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {/* Grid Overlay for Tech Feel */}
                <div className="grid-overlay"></div>

                {callStatus === 'idle' && (
                    <div style={{ textAlign: 'center', zIndex: 1 }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: '#1F2937', color: '#6B7280',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem', margin: '0 auto 1.5rem',
                            border: '1px solid #374151'
                        }}>
                            🛡️
                        </div>
                        <h2>{t('callShield.title')}</h2>
                        <p style={{ marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem' }}>
                            {t('callShield.desc')}
                        </p>
                        <button className="btn btn-primary" onClick={startCall}>
                            <span>▶</span> {t('callShield.startSim')}
                        </button>
                    </div>
                )}

                {callStatus === 'ringing' && (
                    <div className="animate-pulse-slow" style={{ textAlign: 'center', zIndex: 1 }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'var(--danger)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', margin: '0 auto 1.5rem',
                            boxShadow: '0 0 20px var(--danger)'
                        }}>
                            📞
                        </div>
                        <h2 style={{ color: 'var(--danger-text)' }}>{t('callShield.incoming')}</h2>
                        <h1 style={{ fontFamily: 'var(--font-data)', letterSpacing: '0.1em' }}>{t('callShield.unknownCaller')}</h1>
                        <p className="label-mono">+91 98XXX XXXXX</p>
                    </div>
                )}

                {callStatus === 'active' && (
                    <div style={{ width: '100%', maxWidth: '400px', zIndex: 1 }}>
                        {/* Caller Card */}
                        <div style={{
                            background: '#000', border: '1px solid #374151', borderRadius: '4px', padding: '1.5rem',
                            textAlign: 'center', marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                width: '60px', height: '60px', background: '#1F2937', borderRadius: '50%',
                                margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid #374151'
                            }}>
                                <span style={{ fontSize: '1.5rem', filter: 'grayscale(100%)' }}>👤</span>
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{t('callShield.unknownCaller')}</h3>
                            <span className="label-mono">+1 (555) 012-3456</span>

                            <div style={{ marginTop: '1rem' }}>
                                <span className={`badge ${currentAlert ? 'badge-danger' : 'badge-success'}`}>
                                    {currentAlert ? t('callShield.threatDetected') : t('callShield.monitoringAudio')}
                                </span>
                            </div>

                            <div style={{
                                marginTop: '1rem',
                                fontFamily: 'var(--font-data)',
                                fontSize: '2rem',
                                color: currentAlert ? 'var(--danger-text)' : 'var(--text-main)'
                            }}>
                                00:{timer < 10 ? `0${timer}` : timer}
                            </div>
                        </div>

                        {/* Transcript HUD */}
                        <div style={{
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid var(--border-color)',
                            borderTop: '2px solid var(--primary)',
                            borderRadius: '4px',
                            padding: '1rem',
                            height: '180px',
                            overflowY: 'auto',
                            fontFamily: 'var(--font-data)',
                            fontSize: '0.8rem',
                            marginBottom: '1rem'
                        }}>
                            <span className="label-mono" style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'block' }}>
                                {t('callShield.liveTranscript')}
                            </span>
                            {transcript.map((line, i) => (
                                <div key={i} style={{ marginBottom: '0.5rem', color: '#E5E7EB', display: 'flex', gap: '0.5rem' }}>
                                    <span style={{ color: '#4B5563' }}>&gt;</span>
                                    <span>{line.text}</span>
                                </div>
                            ))}
                        </div>

                        {currentAlert && (
                            <div className="animate-pulse-slow" style={{
                                background: '#450A0A', border: '1px solid #7F1D1D',
                                color: '#FECACA', padding: '0.75rem', borderRadius: '4px',
                                textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold'
                            }}>
                                ⚠ ALERT: {currentAlert}
                            </div>
                        )}

                        <button className="btn btn-danger" onClick={endCall} style={{ width: '100%', marginTop: '1rem' }}>
                            {t('callShield.endCall')}
                        </button>
                    </div>
                )}

                {callStatus === 'ended' && (
                    <div style={{ textAlign: 'center', zIndex: 1 }}>
                        <h2 style={{ color: 'var(--danger-text)' }}>{t('callShield.callEnded')}</h2>
                        <p style={{ marginBottom: '2rem' }}>Focus on threat analysis complete.</p>
                        <button className="btn btn-outline" onClick={() => setCallStatus('idle')}>
                            {t('callShield.resetMonitor')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CallShield;
