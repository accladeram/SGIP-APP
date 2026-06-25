// ─── Shared enums ────────────────────────────────────────────────────────────

export type LoanType = 'Fixed' | 'Decreasing';
export type LoanStatus = 'Pending' | 'Approved' | 'Rejected' | 'Active';
export type PaymentScheduleStatus = 'Pending' | 'Paid';
export type TransactionType = 'Disbursement' | 'Payment' | 'Transfer';
export type TransactionStatus = 'Pending' | 'Completed' | 'Failed';

// ─── Response interfaces (camelCase — API uses JsonNamingPolicy.CamelCase) ───

export interface PaymentSchedule {
  id?: string;
  loanId?: string;
  paymentNumber: number;
  dueDate: string;
  totalPayment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status?: PaymentScheduleStatus;
}

export interface SimulateResponse {
  amount: number;
  term: number;
  interestRate: number;
  loanType: number;        // integer enum: 0 = Fixed, 1 = Decreasing
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;    // total amount to pay over the loan life
  meetsRiskPolicy: boolean;
  schedule: PaymentSchedule[];
}

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  term: number;
  interestRate: number;
  loanType: LoanType;
  status: LoanStatus;
  monthlyPayment: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoanDetail extends Loan {
  schedule: PaymentSchedule[];
}

export interface Transaction {
  id: string;
  idempotencyKey: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  loanId: string | null;
  description: string;
  createdAt: string;
}

// ─── Request interfaces (camelCase — service layer maps to PascalCase wire) ──

export interface SimulateRequest {
  amount: number;
  term: number;
  loanType: LoanType;
  monthlyIncome: number;
}

export interface CreateLoanRequest {
  userId: string;
  amount: number;
  term: number;
  loanType: LoanType;
  monthlyIncome: number;
}

export interface CreateTransactionRequest {
  idempotencyKey: string;
  type: TransactionType;
  amount: number;
  loanId?: string | null;
  description: string;
}
