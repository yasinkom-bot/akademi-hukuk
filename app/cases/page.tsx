'use client';
import { useState } from 'react';
import styles from './page.module.css'
import CaseModal from '@/components/CaseModal'
import NewCaseModal from '@/components/NewCaseModal'
import * as XLSX from 'xlsx';

export default function CasesPage() {
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  
  const [cases, setCases] = useState([
    { id: 1, esasNo: '2023/112', type: 'Dava', client: 'Ahmet Yılmaz', court: 'İstanbul 1. Asliye Hukuk Mahkemesi', opponent: 'Vakıfbank', lawyer: 'Av. Canan K.', isArchived: false },
    { id: 2, esasNo: '2022/45', type: 'İcra', client: 'Mehmet Demir', court: 'Ankara 3. İcra Dairesi', opponent: 'Ayşe Kaya', lawyer: 'Av. Burak D.', isArchived: false },
    { id: 3, esasNo: '2023/88', type: 'Danışmanlık', client: 'Vakıfbank A.Ş.', court: '-', opponent: '-', lawyer: 'Admin Kullanıcı', isArchived: false },
    { id: 4, esasNo: '2021/304', type: 'Ceza', client: 'Fatma Şahin', court: 'İstanbul 5. Ağır Ceza Mahkemesi', opponent: 'Kamu', lawyer: 'Av. Canan K.', isArchived: true },
    { id: 5, esasNo: '2023/12', type: 'İdari', client: 'XYZ Ltd. Şti.', court: 'İzmir 1. İdare Mahkemesi', opponent: 'SGK', lawyer: 'Av. Burak D.', isArchived: false },
    { id: 6, esasNo: '2022/990', type: 'Değer Kaybı', client: 'Ali Veli', court: 'Sigorta Tahkim Komisyonu', opponent: 'Sigorta A.Ş.', lawyer: 'Admin Kullanıcı', isArchived: false },
    { id: 7, esasNo: '2020/12', type: 'Dava', client: 'Hasan Yılmaz', court: 'Ankara 2. Asliye Ticaret Mahkemesi', opponent: 'Ziraat Bankası', lawyer: 'Av. Canan K.', isArchived: true },
    { id: 8, esasNo: '2021/89', type: 'İcra', client: 'Ayşe Demir', court: 'İstanbul 10. İcra Dairesi', opponent: 'Ahmet Çelik', lawyer: 'Av. Burak D.', isArchived: true },
    { id: 9, esasNo: '2023/450', type: 'Dava', client: 'Ahmet Yılmaz', court: 'Bakırköy 3. İş Mahkemesi', opponent: 'Mehmet Demir', lawyer: 'Av. Canan K.', isArchived: false },
    { id: 10, esasNo: '2023/500', type: 'İcra', client: 'Vakıfbank A.Ş.', court: 'Kadıköy 2. İcra Dairesi', opponent: 'Ali Veli', lawyer: 'Admin Kullanıcı', isArchived: false }
  ]);

  const handleOpenCase = (c: any) => {
    setSelectedCase(c);
    setIsCaseModalOpen(true);
  };

  const handleArchive = (id: number) => {
    setCases(cases.map(c => c.id === id ? { ...c, isArchived: true } : c));
    alert('Dosya arşive kaldırıldı!');
  };

  const handleUnarchive = (id: number) => {
    setCases(cases.map(c => c.id === id ? { ...c, isArchived: false } : c));
    alert('Dosya arşivden çıkarıldı!');
  };

  const filteredCases = cases
    .filter(c => c.type !== 'Değer Kaybı')
    .filter(c => {
      if (statusFilter === 'active') return !c.isArchived;
      if (statusFilter === 'archived') return c.isArchived;
      return true;
    })
    .filter(c => typeFilter ? c.type === typeFilter : true)
    .filter(c => {
      if (!searchTerm) return true;
      const lowerTerm = searchTerm.toLowerCase();
      return (
        c.client.toLowerCase().includes(lowerTerm) ||
        c.esasNo.toLowerCase().includes(lowerTerm) ||
        c.id.toString() === searchTerm
      );
    });

  const exportToExcel = () => {
    const headers = ['Föy No', 'Müvekkil', 'Mahkeme / Birim', 'Esas No', 'Tür', 'Karşı Taraf', 'Durum'];
    const rows = filteredCases.map(c => [
      c.id,
      c.client,
      c.court,
      c.esasNo,
      c.type,
      c.opponent,
      c.isArchived ? 'Arşivlendi' : 'Aktif'
    ]);
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dosyalar");
    
    XLSX.writeFile(workbook, `Dosyalar_${new Date().toLocaleDateString('tr-TR')}.xlsx`);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className={styles.casesPage}>
      <header className={styles.header}>
        <div>
          <h1>Raporlama ve Dosyalar</h1>
          <p>Tüm dava ve icra dosyalarını tarayın ve yönetin.</p>
        </div>
        <button className={styles.addButton} onClick={() => setIsNewCaseOpen(true)}>+ Yeni Dosya Ekle</button>
      </header>

      <div className={`${styles.tableContainer} glass`}>
        <div className={styles.tableFilters}>
          <input 
            type="text" 
            placeholder="Föy No, Esas No veya Müvekkil ara..." 
            className={styles.filterInput} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className={styles.filterSelect} 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tüm Dosya Türleri</option>
            <option value="Dava">Dava</option>
            <option value="İcra">İcra</option>
            <option value="Danışmanlık">Danışmanlık</option>
            <option value="Ceza">Ceza</option>
            <option value="İdari">İdari</option>
          </select>
          <select 
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="active">Aktif Dosyalar</option>
            <option value="archived">Arşivlenmiş Dosyalar</option>
            <option value="all">Tümü</option>
          </select>
        </div>

        <table className={styles.dataGrid}>
          <thead>
            <tr>
              <th>Föy No</th>
              <th>Müvekkil</th>
              <th>Mahkeme</th>
              <th>Esas No</th>
              <th>Tür</th>
              <th>Karşı Taraf</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c) => (
              <tr key={c.id} onClick={() => handleOpenCase(c)} style={{cursor: 'pointer'}} title="Detayları görmek için tıklayın" onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td>{c.id}</td>
                <td style={{fontWeight: 600}}>{c.client}</td>
                <td>{c.court}</td>
                <td>{c.esasNo}</td>
                <td><span className={styles.tag}>{c.type}</span></td>
                <td>{c.opponent}</td>
                <td>{c.isArchived ? <span className={styles.tag} style={{background: '#f87171', color: 'white'}}>Arşivlendi</span> : <span className={styles.tag} style={{background: '#4ade80', color: 'white'}}>Aktif</span>}</td>
                <td>
                  <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); handleOpenCase(c); }}>İncele</button>
                  {!c.isArchived ? (
                    <button className={styles.actionBtn} style={{marginLeft: '8px', color: 'var(--warning)', borderColor: 'var(--warning)'}} onClick={(e) => { e.stopPropagation(); handleArchive(c.id); }}>Arşivle</button>
                  ) : (
                    <button className={styles.actionBtn} style={{marginLeft: '8px', color: 'var(--success)', borderColor: 'var(--success)'}} onClick={(e) => { e.stopPropagation(); handleUnarchive(c.id); }}>Arşivden Çıkar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem'}} className="print-hide">
          <div className={styles.pagination}>
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
      
      <CaseModal isOpen={isCaseModalOpen} onClose={() => setIsCaseModalOpen(false)} caseData={selectedCase} />
      <NewCaseModal isOpen={isNewCaseOpen} onClose={() => setIsNewCaseOpen(false)} />
    </div>
  )
}
