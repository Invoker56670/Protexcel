import { useState } from 'react';
import { analyzeContent } from '../utils/scamDetector';
import { useTranslation } from 'react-i18next';

const MessageShield = ({ seniorMode = false }) => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            // Mock delay for scanner animation effect
            await new Promise(r => setTimeout(r, 1500));
            const data = await analyzeContent(input);
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`grid-2 ${seniorMode ? 'senior-layout' : ''}`}>
            {/* Input Panel */}
            <div className="glass-panel">
                <div className="grid-overlay"></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2>{t('messageShield.title')}</h2>
                    </div>

                    <p className="label-mono" style={{ marginBottom: '0.5rem' }}>{t('messageShield.inputLabel')}</p>
                    <textarea
                        rows={seniorMode ? "4" : "6"}
                        placeholder={t('messageShield.placeholder')}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{
                            fontSize: seniorMode ? '1.2rem' : '0.9rem',
                            resize: 'none'
                        }}
                    ></textarea>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleAnalyze}
                            disabled={loading}
                            style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
                        >
                            {loading ? t('messageShield.processing') : t('messageShield.scanBtn')}
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => setInput('')}
                            disabled={loading}
                        >
                            {t('messageShield.clearBtn')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Result HUD */}
            <div className="glass-panel" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                position: 'relative',
                textAlign: 'center'
            }}>
                <div className="grid-overlay"></div>

                {loading && <div className="scan-line"></div>}

                {!result && !loading && (
                    <div style={{ opacity: 0.3, zIndex: 1 }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
                        <h3 className="label-mono">{t('messageShield.systemReady')}</h3>
                        <p className="label-mono">{t('messageShield.awaitingInput')}</p>
                    </div>
                )}

                {loading && (
                    <div style={{ zIndex: 1 }}>
                        <div className="label-mono animate-pulse-slow">{t('messageShield.analyzing')}</div>
                        <div style={{
                            marginTop: '1rem',
                            height: '2px',
                            width: '100px',
                            background: 'var(--primary)',
                            margin: '1rem auto'
                        }}></div>
                    </div>
                )}

                {result && (
                    <div style={{ width: '100%', zIndex: 1, animation: 'fadeIn 0.3s ease-out' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <span className="label-mono" style={{ fontSize: '0.8rem' }}>{t('messageShield.classificationLabel')}</span>

                            <h2 style={{
                                color: result.classification === 1 ? 'var(--danger-text)' : 'var(--success-text)',
                                fontSize: seniorMode ? '2.5rem' : '2rem',
                                margin: '0.5rem 0 0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '-0.02em'
                            }}>
                                {result.classification === 1 ? t('messageShield.threatDetected') : t('messageShield.verifiedSafe')}
                            </h2>

                            <span className={`badge ${result.classification === 1 ? 'badge-danger' : 'badge-success'}`}>
                                {t('messageShield.confidence')}: {(result.confidence * 100).toFixed(1)}%
                            </span>
                        </div>

                        <div style={{
                            background: '#000',
                            border: '1px solid var(--border-color)',
                            padding: '1.5rem',
                            borderRadius: '4px',
                            textAlign: 'left'
                        }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <span className="label-mono">{t('messageShield.detectedIntent')}</span>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{result.intent}</div>
                            </div>

                            <div>
                                <span className="label-mono">{t('messageShield.analysisReport')}</span>
                                <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                    {result.explanation}
                                </p>
                            </div>
                        </div>

                        {result.classification === 1 && (
                            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button className="btn btn-danger">{t('messageShield.blockSource')}</button>
                                <button className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger-text)' }}>{t('messageShield.reportEvent')}</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageShield;
