// src/app/models/category.model.ts
export interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'GENERAL';
}
