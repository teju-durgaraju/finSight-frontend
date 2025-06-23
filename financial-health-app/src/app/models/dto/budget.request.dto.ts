// src/app/models/dto/budget.request.dto.ts
// Based on OpenAPI spec
export interface BudgetRequestDto {
  categoryId: number; // format: int64
  allocatedAmount: number; // min: 0
  month: string; // pattern: "^\d{4}-(0[1-9]|1[0-2])$" (e.g., "YYYY-MM")
  totalMonthlyBudgetGoal?: number; // min: 0, optional
}
