// src/app/models/dto/goal.request.dto.ts
// Based on POST /api/v1/goals and PUT /api/v1/goals/{id}
export interface GoalRequestDto {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate: string; // Expecting ISO date string from client
}
