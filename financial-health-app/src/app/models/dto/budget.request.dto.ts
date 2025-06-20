// Based on PUT /api/v1/budgets/{id} and potential POST /api/v1/budgets
export interface BudgetRequestDto {
  category: string;
  amountAllocated: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}
