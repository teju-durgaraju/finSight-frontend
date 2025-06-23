// src/app/models/budget.model.ts
export interface Budget {
  id: number;
  userId?: number;
  categoryName: string;
  allocatedAmount: number;
  month: Date; // Store as Date object (e.g., first day of YYYY-MM)
  totalMonthlyBudgetGoal?: number;
  createdAt?: Date;
  updatedAt?: Date;
  categoryId?: number; // Added to align with form needs and request DTOs
  // amountSpent is not part of BudgetResponseDto, so removed here.
  // It will need to be calculated separately if required by UI.
}
