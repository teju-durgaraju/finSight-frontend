// Based on GET /api/v1/budgets/{id}
export interface BudgetResponseDto {
  id: number;
  category: string;
  amountAllocated: number;
  amountSpent?: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  userId?: number;
}
