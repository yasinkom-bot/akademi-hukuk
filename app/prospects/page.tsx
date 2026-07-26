'use client';
import { useState } from 'react';
import styles from '../clients/page.module.css'; // Reusing clients CSS since it's a similar table

export default function ProspectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  
  const [prospects, setProspects] = useState([
    { id: 1, name: 'Kemal Sunal', contactPerson: 'Şaban Bey', type: 'İş Hukuku', status: 'Görüşülüyor', date: '21.07.2023', notes: 'Maaş alacakları için dava açılacak, evrak bekliyoruz.' },
    { id: 2, name: 'XYZ Lojistik', contactPerson: 'Ahmet Yılmaz (İnsan Kaynakları)', type: 'Ticari', status: 'Teklif Verildi', date: '18.07.2023', notes: 'Sözleşme taslağı gönderildi, dönüş yapacaklar.' },
    { id: 3, name: 'Ayşe Kaya', contactPerson: 'Kardeşi Mehmet', type: 'Boşanma', status: 'İlk Görüşme', date: '22.07.2023', notes: 'Randevu verildi, ofise gelecek.' }
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const contactPerson = (form.elements.namedItem('contactPerson') as HTMLInputElement).value;
    const type = (form.elements.namedItem('type') as HTMLInputElement).value;
    const status = (form.elements.namedItem('status') as HTMLSelectElement).value;
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;
    
    if (editItem) {
      setProspects(prospects.map(p => p.id === editItem.id ? { ...p, name, contactPerson, type, status, notes } : p));
    } else {
      setProspects([...prospects, { id: Date.now(), name, contactPerson, type, status, notes, date: new Date().toLocaleDateString('tr-TR') }]);
    }
    
    setIsModalOpen(false);
    setEditItem(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu muhtemel dosyayı silmek istediğinize emin misiniz?")) {
      setProspects(prospects.filter(p => p.id !== id));
    }
  };

  return (
    <div className={styles.clientsPage}>
      <header className={styles.header}>
        <div>
          <h1>Muhtemel Dosyalar (Müzakere)</h1>
          <p>Henüz açılmamış, görüşme ve teklif aşamasındaki dosyalarınızı takip edin.</p>
        </div>
        <button className={styles.addButton} onClick={() => { setEditItem(null); setIsModalOpen(true); }}>+ Yeni Görüşme Ekle</button>
      </header>

      <div className={`${styles.tableContainer} glass`}>
        <table className={styles.dataGrid}>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Muhtemel Müvekkil</th>
              <th>Dosya İlgilisi</th>
              <th>Dosya Türü</th>
              <th>Durum</th>
              <th>Notlar</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {prospects.map(p => (
              <tr key={p.id} onClick={() => { setEditItem(p); setIsModalOpen(true); }} style={{cursor: 'pointer'}} title="Detayları görmek için tıklayın" onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td>{p.date}</td>
                <td style={{fontWeight: 600}}>{p.name}</td>
                <td>{p.contactPerson || '-'}</td>
                <td>{p.type}</td>
                <td>
                  <span className={styles.badge} style={{background: p.status === 'Görüşülüyor' ? 'var(--primary)' : (p.status === 'Teklif Verildi' ? 'var(--success)' : 'var(--warning)')}}>
                    {p.status}
                  </span>
                </td>
                <td style={{fontSize: '0.85rem', color: '#64748b'}}>{p.notes}</td>
                <td>
                  <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); setEditItem(p); setIsModalOpen(true); }}>Düzenle</button>
                  <button className={styles.actionBtn} style={{marginLeft: '0.5rem', color: 'var(--danger)'}} onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.overlay} onMouseDown={(e) => { if(e.target === e.currentTarget) { setIsModalOpen(false); setEditItem(null); } }}>
          <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editItem ? 'Görüşmeyi Düzenle' : 'Yeni Görüşme Ekle'}</h2>
              <button className={styles.closeBtn} onClick={() => { setIsModalOpen(false); setEditItem(null); }}>&times;</button>
            </div>
            <div className={styles.modalContent}>
              <form className={styles.form} onSubmit={handleSave}>
                <div className={styles.formGroup}>
                  <label>Muhtemel Müvekkil (İsim/Unvan)</label>
                  <input type="text" name="name" required defaultValue={editItem?.name} />
                </div>
                <div className={styles.formGroup}>
                  <label>Dosya İlgilisi</label>
                  <input type="text" name="contactPerson" defaultValue={editItem?.contactPerson} placeholder="Örn: Şirket Yetkilisi, Avukatı vb." />
                </div>
                <div className={styles.formGroup}>
                  <label>Dosya Türü</label>
                  <input type="text" name="type" required defaultValue={editItem?.type} placeholder="Örn: İş Hukuku, Boşanma" />
                </div>
                <div className={styles.formGroup}>
                  <label>Durum</label>
                  <select name="status" required defaultValue={editItem?.status || 'İlk Görüşme'}>
                    <option value="İlk Görüşme">İlk Görüşme</option>
                    <option value="Görüşülüyor">Görüşülüyor</option>
                    <option value="Teklif Verildi">Teklif Verildi</option>
                    <option value="Sözleşme Bekleniyor">Sözleşme Bekleniyor</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Görüşme Notları</label>
                  <textarea name="notes" required defaultValue={editItem?.notes} rows={4}></textarea>
                </div>
                <button type="submit" className={styles.submitBtn}>Kaydet</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
