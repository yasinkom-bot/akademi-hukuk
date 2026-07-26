import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import styles from './layout.module.css'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import TaskSnackbar from '@/components/TaskSnackbar'
import { AppProvider } from './context/AppContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Akademi Hukuk Otomasyonu',
  description: 'Legal CRM and Automation System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AppProvider>
          <div className={styles.appContainer}>
            <Sidebar />
            <main className={styles.mainContent}>
              <Topbar />
              <div className={styles.pageContent}>
                {children}
              </div>
            </main>
          </div>
          <TaskSnackbar />
        </AppProvider>
      </body>
    </html>
  )
}
