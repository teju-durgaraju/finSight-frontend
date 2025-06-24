// src/app/models/dto/admin/admin-category.request.dto.ts
// Conceptual DTO for an admin creating or updating a global category
export interface AdminCategoryRequestDto {
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'GENERAL'; // Type of category
  // Potentially other fields like description, icon, parentId if hierarchical
}
