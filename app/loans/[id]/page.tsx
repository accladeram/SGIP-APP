'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { loanService } from '@/src/services/loanService';
import type { LoanDetail, LoanStatus, PaymentScheduleStatus } from '@/src/types';

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

const SCHEDULE_STATUS_STYLES: Record<PaymentScheduleStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Paid: 'bg-emerald-100 text-emerald-700',
};

const LOAN_TYPE_LABELS: Record<string, string> = {
  Fixed: 'Cuota Fija',
  Decreasing: 'Cuota Decreciente',
};

function fmt(n: number | undefined | null): string {
  return (n ?? 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function LoanDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) return;
    loanService
      .getById(params.id)
      .then(setLoan)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Error al cargar el préstamo.'),
      )
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Cargando…
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 inline-block">
          {error || 'Préstamo no encontrado.'}
        </p>
        <br />
        <Link
          href="/loans"
          className="mt-4 inline-block text-[#3b7a9e] hover:text-[#2e6280] text-sm font-medium transition-colors"
        >
          ← Volver a préstamos
        </Link>
      </div>
    );
  }

  const infoCards = [
    { label: 'Usuario', value: `${loan.userId?.slice(0, 8) ?? '—'}…` },
    { label: 'Monto', value: `$${(loan.amount ?? 0).toLocaleString('es-EC')}` },
    { label: 'Cuota Mensual', value: `$${fmt(loan.monthlyPayment)}` },
    { label: 'Tipo de Préstamo', value: LOAN_TYPE_LABELS[loan.loanType] ?? loan.loanType },
    { label: 'Tasa de Interés (TEA)', value: `${loan.interestRate ?? 0}%` },
    { label: 'Plazo (Meses)', value: `${loan.term ?? 0} meses` },
    { label: 'Creado', value: new Date(loan.createdAt).toLocaleDateString('es-EC') },
    { label: 'Actualizado', value: new Date(loan.updatedAt).toLocaleDateString('es-EC') },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-7">
        <button
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Volver"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Detalle del Préstamo</h1>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[loan.status]}`}
        >
          {STATUS_LABELS[loan.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {infoCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className="font-semibold text-slate-800 truncate">{card.value}</p>
          </div>
        ))}
      </div>

      {loan.schedule && loan.schedule.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Cronograma de Pagos
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    ['N°', false],
                    ['Fecha Venc.', false],
                    ['Pago Total', true],
                    ['Capital', true],
                    ['Interés', true],
                    ['Saldo', true],
                    ['Estado', false],
                  ].map(([h, right]) => (
                    <th
                      key={h as string}
                      className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${right ? 'text-right' : 'text-left'}`}
                    >
                      {h as string}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loan.schedule.map((row) => (
                  <tr key={row.paymentNumber} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.paymentNumber}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(row.dueDate).toLocaleDateString('es-EC')}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      ${fmt(row.totalPayment)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">${fmt(row.principal)}</td>
                    <td className="px-4 py-3 text-right text-slate-600">${fmt(row.interest)}</td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      ${fmt(row.remainingBalance)}
                    </td>
                    <td className="px-4 py-3">
                      {row.status && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${SCHEDULE_STATUS_STYLES[row.status]}`}
                        >
                          {row.status === 'Paid' ? 'Pagada' : 'Pendiente'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
