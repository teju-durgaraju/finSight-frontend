// src/app/models/goal.model.ts
export interface Goal {
  id: number;
  userId?: number;
  goalName: string; // Changed from name
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date; // Store as Date object after conversion
  createdAt?: Date;
  updatedAt?: Date;
}
