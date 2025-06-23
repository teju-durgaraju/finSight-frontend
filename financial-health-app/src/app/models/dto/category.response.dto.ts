// src/app/models/dto/category.response.dto.ts
export interface CategoryResponseDto {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'GENERAL'; // GENERAL if applicable to both or if type is not strictly enforced per category
}
