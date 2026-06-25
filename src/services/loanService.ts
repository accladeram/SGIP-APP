import { api } from './api';
import type {
  Loan,
  LoanDetail,
  LoanType,
  SimulateRequest,
  SimulateResponse,
  CreateLoanRequest,
} from '@/src/types';

// .NET System.Text.Json default: no naming policy (PascalCase) + integer enums.
const LOAN_TYPE_INT: Record<LoanType, 0 | 1> = {
  Fixed: 0,
  Decreasing: 1,
};

export const loanService = {
  simulate: (data: SimulateRequest, userId: string): Promise<SimulateResponse> =>
    api.post<SimulateResponse>('/api/loans/simulate', {
      "UserId": userId,
      "Amount": Number(data.amount),
      "Term": Number(data.term),
      "LoanType": Number(LOAN_TYPE_INT[data.loanType]),
      "MonthlyIncome": Number(data.monthlyIncome),
    }),

  create: (data: CreateLoanRequest, idempotencyKey: string): Promise<Loan> =>
    api.post<Loan>(
      '/api/loans',
      {
        "UserId": data.userId,
        "Amount": Number(data.amount),
        "Term": Number(data.term),
        "LoanType": Number(LOAN_TYPE_INT[data.loanType]),
        "MonthlyIncome": Number(data.monthlyIncome),
      },
      idempotencyKey,
    ),

  list: (userId: string): Promise<Loan[]> =>
    api.get<Loan[]>(`/api/loans?userId=${encodeURIComponent(userId)}`),

  getById: (id: string): Promise<LoanDetail> =>
    api.get<LoanDetail>(`/api/loans/${id}`),
};
