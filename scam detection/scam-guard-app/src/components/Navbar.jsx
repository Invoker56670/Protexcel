
import { useTranslation } from 'react-i18next';

const Navbar = ({ seniorMode, setSeniorMode }) => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1rem 1.5rem',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            borderRadius: '0px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    background: '#1F2937',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    border: '1px solid #374151'
                }}>
                    🛡️
                </div>
                <div>
                    <h1 style={{ fontSize: '1.2rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('navbar.title')}</h1>
                    <span className="label-mono" style={{ fontSize: '0.65rem', color: 'var(--primary)' }}>{t('navbar.edition')}</span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Language Toggle */}
                <button
                    className="btn btn-outline"
                    onClick={toggleLanguage}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    aria-label="Toggle Language"
                >
                    {t('navbar.language')}
                </button>

                {/* Senior Mode Toggle */}
                <button
                    className={`btn ${seniorMode ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setSeniorMode(!seniorMode)}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    aria-label="Toggle Senior Mode"
                >
                    {seniorMode ? t('navbar.seniorOn') : t('navbar.seniorOff')}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
