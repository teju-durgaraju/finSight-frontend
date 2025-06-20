// Based on GET /api/v1/transactions and GET /api/v1/transactions/{id}
export interface TransactionResponseDto {
  id: number;
  date: string; // ISO date string (e.g., "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss")
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  userId?: number;
}
