'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './LiveSearch.module.css';
import CaseModal from './CaseModal';

export default function LiveSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Sadece arama sonuçlarını kapat
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mockCases = [
    { id: 1, type: 'Dava', client: 'Ahmet Yılmaz', opponent: 'Vakıfbank' },
    { id: 2, type: 'İcra', client: 'Mehmet Demir', opponent: 'Ayşe Kaya' },
    { id: 6, type: 'Değer Kaybı', client: 'Ali Veli', opponent: 'Anadolu Sigorta A.Ş.' },
    { id: 11, type: 'Değer Kaybı', client: 'Ayşe Demir', opponent: 'Axa Sigorta A.Ş.' },
    { id: 14, type: 'Değer Kaybı', client: 'Mehmet Yılmaz', opponent: 'Sompo Sigorta A.Ş.' },
    { id: 15, type: 'Değer Kaybı', client: 'Fatma Yıldız', opponent: 'Allianz Sigorta' },
    { id: 16, type: 'Değer Kaybı', client: 'Caner Öz', opponent: 'Mapfre Sigorta' },
    { id: 22, type: 'Danışmanlık', client: 'Vakıfbank A.Ş.', opponent: '-' }
  ];

  const results = mockCases.filter(c => 
    c.client.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (e: React.MouseEvent, selectedCase: any) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveCase(selectedCase);
    setIsOpen(false);
    setModalOpen(true);
    setQuery('');
  };

  const [activeCase, setActiveCase] = useState<any>(null);

  return (
    <>
      <div className={styles.searchWrapper} ref={searchRef}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => {
            if (query.length > 0) setIsOpen(true);
          }}
          placeholder="Sadece müvekkil adına göre arama yapın... (Değer Kaybı dahil)" 
          className={styles.searchInput}
        />

        {isOpen && query.length > 0 && (
          <div className={`${styles.dropdown} glass`}>
            <ul className={styles.resultsList}>
              {results.length > 0 ? results.map(c => (
                <li key={c.id} className={styles.resultItem} onMouseDown={(e) => handleSelect(e, c)}>
                  <div className={styles.resultIcon}>📄</div>
                  <div className={styles.resultInfo}>
                    <span className={styles.resultTitle}>{c.client} (Föy No: {c.type === 'Değer Kaybı' ? 'DK ' : ''}{c.id})</span>
                    <span className={styles.resultSub}>Karşı Taraf: {c.opponent} - {c.type}</span>
                  </div>
                </li>
              )) : (
                <li className={styles.resultItem} style={{justifyContent: 'center', color: '#64748b'}}>
                  Sonuç bulunamadı.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {modalOpen && activeCase && (
        <CaseModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setActiveCase(null); }} caseData={activeCase} />
      )}
    </>
  );
}
