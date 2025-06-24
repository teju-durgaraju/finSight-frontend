// src/app/models/dto/weekly-summary.response.dto.ts
import { CategorySpendingDto } from './category-spending.dto';

export interface WeeklySummaryResponseDto {
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  spendingByCategory: CategorySpendingDto[];
}
