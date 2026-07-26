'use client';
import { useState, useMemo } from 'react';
import styles from './page.module.css'
import CaseModal from '@/components/CaseModal';

export default function ClientsPage() {
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [editClient, setEditClient] = useState<any>(null);
  const [viewClient, setViewClient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCase, setActiveCase] = useState<any>(null);
  const [hoveredClient, setHoveredClient] = useState<number | null>(null);
  
  const [clients, setClients] = useState([
    { 
      id: 1, name: 'Ahmet Yılmaz', tckn: '12345678901', contact: '+90 555 123 4567', address: 'İstanbul, Şişli',
      cases: [
        { id: 1, esasNo: '2023/112', type: 'Dava', client: 'Ahmet Yılmaz', opponent: 'Vakıfbank' },
        { id: 9, esasNo: '2023/450', type: 'Dava', client: 'Ahmet Yılmaz', opponent: 'Mehmet Demir' }
      ]
    },
    { 
      id: 2, name: 'Mehmet Demir', tckn: '98765432109', contact: '+90 555 987 6543', address: 'Ankara, Çankaya',
      cases: [
        { id: 2, esasNo: '2022/45', type: 'İcra', client: 'Mehmet Demir', opponent: 'Ayşe Kaya' }
      ]
    },
    { 
      id: 3, name: 'Vakıfbank A.Ş.', tckn: '8520369741', contact: 'info@vakifbank.com', address: 'İstanbul, Levent',
      cases: [
        { id: 3, esasNo: '2023/88', type: 'Danışmanlık', client: 'Vakıfbank A.Ş.', opponent: '-' },
        { id: 10, esasNo: '2023/500', type: 'İcra', client: 'Vakıfbank A.Ş.', opponent: 'Ali Veli' }
      ]
    }
  ]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.tckn.includes(searchQuery) ||
      c.contact.includes(searchQuery)
    );
  }, [clients, searchQuery]);

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const tckn = (form.elements.namedItem('tckn') as HTMLInputElement).value;
    const contact = (form.elements.namedItem('contact') as HTMLInputElement).value;
    const address = (form.elements.namedItem('address') as HTMLTextAreaElement).value;
    
    if (editClient) {
      setClients(clients.map(c => c.id === editClient.id ? { ...c, name, tckn, contact, address } : c));
      alert('Müvekkil güncellendi!');
    } else {
      setClients([...clients, { id: Date.now(), name, tckn, contact, address, cases: [] }]);
      alert('Müvekkil başarıyla eklendi!');
    }
    
    setIsNewClientOpen(false);
    setEditClient(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu müvekkili silmek istediğinize emin misiniz?")) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const openEdit = (client: any) => {
    setEditClient(client);
    setIsNewClientOpen(true);
  };

  return (
    <div className={styles.clientsPage}>
      <header className={styles.header}>
        <div>
          <h1>Müvekkiller</h1>
          <p>Müvekkil bilgilerinizi ve ilişkili dosyaları yönetin.</p>
        </div>
        <button className={styles.addButton} onClick={() => { setEditClient(null); setIsNewClientOpen(true); }}>+ Yeni Müvekkil Ekle</button>
      </header>

      <div className={`${styles.tableContainer} glass`}>
        <div className={styles.tableFilters}>
          <input 
            type="text" 
            placeholder="İsim, TCKN veya İletişim ara..." 
            className={styles.filterInput} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <table className={styles.dataGrid}>
          <thead>
            <tr>
              <th>Ad Soyad / Unvan</th>
              <th>TCKN / VKN</th>
              <th>İletişim</th>
              <th>Bağlı Dosyalar</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? filteredClients.map(client => (
              <tr key={client.id} onClick={() => setViewClient(client)} style={{cursor: 'pointer'}} title="Detayları görmek için tıklayın">
                <td style={{fontWeight: 600}}>{client.name}</td>
                <td>{client.tckn}</td>
                <td>{client.contact}</td>
                <td 
                  onMouseEnter={() => setHoveredClient(client.id)}
                  onMouseLeave={() => setHoveredClient(null)}
                  onClick={(e) => e.stopPropagation()}
                  style={{position: 'relative'}}
                >
                  <span className={styles.badge} style={{cursor: 'pointer'}}>
                    {client.cases.length} Dosya
                  </span>
                  
                  {hoveredClient === client.id && client.cases.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, 
                      background: 'var(--card-bg)', border: '1px solid var(--card-border)', 
                      borderRadius: '8px', padding: '0.5rem', zIndex: 100, 
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)', minWidth: '200px'
                    }}>
                      {client.cases.map(c => (
                        <div 
                          key={c.id} 
                          onClick={() => setActiveCase(c)}
                          style={{
                            padding: '0.5rem', borderBottom: '1px solid var(--card-border)', 
                            cursor: 'pointer', fontSize: '0.85rem'
                          }}
                        >
                          <div style={{fontWeight: 600, color: 'var(--primary)'}}>{c.type} - {c.esasNo}</div>
                          <div style={{color: '#64748b'}}>Karşı Taraf: {c.opponent}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className={styles.actionBtn} onClick={() => openEdit(client)}>Düzenle</button>
                  <button className={styles.actionBtn} style={{marginLeft: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)'}} onClick={() => handleDelete(client.id)}>Sil</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>Sonuç bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isNewClientOpen && (
        <div className={styles.overlay} onMouseDown={(e) => { if(e.target === e.currentTarget) { setIsNewClientOpen(false); setEditClient(null); } }}>
          <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editClient ? 'Müvekkili Düzenle' : 'Yeni Müvekkil Ekle'}</h2>
              <button className={styles.closeBtn} onClick={() => { setIsNewClientOpen(false); setEditClient(null); }}>&times;</button>
            </div>
            <div className={styles.modalContent}>
              <form className={styles.form} onSubmit={handleSaveClient}>
                <div className={styles.formGroup}>
                  <label>Ad Soyad / Kurum Unvanı</label>
                  <input type="text" name="name" required defaultValue={editClient?.name} placeholder="Örn: Ayşe Yılmaz" />
                </div>
                <div className={styles.formGroup}>
                  <label>TCKN / VKN</label>
                  <input type="text" name="tckn" required defaultValue={editClient?.tckn} placeholder="11 Haneli TCKN veya VKN" />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefon / E-posta</label>
                  <input type="text" name="contact" defaultValue={editClient?.contact} placeholder="+90 555..." />
                </div>
                <div className={styles.formGroup}>
                  <label>Adres</label>
                  <textarea name="address" defaultValue={editClient?.address} placeholder="Tam adres bilgisi..." rows={3}></textarea>
                </div>
                <button type="submit" className={styles.submitBtn}>{editClient ? 'Değişiklikleri Kaydet' : 'Müvekkil Ekle'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Case Modal from Client's cases dropdown */}
      {activeCase && (
        <CaseModal isOpen={true} onClose={() => setActiveCase(null)} caseData={activeCase} />
      )}

      {/* Client Detail View Modal */}
      {viewClient && (
        <div className={styles.overlay} onMouseDown={(e) => { if(e.target === e.currentTarget) { setViewClient(null); } }} style={{zIndex: 1000}}>
          <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()} style={{maxWidth: '500px'}}>
            <div className={styles.modalHeader}>
              <h2>Müvekkil Detayları</h2>
              <button className={styles.closeBtn} onClick={() => setViewClient(null)}>&times;</button>
            </div>
            <div className={styles.modalContent} style={{padding: '1.5rem'}}>
               <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1rem', color: 'var(--foreground)'}}>
                 <div style={{padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--card-border)'}}>
                   <div style={{fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem'}}>{viewClient.name}</div>
                   <div><strong>TCKN / VKN:</strong> <span style={{color: '#64748b'}}>{viewClient.tckn}</span></div>
                   <div style={{marginTop: '0.25rem'}}><strong>İletişim:</strong> <span style={{color: '#64748b'}}>{viewClient.contact}</span></div>
                   <div style={{marginTop: '0.25rem'}}><strong>Adres:</strong> <span style={{color: '#64748b'}}>{viewClient.address}</span></div>
                 </div>
                 
                 <div style={{padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--card-border)'}}>
                   <strong style={{display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)'}}>Bağlı Dosyalar ({viewClient.cases.length}):</strong>
                   {viewClient.cases.length > 0 ? (
                     <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                       {viewClient.cases.map((c: any) => (
                         <li 
                           key={c.id} 
                           onClick={() => setActiveCase(c)}
                           style={{padding: '0.5rem', background: 'var(--card-bg)', borderRadius: '6px', border: '1px solid var(--card-border)', fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s'}}
                           onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                           onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                           title="Dosya detayını görmek için tıklayın"
                         >
                           <span style={{fontWeight: 600, color: 'var(--primary)'}}>{c.type}</span> - {c.esasNo}
                           <div style={{color: '#64748b', fontSize: '0.8rem', marginTop: '2px'}}>Karşı Taraf: {c.opponent}</div>
                         </li>
                       ))}
                     </ul>
                   ) : (
                     <div style={{color: '#64748b', fontSize: '0.9rem'}}>Bu müvekkile bağlı aktif dosya bulunmuyor.</div>
                   )}
                 </div>
               </div>
               
               <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                 <button className={styles.actionBtn} onClick={() => { setViewClient(null); openEdit(viewClient); }}>Bilgileri Düzenle</button>
                 <button className={styles.submitBtn} onClick={() => setViewClient(null)}>Kapat</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
