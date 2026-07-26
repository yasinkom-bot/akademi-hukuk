'use client';
import { useState } from 'react';
import styles from './CaseModal.module.css';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewCaseModal({ isOpen, onClose }: NewCaseModalProps) {
  const [showNewClient, setShowNewClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [clients, setClients] = useState([
    { id: 1, name: 'Ahmet Yılmaz' },
    { id: 2, name: 'Mehmet Demir' },
    { id: 3, name: 'Vakıfbank A.Ş.' }
  ]);

  const [showNewOpponent, setShowNewOpponent] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState('');
  const [opponents, setOpponents] = useState([
    { id: 1, name: 'Vakıfbank' },
    { id: 2, name: 'Ayşe Kaya' },
    { id: 3, name: 'SGK' }
  ]);
  const lawyers = ['Av. Canan K.', 'Av. Burak D.', 'Admin Kullanıcı'];

  if (!isOpen) return null;

  const handleAddClient = (e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.getElementById('newClientName') as HTMLInputElement;
    if (input && input.value) {
      const newId = Date.now();
      setClients([...clients, { id: newId, name: input.value }]);
      setSelectedClient(newId.toString());
      setShowNewClient(false);
    }
  };

  const handleAddOpponent = (e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.getElementById('newOpponentName') as HTMLInputElement;
    if (input && input.value) {
      const newId = Date.now();
      setOpponents([...opponents, { id: newId, name: input.value }]);
      setSelectedOpponent(newId.toString());
      setShowNewOpponent(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Yeni Dosya Ekle</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.content}>
          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); alert("Dosya başarıyla eklendi!"); onClose(); }}>
            <div className={styles.formGroup}>
              <label>Dosya Türü</label>
              <select required>
                <option value="">Seçiniz...</option>
                <option value="Ceza">Ceza</option>
                <option value="Hukuk">Hukuk</option>
                <option value="Değer Kaybı">Değer Kaybı</option>
                <option value="İdari">İdari</option>
                <option value="İcra">İcra</option>
                <option value="Danışmanlık">Danışmanlık</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                Müvekkil
                <button type="button" onClick={() => setShowNewClient(!showNewClient)} style={{background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600}}>
                  + Yeni Müvekkil
                </button>
              </label>
              
              {showNewClient ? (
                <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                   <input type="text" id="newClientName" placeholder="Ad Soyad / Unvan" style={{flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)'}} />
                   <button type="button" onClick={handleAddClient} style={{background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer'}}>Ekle</button>
                </div>
              ) : (
                <select required value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                  <option value="">Sistemden seçiniz...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label>Sorumlu Avukat</label>
              <select required>
                <option value="">Avukat seçiniz...</option>
                {lawyers.map((l, i) => (
                  <option key={i} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Mahkeme / İcra Dairesi</label>
              <input type="text" name="court" placeholder="Örn: İstanbul 1. Asliye Hukuk Mahkemesi" />
            </div>

            <div className={styles.formGroup}>
              <label style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                Karşı Taraf
                <button type="button" onClick={() => setShowNewOpponent(!showNewOpponent)} style={{background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600}}>
                  + Yeni Karşı Taraf
                </button>
              </label>
              
              {showNewOpponent ? (
                <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                   <input type="text" id="newOpponentName" placeholder="Ad Soyad / Unvan" style={{flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)'}} />
                   <button type="button" onClick={handleAddOpponent} style={{background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer'}}>Ekle</button>
                </div>
              ) : (
                <select required value={selectedOpponent} onChange={(e) => setSelectedOpponent(e.target.value)}>
                  <option value="">Sistemden seçiniz...</option>
                  {opponents.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              )}
            </div>
            
            <button type="submit" className={styles.submitBtn}>Dosyayı Kaydet</button>
          </form>
        </div>
      </div>
    </div>
  )
}
