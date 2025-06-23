// src/app/models/dto/transaction.request.dto.ts
// Based on OpenAPI spec
export interface TransactionRequestDto {
  type: 'INCOME' | 'EXPENSE'; // Matches enum from TransactionResponseDto spec (assuming consistency)
  amount: number; // min: 0.01
  categoryId: number; // Changed from category: string; ID of the category. format: int64
  transactionDate: string; // Changed from date: string; format: date (e.g., "YYYY-MM-DD")
  description?: string; // maxLength: 255, minLength: 0
}
