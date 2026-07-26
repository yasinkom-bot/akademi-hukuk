'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './CaseModal.module.css';
import { useAppContext } from '../app/context/AppContext';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData?: any;
  initialTab?: string;
}

export default function CaseModal({ isOpen, onClose, caseData, initialTab = 'summary' }: CaseModalProps) {
  const { events, addEvent, updateEvent, currentUser } = useAppContext();
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const [localCaseData, setLocalCaseData] = useState(caseData);
  useEffect(() => setLocalCaseData(caseData), [caseData]);
  
  const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingHearing, setIsAddingHearing] = useState(false);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingIkame, setIsEditingIkame] = useState(!caseData?.ikame);

  useEffect(() => {
    if (localCaseData?.id) {
      const savedNotes = localStorage.getItem(`caseNotes_${localCaseData.id}`);
      if (savedNotes !== null) {
        setNotes(savedNotes);
      } else {
        setNotes(localCaseData.notes || '');
      }
    }
  }, [localCaseData]);
  
  const [expenses, setExpenses] = useState([
    { id: 1, date: '10.07.2023', desc: 'Bilirkişi Ücreti', amount: 1500 },
    { id: 2, date: '15.07.2023', desc: 'Tebligat Gideri', amount: 120 }
  ]);

  const [hearings, setHearings] = useState([
    { id: 1, date: '25.07.2023', time: '09:30', court: 'İstanbul 4. Asliye Hukuk', note: 'Tanıklar dinlenecek.' }
  ]);

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Vekaletname.pdf', date: '01.06.2023' }
  ]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const desc = (form.elements.namedItem('desc') as HTMLInputElement).value;
    const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
    setExpenses([...expenses, { id: Date.now(), date: new Date().toLocaleDateString('tr-TR'), desc, amount }]);
    setIsAddingExpense(false);
  };

  const handleAddHearing = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const date = (form.elements.namedItem('date') as HTMLInputElement).value;
    const time = (form.elements.namedItem('time') as HTMLInputElement).value;
    const court = (form.elements.namedItem('court') as HTMLInputElement).value;
    const note = (form.elements.namedItem('note') as HTMLTextAreaElement).value;
    // Basic format date (YYYY-MM-DD -> DD.MM.YYYY)
    const formattedDate = date.split('-').reverse().join('.');
    setHearings([...hearings, { id: Date.now(), date: formattedDate, time, court, note }]);
    setIsAddingHearing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs = Array.from(e.target.files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        date: new Date().toLocaleDateString('tr-TR')
      }));
      setDocuments([...documents, ...newDocs]);
      alert(`${e.target.files.length} evrak başarıyla yüklendi.`);
    }
  };

  const handleAddFileTask = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const dateStr = (form.elements.namedItem('date') as HTMLInputElement).value;
    const assignedTo = (form.elements.namedItem('assignedTo') as HTMLSelectElement).value;
    const desc = (form.elements.namedItem('desc') as HTMLTextAreaElement).value;

    if (dateStr) {
      const [year, month, day] = dateStr.split('-');
      addEvent({
        day: parseInt(day),
        month: parseInt(month) - 1,
        year: parseInt(year),
        title: title,
        type: 'diger',
        desc: desc,
        fileName: `Föy No: ${localCaseData?.id} - ${localCaseData?.client}`,
        fileId: localCaseData?.id,
        assignedTo: assignedTo,
        assignedBy: currentUser
      });
      setIsAddingTask(false);
    }
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const modalContent = (
    <div className={styles.overlay} onMouseDown={(e) => { if(e.target === e.currentTarget) onClose(); }} style={{zIndex: 9999}}>
      <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              Föy No: {localCaseData?.type === 'Değer Kaybı' ? 'DK ' : ''}{localCaseData?.id || 1} 
              <span style={{fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: 'var(--primary)', color: 'white', borderRadius: '12px', fontWeight: 600}}>
                {localCaseData?.type || 'Dava'}
              </span>
              {localCaseData?.isArchived && (
                <span style={{fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#f87171', color: 'white', borderRadius: '12px', fontWeight: 600}}>Arşivlendi</span>
              )}
            </h2>
            <p>{localCaseData?.esasNo || '2023/112 Esas'} - {localCaseData?.client || 'Ahmet Yılmaz'} vs {localCaseData?.opponent || 'Vakıfbank'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!localCaseData?.isArchived && (
              <button className={styles.archiveBtn} onClick={() => { alert('Dosya arşivlendi!'); onClose(); }}>Arşivle</button>
            )}
            <button className={styles.closeBtn} style={{ marginLeft: '1rem' }} onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'summary' ? styles.active : ''}`} onClick={() => setActiveTab('summary')}>Özet</button>
          <button className={`${styles.tab} ${activeTab === 'expenses' ? styles.active : ''}`} onClick={() => setActiveTab('expenses')}>Masraflar</button>
          {localCaseData?.type !== 'Değer Kaybı' && (
            <button className={`${styles.tab} ${activeTab === 'hearings' ? styles.active : ''}`} onClick={() => setActiveTab('hearings')}>Duruşmalar</button>
          )}
          <button className={`${styles.tab} ${activeTab === 'tasks' ? styles.active : ''}`} onClick={() => setActiveTab('tasks')}>Görevler</button>
          <button className={`${styles.tab} ${activeTab === 'documents' ? styles.active : ''}`} onClick={() => setActiveTab('documents')}>Evraklar</button>
          {localCaseData?.type === 'Değer Kaybı' && (
             <>
               <button className={`${styles.tab} ${activeTab === 'ikame_arac' ? styles.active : ''}`} onClick={() => setActiveTab('ikame_arac')} style={{color: 'var(--primary)'}}>İkame Araç</button>
               <button className={`${styles.tab} ${activeTab === 'deger_kaybi' ? styles.active : ''}`} onClick={() => setActiveTab('deger_kaybi')} style={{background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)'}}>Dilekçe Üretimi</button>
             </>
          )}
          <button className={`${styles.tab} ${activeTab === 'notes' ? styles.active : ''}`} onClick={() => setActiveTab('notes')}>Notlar</button>
        </div>

        <div className={styles.content}>
          {activeTab === 'summary' && (
            <div className={styles.tabContent}>
              <div className={styles.expenseHeader}>
                <h3>Genel Bilgiler</h3>
                <button className={styles.addBtn} onClick={() => setIsEditingSummary(!isEditingSummary)}>
                  {isEditingSummary ? 'İptal' : 'Düzenle'}
                </button>
              </div>
              
              {isEditingSummary ? (
                <form className={styles.form} onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const updatedData: any = {
                    ...localCaseData,
                    esasNo: (form.elements.namedItem('esasNo') as HTMLInputElement).value,
                    opponent: (form.elements.namedItem('opponent') as HTMLInputElement).value,
                    court: (form.elements.namedItem('court') as HTMLInputElement).value,
                    lawyer: (form.elements.namedItem('lawyer') as HTMLInputElement).value,
                    status: (form.elements.namedItem('status') as HTMLSelectElement).value,
                    kazanc: (form.elements.namedItem('kazanc') as HTMLInputElement)?.value || localCaseData?.kazanc || '',
                    ihtarDate: (form.elements.namedItem('ihtarDate') as HTMLInputElement)?.value || localCaseData?.ihtarDate || ''
                  };

                  if (localCaseData?.type === 'Değer Kaybı') {
                    updatedData.tc = (form.elements.namedItem('tc') as HTMLInputElement)?.value;
                    updatedData.address = (form.elements.namedItem('address') as HTMLInputElement)?.value;
                    updatedData.plate = (form.elements.namedItem('plate') as HTMLInputElement)?.value;
                    updatedData.kazaTarihi = (form.elements.namedItem('kazaTarihi') as HTMLInputElement)?.value;
                    updatedData.kazaYeri = (form.elements.namedItem('kazaYeri') as HTMLInputElement)?.value;
                    updatedData.karsiPlaka = (form.elements.namedItem('karsiPlaka') as HTMLInputElement)?.value;
                    updatedData.karsiSahip = (form.elements.namedItem('karsiSahip') as HTMLInputElement)?.value;
                    updatedData.policeNo = (form.elements.namedItem('policeNo') as HTMLInputElement)?.value;
                  }
                  
                  setLocalCaseData(updatedData);
                  setIsEditingSummary(false);
                  alert('Dosya bilgileri güncellendi!');
                }}>
                  <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem'}}>
                    <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                      <label>Esas No / Aşama</label>
                      <input type="text" name="esasNo" required defaultValue={localCaseData?.esasNo || '2023/112 Esas'} />
                    </div>
                    <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                      <label>Müvekkil</label>
                      <input type="text" name="client" required defaultValue={localCaseData?.client || 'Ahmet Yılmaz'} />
                    </div>
                    <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                      <label>Karşı Taraf</label>
                      <input type="text" name="opponent" required defaultValue={localCaseData?.opponent || 'Vakıfbank'} />
                    </div>
                    <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                      <label>Mahkeme</label>
                      <input type="text" name="court" required defaultValue={localCaseData?.court || 'Belirtilmemiş'} />
                    </div>
                    <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                      <label>Sorumlu Avukat</label>
                      <input type="text" name="lawyer" required defaultValue={localCaseData?.lawyer || 'Av. Canan K.'} />
                    </div>
                    <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                      <label>Dosya Durumu</label>
                      <select name="status" defaultValue={localCaseData?.status || 'Açık'}>
                        {localCaseData?.type === 'Değer Kaybı' ? (
                          <>
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
                          </>
                        ) : (
                          <>
                            <option value="Açık">Açık</option>
                            <option value="Karara Çıktı">Karara Çıktı</option>
                            <option value="İstinafta">İstinafta</option>
                            <option value="Yargıtayda">Yargıtayda</option>
                            <option value="Kapalı">Kapalı</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                      <label>Kazanç (₺)</label>
                      <input type="number" name="kazanc" defaultValue={localCaseData?.kazanc || ''} placeholder="0.00" />
                    </div>
                    {localCaseData?.type === 'Değer Kaybı' && (
                      <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                        <label>İhtar Bitiş (Tahkime Hazırlık) Tarihi</label>
                        <input type="date" name="ihtarDate" defaultValue={localCaseData?.ihtarDate || ''} />
                      </div>
                    )}
                    {localCaseData?.type === 'Değer Kaybı' && (
                      <>
                        <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                          <label>TC Kimlik / VKN</label>
                          <input type="text" name="tc" defaultValue={localCaseData?.tc || ''} placeholder="Kimlik/Vergi No" />
                        </div>
                        <div className={styles.formGroup} style={{flex: '1 1 100%'}}>
                          <label>Adres</label>
                          <input type="text" name="address" defaultValue={localCaseData?.address || ''} placeholder="Açık Adres" />
                        </div>
                        <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                          <label>Müvekkil Araç Plakası</label>
                          <input type="text" name="plate" defaultValue={localCaseData?.plate || ''} placeholder="Örn: 34 ABC 123" />
                        </div>
                        <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                          <label>Kaza Tarihi</label>
                          <input type="date" name="kazaTarihi" defaultValue={localCaseData?.kazaTarihi || ''} />
                        </div>
                        <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                          <label>Kaza Yeri</label>
                          <input type="text" name="kazaYeri" defaultValue={localCaseData?.kazaYeri || ''} placeholder="İl/İlçe" />
                        </div>
                        <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                          <label>Karşı Araç Plakası</label>
                          <input type="text" name="karsiPlaka" defaultValue={localCaseData?.karsiPlaka || ''} placeholder="Karşı Taraf Plaka" />
                        </div>
                        <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                          <label>Karşı Araç Sahibi</label>
                          <input type="text" name="karsiSahip" defaultValue={localCaseData?.karsiSahip || ''} placeholder="Ad Soyad" />
                        </div>
                        <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                          <label>Poliçe Numarası</label>
                          <input type="text" name="policeNo" defaultValue={localCaseData?.policeNo || ''} placeholder="Poliçe No" />
                        </div>
                      </>
                    )}
                  </div>
                  <button type="submit" className={styles.submitBtn}>Kaydet</button>
                </form>
              ) : (
                <div style={{marginTop: '1rem'}}>
                  <p style={{marginBottom: '0.75rem'}}><strong>Sorumlu Avukat:</strong> {localCaseData?.lawyer || 'Av. Canan K.'}</p>
                  <p style={{marginBottom: '0.75rem'}}><strong>Mahkeme:</strong> {localCaseData?.court || 'Belirtilmemiş'}</p>
                  <p style={{marginBottom: '0.75rem'}}><strong>Karşı Taraf:</strong> {localCaseData?.opponent || 'Vakıfbank'}</p>
                  <p style={{marginBottom: '0.75rem'}}><strong>Müvekkil:</strong> {localCaseData?.client || 'Ahmet Yılmaz'}</p>
                  <p style={{marginBottom: '0.75rem'}}><strong>Dosya Durumu:</strong> <span style={{color: 'var(--primary)', fontWeight: 600}}>{localCaseData?.status || 'Açık'}</span></p>
                  {localCaseData?.kazanc && (
                    <p style={{marginBottom: '0.75rem'}}><strong>Kazanılan Vekalet Ücreti / Kazanç:</strong> <span style={{color: 'var(--success)', fontWeight: 600}}>₺ {Number(localCaseData.kazanc).toLocaleString('tr-TR', {minimumFractionDigits: 2})}</span></p>
                  )}

                  {localCaseData?.type === 'Değer Kaybı' && (
                    <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)'}}>
                      <h4 style={{marginBottom: '1rem', display: 'flex', justifyContent: 'space-between'}}>
                        Değer Kaybı Detayları
                        {localCaseData?.ihtarDate && (
                           <span style={{fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '12px'}}>
                             İhtar Bitiş: {new Date(localCaseData.ihtarDate).toLocaleDateString('tr-TR')}
                           </span>
                        )}
                      </h4>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem'}}>
                        <p><strong>TC/VKN:</strong> {localCaseData?.tc || 'Belirtilmemiş'}</p>
                        <p><strong>Müvekkil Plaka:</strong> {localCaseData?.plate || 'Belirtilmemiş'}</p>
                        <p><strong>Kaza Tarihi:</strong> {localCaseData?.kazaTarihi || 'Belirtilmemiş'}</p>
                        <p><strong>Kaza Yeri:</strong> {localCaseData?.kazaYeri || 'Belirtilmemiş'}</p>
                        <p><strong>Karşı Plaka:</strong> {localCaseData?.karsiPlaka || 'Belirtilmemiş'}</p>
                        <p><strong>Karşı Sahibi:</strong> {localCaseData?.karsiSahip || 'Belirtilmemiş'}</p>
                        <p><strong>Poliçe No:</strong> {localCaseData?.policeNo || 'Belirtilmemiş'}</p>
                        <p style={{gridColumn: '1 / span 2'}}><strong>Adres:</strong> {localCaseData?.address || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className={styles.tabContent}>
              <div className={styles.expenseHeader}>
                <h3>Masraf Listesi</h3>
                <button className={styles.addBtn} onClick={() => setIsAddingExpense(!isAddingExpense)}>
                  {isAddingExpense ? 'İptal' : '+ Yeni Masraf'}
                </button>
              </div>

              {isAddingExpense && (
                <form className={styles.form} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }} onSubmit={handleAddExpense}>
                  <div className={styles.formGroup}>
                    <label>Masraf Türü</label>
                    <select name="desc" required>
                      <option value="">Seçiniz...</option>
                      <option value="Bilirkişi Ücreti">Bilirkişi Ücreti</option>
                      <option value="Başvuru Harcı">Başvuru Harcı</option>
                      <option value="Islah Harcı">Islah Harcı</option>
                      <option value="Komisyon">Komisyon</option>
                      <option value="Posta ve Tebligat Gideri">Posta ve Tebligat Gideri</option>
                      <option value="Vekalet Harcı">Vekalet Harcı</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tutar (₺)</label>
                    <input type="number" name="amount" required step="0.01" placeholder="1500.00" />
                  </div>
                  <button type="submit" className={styles.submitBtn} style={{ marginTop: '0.5rem' }}>Kaydet</button>
                </form>
              )}

              <table className={styles.innerTable}>
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Açıklama</th>
                    <th>Tutar (₺)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id}>
                      <td>{e.date}</td>
                      <td>{e.desc}</td>
                      <td>{e.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className={styles.totalRow}>
                     <td colSpan={2}><strong>Toplam Masraf</strong></td>
                     <td><strong>{totalExpense.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'hearings' && localCaseData?.type !== 'Değer Kaybı' && (
            <div className={styles.tabContent}>
              <div className={styles.expenseHeader}>
                <h3>Duruşmalar</h3>
                <button className={styles.addBtn} onClick={() => setIsAddingHearing(!isAddingHearing)}>
                  {isAddingHearing ? 'İptal' : '+ Duruşma Ekle'}
                </button>
              </div>

              {isAddingHearing && (
                <form className={styles.form} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }} onSubmit={handleAddHearing}>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <div className={styles.formGroup} style={{flex: 1}}>
                      <label>Tarih</label>
                      <input type="date" name="date" required />
                    </div>
                    <div className={styles.formGroup} style={{flex: 1}}>
                      <label>Saat</label>
                      <input type="time" name="time" required />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Mahkeme Bilgisi</label>
                    <input type="text" name="court" required placeholder="Örn: İstanbul 4. Asliye Hukuk" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Duruşma Notu</label>
                    <textarea name="note" rows={2} placeholder="Örn: Mazeret verilecek..."></textarea>
                  </div>
                  <button type="submit" className={styles.submitBtn} style={{ marginTop: '0.5rem' }}>Kaydet</button>
                </form>
              )}

              <table className={styles.innerTable}>
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Saat</th>
                    <th>Mahkeme</th>
                    <th>Not</th>
                  </tr>
                </thead>
                <tbody>
                  {hearings.map(h => (
                    <tr key={h.id}>
                      <td>{h.date}</td>
                      <td>{h.time}</td>
                      <td>{h.court}</td>
                      <td>{h.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className={styles.tabContent}>
              <div className={styles.expenseHeader}>
                <h3>Bu Dosyaya Bağlı Görevler</h3>
                <button className={styles.addBtn} onClick={() => setIsAddingTask(!isAddingTask)}>
                  {isAddingTask ? 'İptal' : '+ Yeni Görev Ekle'}
                </button>
              </div>
              <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '-0.5rem', marginBottom: '1rem'}}>
                Takvim üzerinden veya doğrudan buradan dosyaya atanmış tüm görevler.
              </p>

              {isAddingTask && (
                <form className={styles.form} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px solid var(--card-border)' }} onSubmit={handleAddFileTask}>
                  <div className={styles.formGroup}>
                    <label>Görev Adı</label>
                    <input type="text" name="title" required placeholder="Örn: İhtarname Hazırlanacak" />
                  </div>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <div className={styles.formGroup} style={{flex: 1}}>
                      <label>Son Tarih</label>
                      <input type="date" name="date" required />
                    </div>
                    <div className={styles.formGroup} style={{flex: 1}}>
                      <label>Sorumlu / Atanan Kişi</label>
                      <select name="assignedTo" required defaultValue="Admin Kullanıcı">
                        <option value="Admin Kullanıcı">Admin Kullanıcı</option>
                        <option value="Av. Canan K.">Av. Canan K.</option>
                        <option value="Av. Burak D.">Av. Burak D.</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Açıklama</label>
                    <textarea name="desc" rows={2} placeholder="Görev detayları..."></textarea>
                  </div>
                  <button type="submit" className={styles.submitBtn} style={{ marginTop: '0.5rem' }}>Görevi Kaydet</button>
                </form>
              )}

              <table className={styles.innerTable}>
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Görev Adı</th>
                    <th>Atayan Kişi</th>
                    <th>Sorumlu Kişi</th>
                    <th>Açıklama</th>
                    <th>Durum</th>
                    <th style={{textAlign: 'center'}}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {events
                    .filter(e => String(e.fileId) === String(localCaseData?.id))
                    .sort((a, b) => b.id - a.id)
                    .map(evt => (
                    <tr key={evt.id} style={{ opacity: evt.isCompleted ? 0.6 : 1, textDecoration: evt.isCompleted ? 'line-through' : 'none' }}>
                      <td>{evt.day}.{evt.month + 1}.{evt.year}</td>
                      <td style={{fontWeight: 600, color: 'var(--primary)'}}>{evt.title}</td>
                      <td>{evt.assignedBy || 'Sistem'}</td>
                      <td>{evt.assignedTo || localCaseData?.lawyer || 'Atanmadı'}</td>
                      <td>{evt.desc || '-'}</td>
                      <td>
                        {evt.isCompleted ? (
                           <span style={{color: 'var(--success)', fontWeight: 600}}>Tamamlandı ({evt.completedBy})</span>
                        ) : (
                           <span style={{color: 'var(--warning)', fontWeight: 600}}>⏳ Bekliyor</span>
                        )}
                      </td>
                      <td style={{textAlign: 'center'}}>
                         <button 
                           onClick={(e) => { 
                             e.stopPropagation(); 
                             if (evt.isCompleted) {
                               updateEvent(evt.id, { isCompleted: false, completedBy: null });
                             } else {
                               updateEvent(evt.id, { isCompleted: true, completedBy: currentUser }); 
                             }
                           }} 
                           style={{
                             background: evt.isCompleted ? 'var(--success)' : 'transparent', 
                             color: evt.isCompleted ? 'white' : 'transparent', 
                             border: evt.isCompleted ? '2px solid var(--success)' : '2px solid #cbd5e1', 
                             borderRadius: '6px', 
                             width: '32px', 
                             height: '32px', 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center', 
                             cursor: 'pointer', 
                             fontWeight: 'bold', 
                             fontSize: '16px',
                             margin: '0 auto',
                             transition: 'all 0.2s ease'
                           }}
                           title={evt.isCompleted ? "Geri Al (Bekliyor İşaretle)" : "Görevi Tamamla"}
                           onMouseEnter={(e) => {
                             if (!evt.isCompleted) {
                               e.currentTarget.style.borderColor = 'var(--success)';
                               e.currentTarget.style.color = 'rgba(16, 185, 129, 0.3)'; // faint tick on hover
                             } else {
                               e.currentTarget.style.background = '#059669';
                             }
                           }}
                           onMouseLeave={(e) => {
                             if (!evt.isCompleted) {
                               e.currentTarget.style.borderColor = '#cbd5e1';
                               e.currentTarget.style.color = 'transparent';
                             } else {
                               e.currentTarget.style.background = 'var(--success)';
                             }
                           }}
                         >
                           ✓
                         </button>
                      </td>
                    </tr>
                  ))}
                  {events.filter(e => String(e.fileId) === String(localCaseData?.id)).length === 0 && (
                    <tr>
                      <td colSpan={8} style={{textAlign: 'center', padding: '1.5rem'}}>Henüz bu dosyaya görev atanmamış.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'notes' && (
            <div className={styles.tabContent}>
              <div className={styles.expenseHeader}>
                <h3>Dosya Notları</h3>
                <button className={styles.addBtn} onClick={() => {
                  if (isEditingNotes) {
                    if (localCaseData?.id) {
                      localStorage.setItem(`caseNotes_${localCaseData.id}`, notes);
                    }
                    alert('Notlar başarıyla kaydedildi!');
                  }
                  setIsEditingNotes(!isEditingNotes);
                }}>
                  {isEditingNotes ? 'Kaydet' : 'Düzenle'}
                </button>
              </div>
              <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', marginTop: '-0.5rem'}}>
                Dosyaya ilişkin kişisel notlarınızı, duruşma öncesi hatırlatmalarınızı veya stratejilerinizi buraya ekleyebilirsiniz.
              </p>
              
              {isEditingNotes ? (
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  style={{width: '100%', minHeight: '200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--primary)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical'}}
                  placeholder="Notlarınızı buraya yazın..."
                  autoFocus
                />
              ) : (
                <div 
                  onClick={() => setIsEditingNotes(true)}
                  style={{width: '100%', minHeight: '200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)', color: notes ? 'var(--foreground)' : '#94a3b8', fontSize: '0.95rem', whiteSpace: 'pre-wrap', cursor: 'text'}}
                >
                  {notes || 'Dosyaya dair not bulunmuyor. Düzenlemek için tıklayın...'}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className={styles.tabContent}>
              <div className={styles.expenseHeader}>
                <h3>Evraklar</h3>
                <div style={{position: 'relative'}}>
                   <button className={styles.addBtn}>+ Evrak Yükle</button>
                   <input 
                      type="file" 
                      multiple 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.udf"
                      onChange={handleFileUpload}
                      style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'}} 
                   />
                </div>
              </div>
              <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '-0.5rem'}}>Desteklenen formatlar: PDF, Word, JPEG, PNG, UYAP UDF.</p>

              <table className={styles.innerTable}>
                <thead>
                  <tr>
                    <th>Dosya Adı</th>
                    <th>Yüklenme Tarihi</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(d => (
                    <tr key={d.id}>
                      <td>📄 {d.name}</td>
                      <td>{d.date}</td>
                      <td>
                        <button style={{background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600}}>İndir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'deger_kaybi' && (
            <div className={styles.tabContent}>
              <div className={styles.expenseHeader}>
                <h3>Değer Kaybı Otomasyonu</h3>
              </div>
              <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', marginTop: '-0.5rem'}}>
                Sigorta şirketine başvuru dilekçesini otomatik olarak oluşturmak için aşağıdaki gerekli verileri doldurunuz.
              </p>
              
              <form className={styles.form} onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const plaka = (form.elements.namedItem('plaka') as HTMLInputElement).value;
                const tarih = (form.elements.namedItem('tarih') as HTMLInputElement).value;
                const police = (form.elements.namedItem('police') as HTMLInputElement).value;
                
                // Şablon İçeriği Oluştur
                const templateContent = `
                  ${localCaseData?.opponent || 'SİGORTA A.Ş.'} GENEL MÜDÜRLÜĞÜNE
                  
                  Konu: Değer Kaybı Tazminatı Başvurusu
                  
                  Müvekkilimiz ${localCaseData?.client || 'Müvekkil'} adına, tarafınızca sigortalanan ${police} numaralı poliçe sahibinin kusuruyla meydana gelen ${tarih} tarihli trafik kazasında, müvekkile ait ${plaka} plakalı araçta meydana gelen değer kaybının tazmini talebimizdir.
                  
                  Gereğinin yapılmasını vekaleten arz ve talep ederiz.
                  
                  Av. ${localCaseData?.lawyer || 'Avukat'}
                  (Akademi Hukuk Otomasyonu ile Üretilmiştir)
                `;
                
                // Belgeyi indir (Blob URL)
                const blob = new Blob([templateContent], { type: 'application/msword' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Basvuru_Dilekcesi_${plaka}.doc`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Evraklara Ekle
                setDocuments([{ id: Date.now(), name: `Basvuru_Dilekcesi_${plaka}.doc`, date: new Date().toLocaleDateString('tr-TR') }, ...documents]);
                alert("Dilekçe başarıyla üretildi, indirildi ve Evraklar sekmesine kaydedildi.");
              }}>
                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                   <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                     <label>Müvekkil Araç Plakası</label>
                     <input type="text" name="plaka" required placeholder="34 ABC 123" />
                   </div>
                   <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                     <label>Kaza Tarihi</label>
                     <input type="date" name="tarih" required />
                   </div>
                   <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                     <label>Karşı Taraf Poliçe No</label>
                     <input type="text" name="police" required placeholder="123456789" />
                   </div>
                   <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                     <label>Tahmini Talep Tutarı (₺)</label>
                     <input type="number" name="tutar" placeholder="Örn: 20000" />
                   </div>
                </div>
                <button type="submit" className={styles.submitBtn} style={{background: 'var(--primary)'}}>
                  📄 Sigortaya Başvuru Dilekçesi Hazırla
                </button>
              </form>
            </div>
          )}

          {activeTab === 'ikame_arac' && localCaseData?.type === 'Değer Kaybı' && (
            <div className={styles.tabContent}>
              <div className={styles.expenseHeader}>
                <h3>İkame Araç Süreci</h3>
                {localCaseData?.ikame && (
                  <button className={styles.addBtn} onClick={() => setIsEditingIkame(!isEditingIkame)}>
                    {isEditingIkame ? 'İptal' : 'Düzenle'}
                  </button>
                )}
              </div>
              <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', marginTop: '-0.5rem'}}>
                İkame araç başvurusu ve bedeli ile ilgili bilgileri buradan takip edebilirsiniz.
              </p>
              
              {isEditingIkame ? (
                <form className={styles.form} onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const basvuru = (form.elements.namedItem('basvuru') as HTMLSelectElement).value;
                  const gun = (form.elements.namedItem('gun') as HTMLInputElement).value;
                  const tutar = (form.elements.namedItem('tutar') as HTMLInputElement).value;
                  const not = (form.elements.namedItem('not') as HTMLInputElement).value;
                  const durum = form.elements.namedItem('durum') ? (form.elements.namedItem('durum') as HTMLSelectElement).value : 'Beklemede';
                  setLocalCaseData({ ...localCaseData, ikame: { basvuru, gun, tutar, not, durum } });
                  setIsEditingIkame(false);
                  alert("İkame araç bilgileri kaydedildi!");
                }}>
                  <div className={styles.formGroup}>
                    <label>İkame Araç Başvurusu Yapıldı mı?</label>
                    <select name="basvuru" required defaultValue={localCaseData?.ikame?.basvuru || 'hayir'} onChange={(e) => {
                      const isYes = e.target.value === 'evet';
                      const detailsDiv = document.getElementById('ikameDetails');
                      if (detailsDiv) detailsDiv.style.display = isYes ? 'flex' : 'none';
                    }}>
                      <option value="hayir">Hayır, henüz yapılmadı</option>
                      <option value="evet">Evet, yapıldı</option>
                    </select>
                  </div>
                  
                  <div id="ikameDetails" style={{display: localCaseData?.ikame?.basvuru === 'evet' ? 'flex' : 'none', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem'}}>
                     <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                       <label>Kaç Gün İkame Araç Verildi/Talep Edildi?</label>
                       <input type="number" name="gun" defaultValue={localCaseData?.ikame?.gun} placeholder="Örn: 7" />
                     </div>
                     <div className={styles.formGroup} style={{flex: '1 1 45%'}}>
                       <label>İkame Araç Bedeli (₺)</label>
                       <input type="number" name="tutar" defaultValue={localCaseData?.ikame?.tutar} placeholder="Örn: 10500" />
                     </div>
                     <div className={styles.formGroup} style={{flex: '1 1 100%'}}>
                       <label>Notlar</label>
                       <input type="text" name="not" defaultValue={localCaseData?.ikame?.not} placeholder="Sigorta 3 gün verdi, 4 gün tahkimden talep edilecek..." />
                     </div>
                     <div className={styles.formGroup} style={{flex: '1 1 100%'}}>
                       <label>Dosya / Tahsilat Durumu</label>
                       <select name="durum" defaultValue={localCaseData?.ikame?.durum || 'Beklemede'}>
                         <option value="Beklemede">⏳ Beklemede / Süreç Devam Ediyor</option>
                         <option value="Tahsil Edildi">✅ Tahsil Edildi</option>
                         <option value="Tahsil Edilemedi">❌ Tahsil Edilemedi / Red</option>
                       </select>
                     </div>
                  </div>

                  <button type="submit" className={styles.submitBtn} style={{marginTop: '1.5rem'}}>
                    Bilgileri Kaydet
                  </button>
                </form>
              ) : (
                <div style={{marginTop: '1rem', background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--card-border)'}}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem'}}>
                    <p><strong>Başvuru Durumu:</strong> <span style={{color: localCaseData?.ikame?.basvuru === 'evet' ? 'var(--success)' : 'var(--warning)', fontWeight: 600}}>{localCaseData?.ikame?.basvuru === 'evet' ? 'Evet, yapıldı' : 'Hayır, yapılmadı'}</span></p>
                    {localCaseData?.ikame?.basvuru === 'evet' && (
                      <>
                        <p><strong>Talep Edilen Gün:</strong> {localCaseData.ikame.gun || '-'} Gün</p>
                        <p><strong>İkame Araç Bedeli:</strong> {localCaseData.ikame.tutar ? `₺ ${Number(localCaseData.ikame.tutar).toLocaleString('tr-TR', {minimumFractionDigits: 2})}` : '-'}</p>
                        <p><strong>Tahsilat Durumu:</strong> <span style={{color: localCaseData.ikame.durum === 'Tahsil Edildi' ? 'var(--success)' : (localCaseData.ikame.durum === 'Tahsil Edilemedi' ? 'var(--danger)' : 'var(--warning)'), fontWeight: 600}}>{localCaseData.ikame.durum || 'Beklemede'}</span></p>
                        <p style={{gridColumn: '1 / span 2'}}><strong>Notlar:</strong> {localCaseData.ikame.not || '-'}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
