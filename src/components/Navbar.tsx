'use client';

import Link from 'next/link';
import { useUser } from '@/src/context/UserContext';

export default function Navbar() {
  const { userId, logout } = useUser();

  const initials = userId.slice(0, 2).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#3b7a9e] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tight">F</span>
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">FinTech Solutions</span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-1">
              <Link
                href="/loans/simulate"
                className="text-sm font-medium text-slate-600 hover:text-[#3b7a9e] hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Simulador
              </Link>
              <Link
                href="/loans"
                className="text-sm font-medium text-slate-600 hover:text-[#3b7a9e] hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Mis Préstamos
              </Link>
              <Link
                href="/transactions"
                className="text-sm font-medium text-slate-600 hover:text-[#3b7a9e] hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Historial
              </Link>
            </nav>

            <div className="h-5 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3b7a9e]/10 border border-[#3b7a9e]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#3b7a9e] text-xs font-bold tracking-tight">{initials}</span>
              </div>
              <div className="leading-tight">
                <p className="font-medium text-slate-700 text-sm">Sesión activa</p>
                <p className="text-xs text-slate-400">ID: {userId}</p>
              </div>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors whitespace-nowrap ml-1"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
