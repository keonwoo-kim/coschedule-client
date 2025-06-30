'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { checked, isAuthenticated } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    if (!checked) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [checked, isAuthenticated, router]);

  if (!checked) {
    return (
      <html lang="en">
        <body className={`${inter.className} h-screen m-0 bg-gray-50 dark:bg-gray-900 dark:text-white`}>
          <div className="flex items-center justify-center min-h-screen">Loading...</div>
        </body>
      </html>
    );
  }

//   // 만약 이미 useEffect에서 /login으로 redirect 중이면
//   if (!isAuthenticated) {
//     return null;
//   }

  return (
    <html lang="en">
      <body className={`${inter.className} h-screen m-0 bg-gray-50 dark:bg-gray-900 dark:text-white`}>
        <Header onMenu={() => setDrawerOpen(true)} />
        
        {drawerOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}></div>
            <div className="drawer-panel bg-white dark:bg-zinc-800 p-4 w-64 shadow-lg">
              <div className="drawer-header flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">CoSchedule</h2>
                <button onClick={() => setDrawerOpen(false)}>&times;</button>
              </div>
              <nav>
                <ul className="space-y-4">
                  <li className="cursor-pointer" onClick={toggleDarkMode}>
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}

        <main className="main-container p-4">
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </main>
      </body>
    </html>
  );
}
