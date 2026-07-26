'use client';
import { useState, useEffect } from 'react';
import styles from '../cases/page.module.css'; // Reusing cases CSS
import dashboardStyles from '../page.module.css'; // Reusing dashboard CSS
import CaseModal from '@/components/CaseModal';
import NewDegerKaybiModal from '@/components/NewDegerKaybiModal';
import modalStyles from '@/components/CaseModal.module.css';
import * as XLSX from 'xlsx';

export default function DegerKaybiPage() {
  const [activeCase, setActiveCase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [statusFilterModal, setStatusFilterModal] = useState<string | null>(null);
  const [filter, setFilter] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [now, setNow] = useState(new Date());
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  useEffect(() => {
    setNow(new Date());
  }, []);
  
  const [cases, setCases] = useState([
    { id: 6, esasNo: '2022/990', type: 'Değer Kaybı', client: 'Ali Veli', court: 'Sigorta Tahkim Komisyonu', opponent: 'Anadolu Sigorta A.Ş.', lawyer: 'Admin Kullanıcı', isArchived: false, status: 'Tahkim Başvurusu Yapıldı', ihtarDate: '2026-07-25', kazanc: '15000' },
    { id: 11, esasNo: 'Başvuru Bekliyor', type: 'Değer Kaybı', client: 'Ayşe Demir', court: 'Sigorta Tahkim Komisyonu', opponent: 'Axa Sigorta A.Ş.', lawyer: 'Av. Canan K.', isArchived: false, status: 'Sigortaya Başvuruldu', ihtarDate: '2026-07-22', kazanc: '8500' },
    { id: 14, esasNo: '2023/12', type: 'Değer Kaybı', client: 'Mehmet Yılmaz', court: 'Sigorta Tahkim Komisyonu', opponent: 'Sompo Sigorta A.Ş.', lawyer: 'Av. Burak D.', isArchived: true, status: 'Tahsil Edildi', ihtarDate: '', kazanc: '22000' },
    { id: 18, esasNo: 'Ön İnceleme', type: 'Değer Kaybı', client: 'Canan K.', court: 'Sigorta Tahkim Komisyonu', opponent: 'Allianz Sigorta A.Ş.', lawyer: 'Admin Kullanıcı', isArchived: false, status: 'Bilirkişi Atandı', ihtarDate: '', kazanc: '' }
  ]);

  const handleOpenCase = (c: any) => {
    setActiveCase(c);
    setIsModalOpen(true);
  };

  const handleToggleArchive = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setCases(cases.map(c => c.id === id ? { ...c, isArchived: !c.isArchived } : c));
  };

  const filteredCases = cases
    .filter(c => filter === 'archived' ? c.isArchived : !c.isArchived)
    .filter(c => {
      if (!searchTerm) return true;
      const lowerTerm = searchTerm.toLowerCase();
      return (
        c.client.toLowerCase().includes(lowerTerm) ||
        c.esasNo.toLowerCase().includes(lowerTerm) ||
        c.opponent.toLowerCase().includes(lowerTerm) ||
        c.id.toString() === searchTerm
      );
    });

  // Status Distribution Calculation
  const statusCounts = cases.filter(c => !c.isArchived).reduce((acc: any, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  // İhtar Countdown Logic
  const getDaysLeft = (dateString: string) => {
    if (!dateString) return null;
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const exportToExcel = () => {
    const headers = ['Föy No', 'Durum', 'İhtar Kalan', 'Müvekkil', 'Karşı Taraf', 'Birim', 'Kazanç'];
    const rows = filteredCases.map(c => [
      c.id,
      c.status,
      getDaysLeft(c.ihtarDate) !== null ? getDaysLeft(c.ihtarDate) + ' gün' : '-',
      c.client,
      c.opponent,
      c.court,
      c.kazanc ? c.kazanc + ' ₺' : '-'
    ]);
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Değer Kaybı");
    
    XLSX.writeFile(workbook, `DegerKaybi_${new Date().toLocaleDateString('tr-TR')}.xlsx`);
  };

  const exportToPDF = () => {
    window.print();
  };

  const activeIhtars = cases.filter(c => !c.isArchived && c.ihtarDate).map(c => ({
    ...c,
    daysLeft: getDaysLeft(c.ihtarDate)
  })).sort((a, b) => (a.daysLeft || 0) - (b.daysLeft || 0));

  return (
    <div className={styles.casesPage}>
      <header className={styles.header}>
        <div>
          <h1>Değer Kaybı Masası</h1>
          <p>Değer kaybı dosyalarınız, sigorta süreçleriniz ve ihtar/tahkim takipleriniz.</p>
        </div>
        <button className={styles.addButton} onClick={() => setIsNewModalOpen(true)}>
          + Yeni Değer Kaybı Dosyası
        </button>
      </header>

      {/* Mini Dashboard Widgets for Değer Kaybı */}
      <div className={dashboardStyles.widgetsGrid} style={{marginBottom: '2rem'}}>
        
        {/* Kazanç ve Finansal Özet */}
        <div className={dashboardStyles.widget}>
          <h2>💰 DK Finansal Özet</h2>
          <div className={dashboardStyles.financeSummary}>
            <div className={dashboardStyles.financeBox}>
              <span className={dashboardStyles.financeLabel}>Tahsil Edilen Kazanç</span>
              <span className={dashboardStyles.financeAmount} style={{color: 'var(--success)'}}>
                ₺ {cases.filter(c => c.status === 'Tahsil Edildi').reduce((sum, c) => sum + Number(c.kazanc || 0), 0).toLocaleString('tr-TR')}
              </span>
            </div>
            <div className={dashboardStyles.financeBox}>
              <span className={dashboardStyles.financeLabel}>Beklenen Kazanç (Açık Dosyalar)</span>
              <span className={dashboardStyles.financeAmount} style={{color: 'var(--primary)'}}>
                ₺ {cases.filter(c => c.status !== 'Tahsil Edildi' && !c.isArchived).reduce((sum, c) => sum + Number(c.kazanc || 0), 0).toLocaleString('tr-TR')}
              </span>
            </div>
          </div>
        </div>

        {/* İhtar ve Tahkim Sayaçları */}
        <div className={dashboardStyles.widget}>
          <h2>⏰ Tahkim / İhtar Sayaçları</h2>
          <div className={dashboardStyles.countdownContainer}>
             {activeIhtars.length > 0 ? activeIhtars.map(c => (
               <div className={dashboardStyles.countdownItem} key={c.id}>
                 <div className={dashboardStyles.circle} style={{borderColor: c.daysLeft && c.daysLeft <= 3 ? 'var(--danger)' : 'var(--warning)'}}>
                   <span className={dashboardStyles.number}>{c.daysLeft}</span>
                   <span className={dashboardStyles.label}>GÜN</span>
                 </div>
                 <p className={dashboardStyles.targetName} style={{fontSize: '0.85rem', textAlign: 'center', lineHeight: '1.4'}}>
                   <strong style={{display: 'block', color: 'var(--foreground)', marginBottom: '2px'}}>{c.client}</strong>
                   <span style={{color: '#64748b'}}>{c.opponent}</span>
                 </p>
               </div>
             )) : (
               <p style={{fontSize: '0.9rem', color: '#64748b', textAlign: 'center', width: '100%', padding: '1rem'}}>Aktif ihtar süresi bulunmuyor.</p>
             )}
          </div>
        </div>

        {/* Durum Dağılım Panosu */}
        <div className={dashboardStyles.widget} style={{gridColumn: '1 / -1'}}>
          <h2>📊 Dosya Durum Dağılımı (Aktif)</h2>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem'}}>
             {Object.entries(statusCounts).map(([status, count]) => (
                <div 
                  key={status} 
                  onClick={() => setStatusFilterModal(status)}
                  style={{background: 'var(--background)', border: '1px solid var(--card-border)', padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 200px', cursor: 'pointer', transition: 'all 0.2s ease'}}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                >
                  <div style={{background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700}}>
                    {String(count)}
                  </div>
                  <span style={{fontSize: '0.9rem', fontWeight: 500}}>{status}</span>
                </div>
             ))}
             {Object.keys(statusCounts).length === 0 && (
                <p style={{fontSize: '0.9rem', color: '#64748b'}}>Aktif dosya bulunmuyor.</p>
             )}
          </div>
        </div>

      </div>

      {/* Liste ve Filtreleme */}
      <div className={styles.filters} style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button 
            className={`${styles.filterBtn} ${filter === 'active' ? styles.active : ''}`}
            onClick={() => setFilter('active')}
          >
            Aktif Dosyalar
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'archived' ? styles.active : ''}`}
            onClick={() => setFilter('archived')}
          >
            Arşivlenmiş Dosyalar
          </button>
        </div>
        <input 
          type="text" 
          placeholder="Föy No, Müvekkil veya Sigorta ara..." 
          style={{padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', flex: '1', maxWidth: '300px'}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={`${styles.tableContainer} glass`}>
        <table className={styles.dataGrid}>
          <thead>
            <tr>
              <th>Föy No</th>
              <th>Müvekkil</th>
              <th>Mahkeme</th>
              <th>Esas No</th>
              <th>Tür</th>
              <th>Karşı Taraf (Sigorta)</th>
              <th>Durum</th>
              <th>Tahkim Süresi</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map(c => {
               const daysLeft = getDaysLeft(c.ihtarDate);
               return (
              <tr key={c.id} onClick={() => handleOpenCase(c)} style={{opacity: c.isArchived ? 0.7 : 1, cursor: 'pointer'}} title="İncelemek için tıklayın" onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td><strong>DK {c.id}</strong></td>
                <td style={{fontWeight: 600}}>{c.client}</td>
                <td>{c.court}</td>
                <td>{c.esasNo}</td>
                <td><span className={styles.typeTag}>{c.type}</span></td>
                <td>{c.opponent}</td>
                <td>
                  <span style={{background: 'var(--background)', border: '1px solid var(--card-border)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600}}>
                    {c.status}
                  </span>
                </td>
                <td>
                  {daysLeft !== null ? (
                    <span style={{color: daysLeft <= 3 ? 'var(--danger)' : 'var(--warning)', fontWeight: 600}}>
                      {daysLeft} gün kaldı
                    </span>
                  ) : '-'}
                </td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); handleOpenCase(c); }}>İncele / Düzenle</button>
                    <button 
                      className={styles.actionBtn} 
                      onClick={(e) => { e.stopPropagation(); handleToggleArchive(e, c.id); }}
                      style={{background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--foreground)'}}
                    >
                      {c.isArchived ? 'Arşivden Çıkar' : 'Arşivle'}
                    </button>
                  </div>
                </td>
              </tr>
            )})}
            {filteredCases.length === 0 && (
              <tr>
                <td colSpan={7} style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>
                  Bu kategoride dosya bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem'}} className="print-hide">
          <div className={dashboardStyles.pagination} style={{margin: 0}}>
             <button disabled>Önceki</button>
             <span>Sayfa 1 / 1</span>
             <button disabled>Sonraki</button>
          </div>

          <div style={{position: 'relative'}}>
            <button 
              className={styles.actionBtn} 
              style={{background: 'var(--primary)', color: 'white', padding: '0.6rem 1.2rem', display: 'flex', gap: '0.5rem', alignItems: 'center'}}
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Dışa Aktar
            </button>
            
            {isExportMenuOpen && (
              <div style={{position: 'absolute', bottom: '110%', right: 0, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', minWidth: '150px', zIndex: 10, marginBottom: '0.5rem'}}>
                <div 
                  style={{padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { exportToExcel(); setIsExportMenuOpen(false); }}
                >
                  <span style={{color: '#10b981', fontWeight: 'bold'}}>📊</span> Excel (.xlsx)
                </div>
                <div 
                  style={{padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { exportToPDF(); setIsExportMenuOpen(false); }}
                >
                  <span style={{color: '#ef4444', fontWeight: 'bold'}}>📄</span> PDF Kaydet
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CaseModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setActiveCase(null); }} 
          caseData={activeCase} 
        />
      )}

      {isNewModalOpen && (
        <NewDegerKaybiModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
      )}

      {statusFilterModal && (
        <div className={modalStyles.overlay} onClick={() => setStatusFilterModal(null)} style={{zIndex: 9999}}>
          <div className={`${modalStyles.modal} glass`} onClick={e => e.stopPropagation()} style={{maxWidth: '600px', width: '90%', padding: '2rem'}}>
            <div className={modalStyles.header} style={{marginBottom: '1rem', borderBottom: 'none'}}>
              <h2><span style={{color: 'var(--primary)'}}>{statusFilterModal}</span> Dosyaları</h2>
              <button className={modalStyles.closeBtn} onClick={() => setStatusFilterModal(null)}>&times;</button>
            </div>
            <div className={modalStyles.content} style={{maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem'}}>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {cases.filter(c => c.status === statusFilterModal && !c.isArchived).map(c => (
                  <li 
                    key={c.id} 
                    onClick={() => {
                      setStatusFilterModal(null);
                      handleOpenCase(c);
                    }}
                    style={{padding: '1rem', background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease'}}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.02)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.backgroundColor = 'var(--background)'; }}
                  >
                    <div>
                      <strong style={{display: 'block', color: 'var(--foreground)', marginBottom: '4px', fontSize: '1rem'}}>DK {c.id} - {c.client}</strong>
                      <span style={{fontSize: '0.85rem', color: '#64748b'}}>Karşı Taraf: {c.opponent} | Esas: {c.esasNo}</span>
                    </div>
                    <span style={{color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', background: 'rgba(37, 99, 235, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px'}}>İncele &rarr;</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
