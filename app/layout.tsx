import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { UserProvider } from '@/src/context/UserContext';
import UserGate from '@/src/components/UserGate';
import Navbar from '@/src/components/Navbar';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'FinTech Solutions — Sistema de Gestión Integral de Préstamos',
  description: 'Plataforma financiera para simular, solicitar y monitorear préstamos con trazabilidad completa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-slate-100 antialiased">
        <UserProvider>
          <UserGate>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </UserGate>
        </UserProvider>
      </body>
    </html>
  );
}
