'use client';

import React, { createContext, useContext, useState } from 'react';

type AppContextType = {
  events: any[];
  addEvent: (event: any) => void;
  updateEvent: (id: number, updatedFields: any) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState('Admin Kullanıcı');
  
  const [events, setEvents] = useState([
    { id: 1, day: 23, month: 6, year: 2023, title: 'Duruşma (14:00)', fileName: 'Föy No: 1 - Ahmet Yılmaz', fileId: '1', type: 'durusma', desc: 'Tanık dinlenecek', isCompleted: false, assignedTo: 'Av. Canan K.' },
    { id: 2, day: 25, month: 6, year: 2023, title: 'Duruşma (09:30)', fileName: 'Föy No: 2 - Mehmet Demir', fileId: '2', type: 'durusma', desc: 'Karar duruşması', isCompleted: false, assignedTo: 'Admin Kullanıcı' },
    { id: 3, day: 26, month: 6, year: 2023, title: 'İhtar Son Günü', fileName: 'Föy No: 3 - Vakıfbank A.Ş.', fileId: '3', type: 'ihtar', desc: 'İhtarname cevabı verilecek', isCompleted: false, assignedTo: 'Admin Kullanıcı' }
  ]);

  const addEvent = (event: any) => {
    setEvents([...events, { ...event, id: Date.now(), isCompleted: false }]);
  };

  const updateEvent = (id: number, updatedFields: any) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  };

  return (
    <AppContext.Provider value={{ events, addEvent, updateEvent, currentUser, setCurrentUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
