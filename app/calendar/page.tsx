'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { useAppContext } from '../context/AppContext';

export default function CalendarPage() {
  const { events, addEvent, updateEvent, currentUser } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isFileDropdownOpen, setIsFileDropdownOpen] = useState(false);

  const availableCases = [
    { id: '1', client: 'Ahmet Yılmaz', court: 'İstanbul 4. Asliye Hukuk', type: 'Dava' },
    { id: '2', client: 'Mehmet Demir', court: 'İstanbul 1. İcra Dairesi', type: 'İcra' },
    { id: '3', client: 'Vakıfbank A.Ş.', court: 'Danışmanlık', type: 'Danışmanlık' },
    { id: '101', client: 'Mehmet Çelik', court: 'Sigorta Tahkim Komisyonu', type: 'Değer Kaybı' }
  ];

  const filteredCases = availableCases.filter(c => 
    c.client.toLowerCase().includes(fileSearchTerm.toLowerCase()) || 
    c.id.includes(fileSearchTerm) ||
    c.type.toLowerCase().includes(fileSearchTerm.toLowerCase())
  );

  const openAddEventModal = (day: number) => {
    setSelectedDate(day);
    setFileSearchTerm('');
    setSelectedFile(null);
    setIsFileDropdownOpen(false);
  };
  
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentDate.getMonth(), 1).getDay();
  const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const nextMonth = () => setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));

  const handleDayClick = (day: number) => {
    setSelectedDate(day);
    setEditingEvent(null);
  };

  const handleEventClick = (e: React.MouseEvent, evt: any) => {
    e.stopPropagation();
    setEditingEvent(evt);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const typeStr = (form.elements.namedItem('type') as HTMLSelectElement).value;
    const time = (form.elements.namedItem('time') as HTMLInputElement).value;
    const desc = (form.elements.namedItem('desc') as HTMLTextAreaElement).value;
    const assignedTo = (form.elements.namedItem('assignedTo') as HTMLSelectElement).value;
    
    if (!selectedFile) {
      alert("Lütfen listeden ilgili dosyayı arayarak seçin.");
      return;
    }
    
    const fileName = `Föy No ${selectedFile.id}: ${selectedFile.client} (${selectedFile.type})`;
    const fileId = selectedFile.id;
    
    let label = `${typeStr}`;
    if (time) label += ` (${time})`;

    let typeCat = 'diger';
    if (typeStr.includes('Duruşma')) typeCat = 'durusma';
    if (typeStr.includes('İhtar')) typeCat = 'ihtar';

    if (selectedDate !== null) {
       addEvent({ day: selectedDate, month: currentDate.getMonth(), year: currentYear, title: label, type: typeCat, desc, fileName, fileId, assignedTo, assignedBy: currentUser });
    }
    setSelectedDate(null);
  };

  const handleCompleteEvent = () => {
    if (editingEvent) {
      updateEvent(editingEvent.id, { isCompleted: true, completedBy: 'Admin' });
      setEditingEvent(null);
    }
  };

  return (
    <div className={styles.calendarPage}>
      <header className={styles.header}>
        <h1>Takvim ve Ajanda</h1>
        <p>Yaklaşan duruşmalar, ara kararlar ve ihtarlar.</p>
      </header>

      <div className={`${styles.calendarContainer} glass`}>
        <div className={styles.monthHeader}>
          <button className={styles.navBtn} onClick={prevMonth}>&lt;</button>
          <h2>{currentMonthName} {currentYear}</h2>
          <button className={styles.navBtn} onClick={nextMonth}>&gt;</button>
        </div>

        <div className={styles.grid}>
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
            <div key={d} className={styles.dayName}>{d}</div>
          ))}
          {Array.from({length: offset}).map((_, i) => (
            <div key={`empty-${i}`} className={styles.dayCell}></div>
          ))}
          
          {Array.from({length: daysInMonth}).map((_, i) => {
            const day = i + 1;
            const dayEvents = events.filter(e => e.day === day && e.month === currentDate.getMonth() && e.year === currentYear);
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
            return (
              <div 
                key={day} 
                className={`${styles.dayCell} ${styles.clickable} ${isToday ? styles.today : ''}`} 
                onClick={() => openAddEventModal(day)}
              >
                <span className={styles.dateNumber}>{day}</span>
                {dayEvents.map((evt) => (
                  <div 
                    key={evt.id} 
                    className={styles.event} 
                    title={`${evt.title}\n${evt.desc || ''}\nDurum: ${evt.isCompleted ? 'Tamamlandı' : 'Bekliyor'}`}
                    style={{
                      background: evt.type === 'ihtar' ? 'var(--warning)' : 'var(--primary)',
                      textDecoration: evt.isCompleted ? 'line-through' : 'none',
                      opacity: evt.isCompleted ? 0.6 : 1
                    }}
                    onClick={(e) => handleEventClick(e, evt)}
                  >
                    {evt.title} {evt.isCompleted && `(✓ ${evt.completedBy})`}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Event Modal */}
      {selectedDate !== null && (
        <div className={styles.overlay} onMouseDown={(e) => { if(e.target === e.currentTarget) setSelectedDate(null); }}>
          <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedDate} {currentMonthName} {currentYear} - Görev Ata</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedDate(null)}>&times;</button>
            </div>
            <div className={styles.modalContent}>
              <form className={styles.form} onSubmit={handleAddEvent}>
                 <div className={styles.formGroup} style={{position: 'relative'}}>
                   <label>İlgili Dosya (Live Search)</label>
                   {!selectedFile ? (
                     <>
                       <input 
                         type="text" 
                         placeholder="Dosya no, müvekkil veya tür yazın..." 
                         value={fileSearchTerm}
                         onChange={(e) => {
                           setFileSearchTerm(e.target.value);
                           setIsFileDropdownOpen(true);
                         }}
                         onFocus={() => setIsFileDropdownOpen(true)}
                         autoComplete="off"
                       />
                       {isFileDropdownOpen && (
                         <div style={{position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '4px'}}>
                           {filteredCases.map(c => (
                             <div 
                               key={c.id} 
                               style={{padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--card-border)'}}
                               onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-light)'}
                               onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                               onClick={() => {
                                 setSelectedFile(c);
                                 setFileSearchTerm('');
                                 setIsFileDropdownOpen(false);
                               }}
                             >
                               <strong>Föy {c.id}</strong> - {c.client} <span style={{fontSize: '0.8rem', color: 'var(--primary)', marginLeft: '0.5rem'}}>{c.type}</span>
                             </div>
                           ))}
                           {filteredCases.length === 0 && (
                             <div style={{padding: '0.75rem 1rem', color: '#64748b'}}>Sonuç bulunamadı.</div>
                           )}
                         </div>
                       )}
                     </>
                   ) : (
                     <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid var(--primary)', borderRadius: '8px'}}>
                       <span><strong>Föy {selectedFile.id}:</strong> {selectedFile.client} ({selectedFile.type})</span>
                       <button type="button" onClick={() => setSelectedFile(null)} style={{background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 'bold'}}>&times; Sil</button>
                     </div>
                   )}
                 </div>
                 <div className={styles.formGroup}>
                   <label>Görev / İşlem Tipi</label>
                   <select required name="type">
                     <option value="Duruşma">Duruşma</option>
                     <option value="Ara Karar">Ara Karar İfası</option>
                     <option value="İhtar">İhtar Süresi</option>
                     <option value="Diğer">Diğer</option>
                   </select>
                 </div>
                 <div className={styles.formGroup}>
                   <label>Sorumlu / Atanan Kişi</label>
                   <select required name="assignedTo" defaultValue="Admin Kullanıcı">
                     <option value="Admin Kullanıcı">Admin Kullanıcı</option>
                     <option value="Av. Canan K.">Av. Canan K.</option>
                     <option value="Av. Burak D.">Av. Burak D.</option>
                   </select>
                 </div>
                 <div className={styles.formGroup}>
                   <label>Saat</label>
                   <input type="time" name="time" />
                 </div>
                 <div className={styles.formGroup}>
                   <label>Açıklama</label>
                   <textarea name="desc" rows={3} placeholder="Detaylar..."></textarea>
                 </div>
                 <button type="submit" className={styles.submitBtn}>Görev Ekle</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Complete Event Modal */}
      {editingEvent !== null && (
        <div className={styles.overlay} onMouseDown={(e) => { if(e.target === e.currentTarget) setEditingEvent(null); }}>
          <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Görevi İncele</h2>
              <button className={styles.closeBtn} onClick={() => setEditingEvent(null)}>&times;</button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
                <label>Görev Bilgisi</label>
                <div style={{marginTop: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--card-border)'}}>
                  <p><strong>İlgili Dosya:</strong> {editingEvent.fileName || '-'}</p>
                  <p style={{marginTop: '0.5rem'}}><strong>Sorumlu Kişi:</strong> {editingEvent.assignedTo || 'Belirtilmemiş'}</p>
                  <p style={{marginTop: '0.5rem'}}><strong>Açıklama/Not:</strong> {editingEvent.desc || '-'}</p>
                </div>
              </div>
              
              {!editingEvent.isCompleted ? (
                <button type="button" className={styles.submitBtn} style={{background: 'var(--success)'}} onClick={handleCompleteEvent}>
                  ✓ Tamamlandı Olarak İşaretle
                </button>
              ) : (
                <div style={{padding: '1rem', background: 'rgba(74, 222, 128, 0.1)', color: 'var(--success)', borderRadius: '8px', fontWeight: 600, textAlign: 'center'}}>
                  Bu görev {editingEvent.completedBy} tarafından tamamlandı.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
