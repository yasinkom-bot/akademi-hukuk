'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo} style={{marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0'}}>
        <Link href="/" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', textDecoration: 'none'}}>
          {/* Özel Akademi Hukuk Logosu (Şeffaf Arkaplan, Vektörel) */}
          <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Arkaplan Şeffaf (Hiçbir rect veya fill yok) */}
            
            {/* Adalet Terazisi ve A harfi sentezi (Modern) */}
            <path d="M60 15L20 45H100L60 15Z" fill="var(--primary)" fillOpacity="0.1"/>
            <path d="M60 15L20 45H100L60 15Z" stroke="var(--primary)" strokeWidth="4" strokeLinejoin="round"/>
            
            {/* Sütunlar */}
            <rect x="35" y="45" width="8" height="45" rx="4" fill="var(--foreground)" fillOpacity="0.8"/>
            <rect x="56" y="45" width="8" height="45" rx="4" fill="var(--primary)"/>
            <rect x="77" y="45" width="8" height="45" rx="4" fill="var(--foreground)" fillOpacity="0.8"/>
            
            {/* Alt Kaide */}
            <path d="M25 90H95V98C95 100.209 93.2091 102 91 102H29C26.7909 102 25 100.209 25 98V90Z" fill="var(--primary)"/>
            
            {/* Üstteki Denge/Terazi Noktası */}
            <circle cx="60" cy="45" r="5" fill="var(--background)" stroke="var(--primary)" strokeWidth="3"/>
          </svg>
          
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1'}}>
            <span style={{fontSize: '1.8rem', fontWeight: 900, letterSpacing: '1px', color: 'var(--foreground)'}}>
              AKADEMİ
            </span>
            <span style={{fontSize: '1.4rem', fontWeight: 400, letterSpacing: '4px', color: 'var(--primary)'}}>
              HUKUK
            </span>
          </div>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
          DASHBOARD
        </Link>
        <Link href="/cases" className={`${styles.navLink} ${pathname === '/cases' ? styles.active : ''}`}>
          DOSYALAR
        </Link>
        <Link href="/clients" className={`${styles.navLink} ${pathname === '/clients' ? styles.active : ''}`}>
          MÜVEKKİLLER
        </Link>
        <Link href="/calendar" className={`${styles.navLink} ${pathname === '/calendar' ? styles.active : ''}`}>
          AJANDA / TAKVİM
        </Link>
        <Link href="/prospects" className={`${styles.navLink} ${pathname === '/prospects' ? styles.active : ''}`}>
          MUHTEMEL DOSYALAR
        </Link>
        <Link href="/deger-kaybi" className={`${styles.navLink} ${pathname === '/deger-kaybi' ? styles.active : ''}`}>
          DEĞER KAYBI
        </Link>
        <Link href="/admin" className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}>
          YÖNETİCİ (ADMİN)
        </Link>
      </nav>
      <div style={{ marginTop: 'auto', padding: '1rem', width: '100%' }}>
        <button className={styles.logoutBtn} onClick={() => alert('Oturum kapatılıyor... (Giriş ekranı tasarlandığında buraya yönlendirilecek)')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          ÇIKIŞ YAP
        </button>
      </div>
    </aside>
  )
}
