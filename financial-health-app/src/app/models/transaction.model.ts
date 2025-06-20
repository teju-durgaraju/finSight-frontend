// src/app/models/transaction.model.ts
export interface Transaction {
  id: number; // Changed from string to number
  date: Date; // Keep as Date object on frontend
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  // userId?: number;
}
