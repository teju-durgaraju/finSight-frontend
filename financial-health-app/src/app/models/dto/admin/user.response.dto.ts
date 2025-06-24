// src/app/models/dto/admin/user.response.dto.ts
// Conceptual DTO for listing users in an admin context
export interface UserResponseDto {
  id: number; // Or string, depending on backend ID type for users
  username: string;
  email?: string; // May or may not be exposed
  roles: string[]; // e.g., ['ROLE_USER', 'ROLE_ADMIN']
  createdAt?: string; // ISO date-time string
  lastLogin?: string; // ISO date-time string
  isEnabled?: boolean; // Account status
}
