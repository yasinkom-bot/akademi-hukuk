'use client';
import { useState } from 'react';
import { useAppContext } from '../app/context/AppContext';
import CaseModal from './CaseModal';

export default function TaskSnackbar() {
  const { events, currentUser, updateEvent } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCase, setActiveCase] = useState<any>(null);
  
  const pendingTasks = events.filter(e => e.assignedTo === currentUser && !e.isCompleted);

  if (pendingTasks.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: isExpanded ? '20px' : '20px',
      right: '20px',
      width: '350px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '12px',
      boxShadow: '0 -5px 25px rgba(0,0,0,0.1)',
      zIndex: 9999,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '1rem', 
          background: 'var(--primary)', 
          color: 'white', 
          fontWeight: 600, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <span>Bekleyen İşlerim ({pendingTasks.length})</span>
        <span style={{transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s'}}>
          ▲
        </span>
      </div>
      
      <div style={{
        maxHeight: isExpanded ? '400px' : '0px',
        overflowY: 'auto',
        transition: 'max-height 0.3s ease',
        background: 'var(--card-bg)'
      }}>
        {pendingTasks.map(t => (
          <div key={t.id} style={{
            padding: '1rem', 
            borderBottom: '1px solid var(--card-border)', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div 
              style={{display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, cursor: 'pointer'}} 
              onClick={() => setActiveCase({ id: t.fileId, type: 'Dava', client: t.fileName?.split(' - ')[1] || 'Bilinmeyen Müvekkil', fileName: t.fileName, status: 'Açık' })}
              title="Dosya görevlerine gitmek için tıklayın"
            >
              <span style={{fontWeight: 600, color: 'var(--foreground)', fontSize: '0.95rem'}}>{t.title}</span>
              <span style={{fontSize: '0.8rem', color: '#64748b'}}>{t.fileName || '-'}</span>
              <span style={{fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 500}}>Bitiş: {t.day}.{t.month + 1}.{t.year}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                updateEvent(t.id, { isCompleted: true, completedBy: currentUser });
              }}
              style={{
                background: 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.8rem',
                flexShrink: 0
              }}
              title="Görevi Tamamla"
            >
              ✓ Tamamla
            </button>
          </div>
        ))}
      </div>

      {activeCase && (
        <CaseModal 
          isOpen={true}
          onClose={() => setActiveCase(null)}
          caseData={activeCase}
          initialTab="tasks"
        />
      )}
    </div>
  );
}
