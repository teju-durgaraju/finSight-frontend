// src/app/models/dto/budget.response.dto.ts
// Based on OpenAPI spec
export interface BudgetResponseDto {
  id: number; // format: int64
  userId?: number; // format: int64
  categoryName: string;
  allocatedAmount: number;
  month: string; // (e.g., "YYYY-MM")
  totalMonthlyBudgetGoal?: number;
  createdAt?: string; // format: date-time
  updatedAt?: string; // format: date-time
  // amountSpent is not in this DTO per spec
}
