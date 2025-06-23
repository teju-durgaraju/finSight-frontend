// src/app/models/transaction.model.ts
export interface Transaction {
  id: number;
  userId?: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  categoryName: string; // Changed from category: string
  // categoryId: number; // To be added later for form binding if needed
  transactionDate: Date; // Changed from date: Date; Will store as Date object after conversion
  description?: string;
  createdAt?: Date;
  categoryId?: number; // Added to align with form needs and request DTOs
}
