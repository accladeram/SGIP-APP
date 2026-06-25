'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loanService } from '@/src/services/loanService';
import { useUser } from '@/src/context/UserContext';
import type { Loan, LoanStatus } from '@/src/types';

const STATUS_STYLES: Record<LoanStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
  Active: 'bg-emerald-100 text-emerald-700',
};

const STATUS_LABELS: Record<LoanStatus, string> = {
  Pending: 'Pendiente',
  Approved: 'Aprobado',
  Rejected: 'Rechazado',
  Active: 'Activo',
};

const LOAN_TYPE_LABELS: Record<string, string> = {
  Fixed: 'Cuota Fija',
  Decreasing: 'Cuota Decreciente',
};

export default function LoansPage() {
  const { userId } = useUser();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loanService
      .list(userId)
      .then(setLoans)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Error al cargar los préstamos.'),
      )
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mis Préstamos</h1>
          <p className="text-slate-500 text-sm mt-0.5">Historial completo de solicitudes</p>
        </div>
        <Link
          href="/loans/simulate"
          className="bg-[#3b7a9e] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#2e6280] transition-colors text-sm"
        >
          + Nuevo Préstamo
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
            Cargando préstamos…
          </div>
        )}
        {error && !loading && (
          <div className="p-6">
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          </div>
        )}
        {!loading && !error && loans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="mb-3 text-sm">No hay préstamos registrados aún.</p>
            <Link
              href="/loans/simulate"
              className="text-[#3b7a9e] font-medium text-sm hover:text-[#2e6280] transition-colors"
            >
              Simular y solicitar un préstamo →
            </Link>
          </div>
        )}
        {!loading && !error && loans.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Usuario', 'Monto', 'Tipo', 'TEA', 'Plazo', 'Cuota Mensual', 'Estado', 'Creado', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {loan.userId?.slice(0, 8)}…
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      ${(loan.amount ?? 0).toLocaleString('es-EC')}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {LOAN_TYPE_LABELS[loan.loanType] ?? loan.loanType}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{loan.interestRate}%</td>
                    <td className="px-5 py-4 text-slate-600">{loan.term} m</td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      ${(loan.monthlyPayment ?? 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[loan.status]}`}
                      >
                        {STATUS_LABELS[loan.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {new Date(loan.createdAt).toLocaleDateString('es-EC')}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/loans/${loan.id}`}
                        className="text-[#3b7a9e] hover:text-[#2e6280] font-medium text-xs transition-colors"
                      >
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
