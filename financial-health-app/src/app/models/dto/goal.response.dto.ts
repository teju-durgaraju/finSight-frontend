// src/app/models/dto/goal.response.dto.ts
// Based on OpenAPI spec
export interface GoalResponseDto {
  id: number; // format: int64
  userId?: number; // format: int64
  goalName: string; // Changed from name
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // format: date
  createdAt?: string; // format: date-time
  updatedAt?: string; // format: date-time
}
