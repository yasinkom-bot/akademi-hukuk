'use client';
import { useState, useEffect } from 'react';
import styles from './Topbar.module.css';
import LiveSearch from './LiveSearch';
import Link from 'next/link';
import { useAppContext } from '../app/context/AppContext';
import CaseModal from './CaseModal';

export default function Topbar() {
  const { events, currentUser } = useAppContext();
  const [theme, setTheme] = useState('dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeCase, setActiveCase] = useState<any>(null);
  
  const pendingTasks = events.filter(e => e.assignedTo === currentUser && !e.isCompleted);

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to DOM and save to localStorage when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className={`${styles.topbar} glass`}>
      <div className={styles.searchContainer}>
        <LiveSearch />
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
        <div style={{position: 'relative'}}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--card-border)', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', position: 'relative', fontSize: '1.2rem', transition: 'all 0.2s'}}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
          >
            🔔
            {pendingTasks.length > 0 && (
              <span style={{position: 'absolute', top: '-5px', right: '-5px', background: 'var(--danger)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', border: '2px solid var(--card-bg)'}}>
                {pendingTasks.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div style={{position: 'absolute', top: '120%', right: 0, width: '320px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden'}}>
              <div style={{padding: '1rem', borderBottom: '1px solid var(--card-border)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span>Bekleyen İşlerim</span>
                <span style={{background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem'}}>{pendingTasks.length} Görev</span>
              </div>
              <div style={{maxHeight: '350px', overflowY: 'auto'}}>
                {pendingTasks.length > 0 ? pendingTasks.map(t => (
                  <div 
                    key={t.id} 
                    style={{padding: '1rem', borderBottom: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '0.35rem', transition: 'background 0.2s', cursor: 'pointer'}} 
                    onClick={() => { setActiveCase({ id: t.fileId, type: 'Dava', client: t.fileName?.split(' - ')[1] || 'Bilinmeyen Müvekkil', fileName: t.fileName, status: 'Açık' }); setShowNotifications(false); }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    title="Dosya görevlerine gitmek için tıklayın"
                  >
                    <span style={{fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem'}}>{t.title}</span>
                    <span style={{fontSize: '0.8rem', color: '#64748b'}}>Dosya: {t.fileName || '-'}</span>
                    <span style={{fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 500}}>Bitiş: {t.day}.{t.month + 1}.{t.year}</span>
                  </div>
                )) : (
                  <div style={{padding: '3rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem'}}>Harika! Bekleyen işiniz yok. 🎉</div>
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={toggleTheme} 
          style={{background: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s'}}
        >
          {theme === 'dark' ? '☀️ Açık Tema' : '🌙 Koyu Tema'}
        </button>
        <Link href="/profile" className={styles.profile}>
          <div className={styles.avatar}>A</div>
          <span className={styles.name}>{currentUser}</span>
        </Link>
        <button 
          style={{background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'}}
          onClick={() => alert("Çıkış yapıldı. (Giriş ekranına yönlendirilecek)")}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--danger)'; }}
        >
          Çıkış Yap
        </button>
      </div>

      {activeCase && (
        <CaseModal 
          isOpen={true}
          onClose={() => setActiveCase(null)}
          caseData={activeCase}
          initialTab="tasks"
        />
      )}
    </header>
  )
}
