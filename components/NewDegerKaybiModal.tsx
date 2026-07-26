'use client';
import { useState } from 'react';
import styles from './CaseModal.module.css';

interface NewDegerKaybiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewDegerKaybiModal({ isOpen, onClose }: NewDegerKaybiModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()} style={{maxWidth: '800px'}}>
        <div className={styles.header}>
          <h2>Yeni Değer Kaybı Dosyası Ekle</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.content}>
          <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', marginTop: '-0.5rem'}}>
            Sigorta ve tahkim süreçlerinin otomatik yürütülebilmesi için değer kaybına konu olan aracın bilgilerini eksiksiz giriniz.
          </p>

          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); alert("Değer Kaybı dosyası başarıyla eklendi!"); onClose(); }}>
            
            <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem'}}>Genel Dosya Durumu ve Kazanç</h3>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>Dosya Durumu</label>
                 <select name="status" defaultValue="Muhtemel Dosya" required>
                    <option value="Muhtemel Dosya">Muhtemel Dosya</option>
                    <option value="Vekalet Alındı">Vekalet Alındı</option>
                    <option value="Başvuru Yapılacak">Başvuru Yapılacak</option>
                    <option value="Sigortaya Başvuruldu">Sigortaya Başvuruldu</option>
                    <option value="Tahkim Yapılacak">Tahkim Yapılacak</option>
                    <option value="Tahkim Başvurusu Yapıldı">Tahkim Başvurusu Yapıldı</option>
                    <option value="Önödeme">Önödeme</option>
                    <option value="Sulh">Sulh</option>
                    <option value="Bilirkişi Atandı">Bilirkişi Atandı</option>
                    <option value="Bilirkişi Raporu Geldi">Bilirkişi Raporu Geldi</option>
                    <option value="Islah Edildi">Islah Edildi</option>
                    <option value="Karar Geldi">Karar Geldi</option>
                    <option value="Karar İcraya Kondu">Karar İcraya Kondu</option>
                    <option value="İtiraz Başvurusu Yapıldı">İtiraz Başvurusu Yapıldı</option>
                    <option value="İtirazda">İtirazda</option>
                    <option value="Tahsil Edildi">Tahsil Edildi</option>
                 </select>
               </div>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>Kazanç (₺) - Opsiyonel</label>
                 <input type="number" name="kazanc" placeholder="0.00" />
               </div>
            </div>

            <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem'}}>Müvekkil ve Araç Bilgileri</h3>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>Müvekkil Adı Soyadı</label>
                 <input type="text" name="clientName" required placeholder="Ahmet Yılmaz" />
               </div>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>TC Kimlik / VKN</label>
                 <input type="text" name="tc" required placeholder="11111111111" />
               </div>
               <div className={styles.formGroup} style={{flex: '1 1 100%'}}>
                 <label>Adres</label>
                 <input type="text" name="address" required placeholder="İkametgah adresi" />
               </div>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>Müvekkil Araç Plakası</label>
                 <input type="text" name="plate" required placeholder="34 ABC 123" />
               </div>
            </div>

            <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem'}}>Kaza ve Karşı Taraf Bilgileri</h3>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>Kaza Tarihi</label>
                 <input type="date" name="kazaTarihi" required />
               </div>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>Kaza Yeri (İl/İlçe)</label>
                 <input type="text" name="kazaYeri" required placeholder="İstanbul / Kadıköy" />
               </div>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>Karşı Araç Plakası</label>
                 <input type="text" name="karsiPlaka" required placeholder="06 DEF 456" />
               </div>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>Karşı Araç Sahibi / Sürücüsü</label>
                 <input type="text" name="karsiSahip" placeholder="Mehmet Demir" />
               </div>
            </div>

            <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem'}}>Sigorta Bilgileri</h3>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>Karşı Taraf Sigorta Şirketi</label>
                 <select name="sigortaSirketi" required>
                   <option value="">Seçiniz...</option>
                   <option value="Axa Sigorta">Axa Sigorta A.Ş.</option>
                   <option value="Allianz Sigorta">Allianz Sigorta A.Ş.</option>
                   <option value="Anadolu Sigorta">Anadolu Sigorta A.Ş.</option>
                   <option value="Türkiye Sigorta">Türkiye Sigorta A.Ş.</option>
                   <option value="Sompo Sigorta">Sompo Sigorta A.Ş.</option>
                   <option value="Diğer">Diğer</option>
                 </select>
               </div>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>Poliçe Numarası</label>
                 <input type="text" name="policeNo" required placeholder="123456789" />
               </div>
               <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                 <label>İhtar Bitiş (Tahkime Son) Tarihi</label>
                 <input type="date" name="ihtarDate" />
                 <small style={{color: '#64748b', fontSize: '0.75rem', marginTop: '4px', display: 'block'}}>Tahkim süresini Dashboard üzerinde geri sayımla takip edebilirsiniz.</small>
               </div>
            </div>

            <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'flex-end'}}>
               <button type="button" onClick={onClose} style={{background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--card-border)', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', marginRight: '1rem', fontWeight: 600}}>İptal</button>
               <button type="submit" className={styles.submitBtn} style={{width: 'auto', padding: '0.75rem 2rem'}}>Değer Kaybı Dosyasını Oluştur</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
