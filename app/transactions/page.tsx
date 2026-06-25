'use client';

import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '@/src/services/transactionService';
import { useUser } from '@/src/context/UserContext';
import type { Transaction, TransactionStatus, TransactionType } from '@/src/types';

const STATUS_STYLES: Record<TransactionStatus, string> = {
  Completed: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Failed: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  Completed: 'Completada',
  Pending: 'Pendiente',
  Failed: 'Fallida',
};

const TYPE_LABELS: Record<TransactionType, string> = {
  Disbursement: 'Desembolso',
  Payment: 'Pago',
  Transfer: 'Transferencia',
};

export default function TransactionsPage() {
  const { userId } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    setError('');
    transactionService
      .list(userId)
      .then(setTransactions)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Error al cargar las transacciones.'),
      )
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  async function handleCreateTest() {
    if (creating) return;
    setCreating(true);
    setCreateError('');
    try {
      await transactionService.create({
        idempotencyKey: crypto.randomUUID(),
        type: 'Payment',
        amount: Math.round(Math.random() * 950 + 50),
        description: `Transacción de prueba — ${new Date().toLocaleString('es-EC')}`,
      });
      fetchTransactions();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : 'Error al crear la transacción de prueba.',
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historial de Transacciones</h1>
          <p className="text-slate-500 text-sm mt-0.5">Movimientos financieros registrados</p>
        </div>
        <button
          onClick={handleCreateTest}
          disabled={creating}
          className="bg-[#3b7a9e] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#2e6280] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {creating ? 'Creando…' : '+ Crear Transacción de Prueba'}
        </button>
      </div>

      {createError && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          {createError}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
            Cargando transacciones…
          </div>
        )}
        {error && !loading && (
          <div className="p-6">
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          </div>
        )}
        {!loading && !error && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="text-sm">No hay transacciones registradas aún.</p>
          </div>
        )}
        {!loading && !error && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['ID', 'Tipo', 'Monto', 'Estado', 'Descripción', 'Fecha'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">
                      {tx.id?.slice(0, 8)}…
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {TYPE_LABELS[tx.type] ?? tx.type}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      $
                      {(tx.amount ?? 0).toLocaleString('es-EC', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[tx.status]}`}
                      >
                        {STATUS_LABELS[tx.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 max-w-xs truncate">{tx.description}</td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {new Date(tx.createdAt).toLocaleDateString('es-EC')}
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
