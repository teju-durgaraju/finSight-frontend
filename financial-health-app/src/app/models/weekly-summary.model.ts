// src/app/models/weekly-summary.model.ts
import { CategorySpending } from './category-spending.model';

export interface WeeklySummary {
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  spendingByCategory: CategorySpending[];
}
