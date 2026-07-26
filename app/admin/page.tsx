'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function AdminPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin Kullanıcı', role: 'Yönetici (Admin)', email: 'admin@akademihukuk.com' },
    { id: 2, name: 'Av. Canan K.', role: 'Avukat', email: 'canan@akademihukuk.com' },
    { id: 3, name: 'Burak D.', role: 'Asistan', email: 'burak@akademihukuk.com' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value;
    
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...u, name, email, role } : u));
    } else {
      setUsers([...users, { id: Date.now(), name, email, role }]);
    }
    setIsModalOpen(false);
    setEditUser(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleBackup = () => {
    alert("Yedekleme başlatıldı. backup_2023-07-21.sql indiriliyor...");
  };

  return (
    <div className={styles.adminPage}>
      <header className={styles.header}>
        <h1>Yönetim Paneli (Admin)</h1>
        <p>Sistem ayarları, kullanıcı yetkileri ve veritabanı yönetimi.</p>
      </header>

      <div className={styles.grid}>
        <div className={`${styles.card} glass`}>
          <h2>Veritabanı Yönetimi</h2>
          <p style={{marginBottom: '1rem', color: '#64748b'}}>Tüm veritabanının şifreli yedeğini (backup) alın veya mevcut bir yedeği sisteme yükleyin (restore).</p>
          <div className={styles.buttonGroup}>
            <button className={styles.primaryBtn} onClick={handleBackup}>Yedek Al (Backup)</button>
            <button className={styles.secondaryBtn} onClick={() => alert("Geri yükleme paneli açılıyor...")}>Geri Yükle (Restore)</button>
          </div>
        </div>
      </div>

      <div className={`${styles.card} glass`} style={{marginTop: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h2>Kullanıcı (Personel) Yönetimi</h2>
          <button className={styles.primaryBtn} style={{padding: '0.5rem 1rem'}} onClick={() => { setEditUser(null); setIsModalOpen(true); }}>+ Yeni Kullanıcı</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Rol / Yetki</th>
              <th>E-posta</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{fontWeight: 600}}>{u.name}</td>
                <td><span className={styles.roleTag}>{u.role}</span></td>
                <td>{u.email}</td>
                <td>
                  <button className={styles.actionBtn} onClick={() => { setEditUser(u); setIsModalOpen(true); }}>Düzenle (Şifre vb.)</button>
                  <button className={styles.actionBtn} style={{color: 'var(--danger)', marginLeft: '1rem'}} onClick={() => handleDelete(u.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.overlay} onMouseDown={(e) => { if(e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className={styles.modalContent}>
              <form className={styles.form} onSubmit={handleSave}>
                <div className={styles.formGroup}>
                  <label>Ad Soyad</label>
                  <input type="text" name="name" required defaultValue={editUser?.name} />
                </div>
                <div className={styles.formGroup}>
                  <label>E-posta (Kullanıcı Adı)</label>
                  <input type="email" name="email" required defaultValue={editUser?.email} />
                </div>
                <div className={styles.formGroup}>
                  <label>Rol / Yetki</label>
                  <select name="role" required defaultValue={editUser?.role || 'Avukat'}>
                    <option value="Yönetici (Admin)">Yönetici (Admin)</option>
                    <option value="Avukat">Avukat</option>
                    <option value="Asistan">Asistan</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{editUser ? 'Yeni Şifre Belirle (Boş bırakılabilir)' : 'Şifre'}</label>
                  <input type="password" name="password" required={!editUser} />
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
