// Based on POST /api/v1/transactions and PUT /api/v1/transactions/{id}
export interface TransactionRequestDto {
  date: string; // Expecting ISO date string from client
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}
