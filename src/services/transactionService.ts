import { api } from './api';
import type { Transaction, CreateTransactionRequest } from '@/src/types';

export const transactionService = {
  list: (userId: string): Promise<Transaction[]> =>
    api.get<Transaction[]>(`/api/transactions?userId=${encodeURIComponent(userId)}`),

  create: (data: CreateTransactionRequest): Promise<Transaction> =>
    api.post<Transaction>('/api/transactions', data, data.idempotencyKey),
};
