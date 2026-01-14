import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import MessageShield from './components/MessageShield';
import CallShield from './components/CallShield';
import FamilyCircle from './components/FamilyCircle';
import ReportScam from './components/ReportScam';

function App() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('message');
    const [seniorMode, setSeniorMode] = useState(false);

    return (
        <div className="app-container" style={{
            minHeight: '100vh',
            paddingBottom: '2rem',
            fontSize: seniorMode ? '1.2rem' : '1rem',
            transition: 'font-size 0.2s ease'
        }}>
            <Navbar seniorMode={seniorMode} setSeniorMode={setSeniorMode} />

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <TabButton active={activeTab === 'message'} onClick={() => setActiveTab('message')} label={t('tabs.message')} icon="💬" />
                <TabButton active={activeTab === 'call'} onClick={() => setActiveTab('call')} label={t('tabs.call')} icon="📞" />
                <TabButton active={activeTab === 'family'} onClick={() => setActiveTab('family')} label={t('tabs.family')} icon="👨‍👩‍👧" />
                <TabButton active={activeTab === 'report'} onClick={() => setActiveTab('report')} label={t('tabs.report')} icon="🚨" />
            </div>

            <div className={`container ${seniorMode ? 'senior-mode' : ''}`}>
                {activeTab === 'message' && <MessageShield seniorMode={seniorMode} />}
                {activeTab === 'call' && <CallShield seniorMode={seniorMode} />}
                {activeTab === 'family' && <FamilyCircle seniorMode={seniorMode} />}
                {activeTab === 'report' && <ReportScam />}
            </div>
        </div>
    );
}

const TabButton = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={`btn ${active ? 'btn-primary' : 'btn-outline'}`}
        style={{
            flex: '1 1 150px',
            maxWidth: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem'
        }}
    >
        <span style={{ fontSize: '1.2rem' }}>{icon}</span> {label}
    </button>
);

export default App;
