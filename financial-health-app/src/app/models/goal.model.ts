// src/app/models/goal.model.ts
export interface Goal {
  id: number;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  // userId?: number;
  // createdAt?: Date;
  // updatedAt?: Date;
}
