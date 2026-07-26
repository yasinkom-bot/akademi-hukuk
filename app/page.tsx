'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useAppContext } from './context/AppContext';
import CaseModal from '@/components/CaseModal';

export default function Dashboard() {
  const { events } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sadece tamamlanmamış görevleri filtrele
  const durusmalar = events.filter(e => e.type === 'durusma' && !e.isCompleted).slice(0, 3);
  const digerGorevler = events.filter(e => e.type !== 'durusma' && !e.isCompleted).slice(0, 3);

  const formatMonth = (monthIndex: number) => {
    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    return months[monthIndex] || "Ay";
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1>Özet Panosu</h1>
          <p>Akademi Hukuk Otomasyonu'na hoş geldiniz.</p>
        </div>
        <div className={styles.clockWrapper}>
          <div className={styles.clockTime}>{currentTime.toLocaleTimeString('tr-TR')}</div>
          <div className={styles.clockDate}>{currentTime.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </header>

      <div className={styles.widgetsGrid}>
        
        {/* Widget: Finansal Özet */}
        <div className={styles.widget}>
          <h2>💰 Finansal Özet (Bu Ay)</h2>
          <div className={styles.financeSummary}>
            <div className={styles.financeBox}>
              <span className={styles.financeLabel}>Beklenen Tahsilat</span>
              <span className={styles.financeAmount} style={{color: 'var(--success)'}}>₺ 125,000</span>
            </div>
            <div className={styles.financeBox}>
              <span className={styles.financeLabel}>Toplam Masraf</span>
              <span className={styles.financeAmount} style={{color: 'var(--danger)'}}>₺ 14,350</span>
            </div>
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressLabel}>
              <span>Aylık Hedef Durumu</span>
              <span style={{color: 'var(--primary)'}}>%65</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{width: '65%'}}></div>
            </div>
          </div>
        </div>

        {/* Widget: Dosya Türleri Dağılımı */}
        <div className={styles.widget}>
          <h2>📂 Dosya Dağılımı</h2>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className={styles.distRow}>
              <span className={styles.distLabel}>⚖️ Dava Dosyaları</span>
              <div className={styles.distBadges}>
                <span className={styles.distBadge} style={{background: 'var(--primary)'}}>3 Aktif</span>
                <span className={styles.distBadge} style={{background: '#94a3b8'}}>1 Arşiv</span>
              </div>
            </div>
            <div className={styles.distRow}>
              <span className={styles.distLabel}>📄 İcra Dosyaları</span>
              <div className={styles.distBadges}>
                <span className={styles.distBadge} style={{background: 'var(--primary)'}}>2 Aktif</span>
                <span className={styles.distBadge} style={{background: '#94a3b8'}}>1 Arşiv</span>
              </div>
            </div>
            <div className={styles.distRow}>
              <span className={styles.distLabel}>👮 Ceza Dosyaları</span>
              <div className={styles.distBadges}>
                <span className={styles.distBadge} style={{background: 'var(--primary)'}}>0 Aktif</span>
                <span className={styles.distBadge} style={{background: '#94a3b8'}}>1 Arşiv</span>
              </div>
            </div>
            <div className={styles.distRow}>
              <span className={styles.distLabel}>🤝 Danışmanlık</span>
              <div className={styles.distBadges}>
                <span className={styles.distBadge} style={{background: 'var(--primary)'}}>2 Aktif</span>
                <span className={styles.distBadge} style={{background: '#94a3b8'}}>0 Arşiv</span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 1: Yaklaşan Duruşmalar */}
        <div className={styles.widget}>
          <h2>⚖️ Yaklaşan Duruşmalar</h2>
          {durusmalar.length > 0 ? (
            <ul className={styles.list}>
              {durusmalar.map((evt) => (
                <li key={evt.id} className={styles.listItem} style={{cursor: 'pointer'}} onClick={() => setActiveCaseId(evt.fileId)}>
                  <div className={styles.dateBox}>
                    <span className={styles.day}>{evt.day}</span>
                    <span className={styles.month}>{formatMonth(evt.month)}</span>
                  </div>
                  <div className={styles.details}>
                    <p className={styles.title}>{evt.title}</p>
                    <p className={styles.subtext} style={{color: 'var(--primary)', fontWeight: 500}}>{evt.fileName}</p>
                    <p className={styles.subtext} style={{fontSize: '0.75rem'}}>{evt.desc || 'Açıklama yok'}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', borderRadius: '16px'}}>
              <p style={{color: '#64748b', fontWeight: 500}}>Yaklaşan duruşma bulunmuyor. 🎉</p>
            </div>
          )}
        </div>

        {/* Widget 2: Yaklaşan Görevler */}
        <div className={styles.widget}>
          <h2>⚡ Bekleyen İşlemler & İhtarlar</h2>
          {digerGorevler.length > 0 ? (
            <ul className={styles.list}>
              {digerGorevler.map((evt) => (
                <li key={evt.id} className={styles.listItem} style={{cursor: 'pointer'}} onClick={() => setActiveCaseId(evt.fileId)}>
                  <div className={styles.statusBox} style={{backgroundColor: evt.type === 'ihtar' ? 'var(--warning)' : 'var(--primary)'}}>
                    {evt.type === 'ihtar' ? '❗️' : '⏳'}
                  </div>
                  <div className={styles.details}>
                    <p className={styles.title}>{evt.title}</p>
                    <p className={styles.subtext} style={{color: 'var(--primary)', fontWeight: 500}}>{evt.fileName}</p>
                    <p className={styles.subtext} style={{fontSize: '0.75rem'}}>Son Gün: {evt.day} {formatMonth(evt.month)} {evt.year}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', borderRadius: '16px'}}>
              <p style={{color: '#64748b', fontWeight: 500}}>Bekleyen işlem bulunmuyor. 🎉</p>
            </div>
          )}
        </div>

        {/* Widget: Son Aktiviteler (Zaman Tüneli) */}
        <div className={styles.widget}>
          <h2>🕒 Sistem Logları</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot} style={{background: 'var(--primary)'}}></div>
              <div className={styles.timelineContent}>
                <p><strong>Av. Canan K.</strong> yeni bir masraf girdi (₺1,500).</p>
                <span className={styles.timelineTime}>10 dk önce - Föy No 1</span>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot} style={{background: 'var(--success)'}}></div>
              <div className={styles.timelineContent}>
                <p>Yeni Müvekkil <strong>Vakıfbank A.Ş.</strong> sisteme eklendi.</p>
                <span className={styles.timelineTime}>2 saat önce - Admin</span>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot} style={{background: 'var(--warning)'}}></div>
              <div className={styles.timelineContent}>
                <p><strong>Ahmet Yılmaz</strong> dosyası arşive kaldırıldı.</p>
                <span className={styles.timelineTime}>Dün - Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 3: Ekip Görev Yükü (Yeni) */}
        <div className={styles.widget}>
          <h2>👨‍⚖️ Ekip Görev Yükü</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
            
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>CK</div>
                <span style={{fontWeight: 600}}>Av. Canan K.</span>
              </div>
              <span style={{background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600}}>14 Dosya</span>
            </div>
            
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>BD</div>
                <span style={{fontWeight: 600}}>Av. Burak D.</span>
              </div>
              <span style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600}}>9 Dosya</span>
            </div>

            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>AD</div>
                <span style={{fontWeight: 600}}>Stj. Ali D.</span>
              </div>
              <span style={{background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600}}>5 Görev</span>
            </div>

            <div style={{width: '100%', height: '4px', background: 'var(--card-border)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden', display: 'flex'}}>
               <div style={{width: '50%', background: 'var(--primary)', height: '100%'}}></div>
               <div style={{width: '32%', background: '#8b5cf6', height: '100%'}}></div>
               <div style={{width: '18%', background: '#f59e0b', height: '100%'}}></div>
            </div>
            
          </div>
        </div>

      </div>

      {/* View Case Modal from Dashboard */}
      {activeCaseId && (
        <CaseModal 
           isOpen={true} 
           onClose={() => setActiveCaseId(null)} 
           caseData={{ id: activeCaseId, type: 'Dava', client: 'İlgili Müvekkil', opponent: 'Karşı Taraf', lawyer: 'Admin' }} 
        />
      )}
    </div>
  )
}
