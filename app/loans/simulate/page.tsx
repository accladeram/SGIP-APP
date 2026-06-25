'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loanService } from '@/src/services/loanService';
import { useUser } from '@/src/context/UserContext';
import type { SimulateResponse, LoanType } from '@/src/types';

const LOAN_TYPES: { value: LoanType; label: string }[] = [
  { value: 'Fixed', label: 'Cuota Fija' },
  { value: 'Decreasing', label: 'Cuota Decreciente' },
];

function fmt(n: number | undefined | null): string {
  return (n ?? 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b7a9e] focus:border-transparent transition bg-white text-sm';

const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5';

export default function SimulatePage() {
  const router = useRouter();
  const { userId } = useUser();

  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [loanType, setLoanType] = useState<LoanType>('Fixed');
  const [monthlyIncome, setMonthlyIncome] = useState('');

  const [result, setResult] = useState<SimulateResponse | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [calcError, setCalcError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  async function handleSimulate(e: React.FormEvent) {
    e.preventDefault();
    setCalcLoading(true);
    setCalcError('');
    setResult(null);
    try {
      const data = await loanService.simulate(
        {
          amount: Number(amount),
          term: Number(term),
          loanType,
          monthlyIncome: Number(monthlyIncome),
        },
        userId,
      );
      setResult(data);
    } catch (err) {
      setCalcError(err instanceof Error ? err.message : 'Error al calcular la simulación.');
    } finally {
      setCalcLoading(false);
    }
  }

  async function handleRequest() {
    if (!result || requestLoading) return;
    setRequestLoading(true);
    setRequestError('');
    try {
      const loan = await loanService.create(
        {
          userId,
          amount: Number(amount),
          term: Number(term),
          loanType,
          monthlyIncome: Number(monthlyIncome),
        },
        crypto.randomUUID(),
      );
      setRequestSuccess(true);
      setTimeout(() => router.push(`/loans/${loan.id}`), 1200);
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : 'Error al solicitar el préstamo.');
      setRequestLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Calculadora de Préstamos</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Ingresa los parámetros para calcular tu cuota y cronograma de pagos al instante.
        </p>
      </div>

      {/* Main calculator card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleSimulate} className="space-y-5">
          {/* Row 1 — primary financial inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Monto del Préstamo ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="500"
                max="50000"
                step="any"
                placeholder="Ej: 10,000"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-slate-400">Rango: $500 — $50,000</p>
            </div>

            <div>
              <label className={labelClass}>Ingreso Mensual Disponible ($)</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
                min="1"
                step="any"
                placeholder="Ej: 3,500"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-slate-400">Ingreso neto mensual del solicitante</p>
            </div>
          </div>

          {/* Row 2 — loan structure inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Plazo (Meses)</label>
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                required
                min="6"
                max="60"
                step="1"
                placeholder="Ej: 36"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-slate-400">Rango: 6 — 60 meses</p>
            </div>

            <div>
              <label className={labelClass}>Tipo de Préstamo</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value as LoanType)}
                className={inputClass}
              >
                {LOAN_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {calcError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
              {calcError}
            </div>
          )}

          <button
            type="submit"
            disabled={calcLoading}
            className="w-full bg-[#3b7a9e] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#2e6280] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {calcLoading ? 'Calculando…' : 'Calcular Cuota'}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-8 space-y-6">
          {/* Summary metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Cuota Mensual', value: `$${fmt(result.monthlyPayment)}`, highlight: true },
              { label: 'Total a Pagar', value: `$${fmt(result.totalPayment)}`, highlight: false },
              { label: 'Interés Total', value: `$${fmt(result.totalInterest)}`, highlight: false },
              { label: 'Tasa de Interés (TEA)', value: `${fmt(result.interestRate)}%`, highlight: false },
            ].map((card) => (
              <div
                key={card.label}
                className={`bg-white rounded-xl border p-5 shadow-sm text-center ${
                  card.highlight ? 'border-[#3b7a9e]/30 ring-1 ring-[#3b7a9e]/20' : 'border-slate-200'
                }`}
              >
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
                  {card.label}
                </p>
                <p className={`text-xl font-bold ${card.highlight ? 'text-[#3b7a9e]' : 'text-slate-900'}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Risk policy indicator */}
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
              result.meetsRiskPolicy
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                result.meetsRiskPolicy ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            {result.meetsRiskPolicy
              ? 'Este préstamo cumple la política de riesgo institucional.'
              : 'Este préstamo no cumple la política de riesgo institucional.'}
          </div>

          {/* Payment schedule table */}
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
                  {result.schedule?.map((row) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Loan request card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
              Solicitar Préstamo
            </h2>

            {requestSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-emerald-700 text-sm font-medium">
                ¡Préstamo solicitado con éxito! Redirigiendo al detalle…
              </div>
            ) : (
              <div className="space-y-3">
                {requestError && (
                  <p className="text-red-600 text-sm">{requestError}</p>
                )}
                <button
                  onClick={handleRequest}
                  disabled={requestLoading}
                  className="w-full bg-[#3b7a9e] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#2e6280] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {requestLoading ? 'Procesando…' : 'Solicitar Préstamo'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
