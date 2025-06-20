// src/app/models/dto/goal.response.dto.ts
// Based on GET /api/v1/goals and GET /api/v1/goals/{id}
export interface GoalResponseDto {
  id: number;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // ISO date string (e.g., "YYYY-MM-DD")
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}
