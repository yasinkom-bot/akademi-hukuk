'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { useAppContext } from '../context/AppContext';

export default function ProfilePage() {
  const { events, currentUser } = useAppContext();
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profil bilgileri başarıyla güncellendi!");
  };

  // Sadece aktif kullanıcının tamamladığı işler
  const myCompletedTasks = events.filter(e => e.isCompleted && e.completedBy === currentUser);

  // Güncelden eskiye sıralama
  myCompletedTasks.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    if (a.month !== b.month) return b.month - a.month;
    return b.day - a.day;
  });

  // Son 1 ay kontrolü
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  const isWithinLastMonth = (day: number, month: number, year: number) => {
    const taskDate = new Date(year, month, day);
    return taskDate >= lastMonth && taskDate <= today;
  };

  const recentTasks = myCompletedTasks.filter(t => isWithinLastMonth(t.day, t.month, t.year));
  
  const displayedTasks = showAll 
    ? myCompletedTasks.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (t.fileName && t.fileName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.desc && t.desc.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : recentTasks;

  return (
    <div className={styles.profilePage}>
      <header className={styles.header}>
        <h1>Profilim</h1>
        <p>Kişisel bilgilerinizi ve performans geçmişinizi görüntüleyin.</p>
      </header>

      <div style={{display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap'}}>
        <div className={`${styles.card} glass`} style={{flex: '1 1 300px'}}>
          <h2 style={{marginBottom: '1.5rem', color: 'var(--foreground)', fontSize: '1.2rem'}}>Profil Bilgileri</h2>
          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.formGroup}>
              <label>Ad Soyad</label>
              <input type="text" defaultValue={currentUser} required />
            </div>
            <div className={styles.formGroup}>
              <label>E-posta Adresi</label>
              <input type="email" defaultValue="admin@akademihukuk.com" required />
            </div>
            <div className={styles.formGroup}>
              <label>Mevcut Şifre</label>
              <input type="password" placeholder="Mevcut şifreniz" />
            </div>
            <div className={styles.formGroup}>
              <label>Yeni Şifre</label>
              <input type="password" placeholder="Yeni şifreniz" />
            </div>
            
            <button type="submit" className={styles.submitBtn}>Değişiklikleri Kaydet</button>
          </form>
        </div>

        <div className={`${styles.card} glass`} style={{flex: '2 1 500px', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <div>
              <h2 style={{color: 'var(--foreground)', fontSize: '1.2rem', marginBottom: '0.2rem'}}>
                {showAll ? 'Tüm Tamamlanan İşlerim' : 'Son 1 Ayda Tamamlanan İşler'}
              </h2>
              <span style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600}}>Toplam {showAll ? myCompletedTasks.length : recentTasks.length} görev</span>
            </div>
            <button 
              onClick={() => {
                setShowAll(!showAll);
                setSearchTerm('');
              }}
              style={{
                background: showAll ? 'var(--card-border)' : 'var(--primary)',
                color: showAll ? 'var(--foreground)' : 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {showAll ? 'Son 1 Aya Dön' : 'Tüm İşlemler'}
            </button>
          </div>

          {showAll && (
            <div style={{marginBottom: '1.5rem'}}>
              <input 
                type="text" 
                placeholder="Görev adı, dosya no veya açıklama ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--primary)',
                  background: 'var(--background)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
          )}

          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem'}}>
            {displayedTasks.length > 0 ? displayedTasks.map(t => (
              <div key={t.id} style={{
                background: 'rgba(0,0,0,0.02)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                padding: '1rem',
                opacity: 0.8,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                  <strong style={{textDecoration: 'line-through', color: '#64748b', fontSize: '1rem'}}>{t.title}</strong>
                  <span style={{fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, background: 'rgba(37, 99, 235, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px'}}>
                    {t.day}.{t.month + 1}.{t.year}
                  </span>
                </div>
                <div style={{fontSize: '0.85rem', color: 'var(--foreground)', marginBottom: '0.2rem', textDecoration: 'line-through'}}>
                  {t.fileName || 'Bağımsız Görev'}
                </div>
                {t.desc && (
                  <div style={{fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic'}}>
                    "{t.desc}"
                  </div>
                )}
              </div>
            )) : (
              <div style={{padding: '2rem', textAlign: 'center', color: '#64748b', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px dashed var(--card-border)'}}>
                {showAll && searchTerm ? 'Aramanızla eşleşen görev bulunamadı.' : 'Bu dönemde tamamlanmış bir göreviniz bulunmuyor.'}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
