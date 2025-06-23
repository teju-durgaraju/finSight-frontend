// src/app/models/dto/goal.request.dto.ts
// Based on OpenAPI spec
export interface GoalRequestDto {
  goalName: string; // Changed from name; maxLength: 255, minLength: 0
  description?: string; // Optional
  targetAmount: number; // min: 0.01
  currentAmount?: number; // Optional, min: 0
  targetDate: string; // format: date (e.g., "YYYY-MM-DD")
}
