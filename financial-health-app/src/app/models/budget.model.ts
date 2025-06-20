// src/app/models/budget.model.ts
export interface Budget {
  id: number;
  category: string;
  amountAllocated: number;
  amountSpent?: number;
  startDate: Date;
  endDate: Date;
  // userId?: number;
}
