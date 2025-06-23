// src/app/models/dto/transaction.response.dto.ts
// Based on OpenAPI spec
export interface TransactionResponseDto {
  id: number; // format: int64
  userId?: number; // format: int64
  type: 'INCOME' | 'EXPENSE'; // Enum
  amount: number;
  categoryName: string; // Changed from category: string
  transactionDate: string; // Changed from date: string; format: date
  description?: string;
  createdAt?: string; // format: date-time
}
