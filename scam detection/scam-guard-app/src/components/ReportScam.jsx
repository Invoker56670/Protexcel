
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ReportScam = () => {
    const { t } = useTranslation();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="grid-2">
            <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Development Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(5, 6, 9, 0.6)', // Lighter dark overlay
                    backdropFilter: 'blur(2px)', // Reduced blur from 4px
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                    <h3>{t('familyCircle.inDevelopment')}</h3>
                    <p className="label-mono">{t('familyCircle.featureLocked')}</p>
                </div>

                <div style={{ opacity: 0.5 }}>
                    <h3>{t('reportScam.title')}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('reportScam.category')}</label>
                            <select style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(15, 23, 42, 0.6)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <option>Financial Fraud (Bank/UPI)</option>
                                <option>Phishing Link (SMS/Email)</option>
                                <option>Impersonation (Police/Govt)</option>
                                <option>Lottery/Prize Scam</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('reportScam.numberId')}</label>
                            <input type="text" placeholder="+91..." />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('reportScam.description')}</label>
                            <textarea rows="4" placeholder="Describe what happened..."></textarea>
                        </div>

                        <button className="btn" style={{ width: '100%' }}>
                            {submitted ? t('reportScam.submitted') : t('reportScam.submit')}
                        </button>
                    </form>
                </div>
            </div>

            <div className="glass-panel">
                <h3>{t('reportScam.heatmapTitle')}</h3>
                <p>Recent reports in your area (Real-time)</p>

                <div style={{
                    width: '100%',
                    height: '300px',
                    background: 'radial-gradient(circle at 50% 50%, #1e293b, #0f172a)',
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {/* Mock Heatmap Points */}
                    <div className="animate-pulse-red" style={{ position: 'absolute', top: '30%', left: '40%', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.6)' }}></div>
                    <div className="animate-pulse-red" style={{ position: 'absolute', top: '60%', left: '70%', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.8)', animationDelay: '0.5s' }}></div>
                    <div className="animate-pulse-red" style={{ position: 'absolute', top: '40%', left: '20%', width: '15px', height: '15px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.5)', animationDelay: '1s' }}></div>

                    <span style={{ position: 'relative', zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                        {t('reportScam.mapUnavailable')}
                    </span>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <h4>{t('reportScam.recentAlerts')}</h4>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.8rem', borderRadius: '8px', borderLeft: '4px solid var(--danger)', marginBottom: '0.5rem' }}>
                        <strong>Electricity Bill Scam</strong>
                        <div style={{ fontSize: '0.8rem' }}>Reported 10 mins ago • 15 victims</div>
                    </div>
                    <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '0.8rem', borderRadius: '8px', borderLeft: '4px solid var(--warning)' }}>
                        <strong>Fake Courier Call</strong>
                        <div style={{ fontSize: '0.8rem' }}>Reported 1 hour ago • 4 victims</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportScam;
