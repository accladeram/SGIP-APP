'use client';

import { useState } from 'react';
import { useUser } from '@/src/context/UserContext';

export default function UserGate({ children }: { children: React.ReactNode }) {
  const { userId, ready, login } = useUser();
  const [inputId, setInputId] = useState('');
  const [error, setError] = useState('');

  function handleAccess() {
    const trimmed = inputId.trim();
    if (!trimmed) {
      setError('Por favor ingrese un identificador válido.');
      return;
    }
    setError('');
    login(trimmed);
  }

  // Wait for localStorage to be read before rendering anything.
  // Prevents a flash of the portal screen for already-authenticated users.
  if (!ready) return null;

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full max-w-sm p-8">
          {/* Brand mark */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-[#3b7a9e] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm tracking-tight">F</span>
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">
              FinTech Solutions
            </span>
          </div>

          <h1 className="text-xl font-bold text-slate-800 mb-1">Portal de Acceso</h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Ingrese su identificador de cliente para acceder al simulador y gestionar sus préstamos.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Identificador de Cliente (ID)
              </label>
              <input
                type="text"
                value={inputId}
                onChange={(e) => { setInputId(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleAccess()}
                placeholder="Ej: user-123"
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b7a9e] focus:border-transparent transition bg-white text-sm"
              />
              {error && (
                <p className="mt-1.5 text-xs text-red-600">{error}</p>
              )}
            </div>

            <button
              onClick={handleAccess}
              disabled={!inputId.trim()}
              className="w-full bg-[#3b7a9e] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#2e6280] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Acceder al Simulador
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
