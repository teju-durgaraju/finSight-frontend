// src/app/models/admin/user.model.ts
// Conceptual frontend model for a user in admin context
export interface AdminUser {
  id: number; // Or string
  username: string;
  email?: string;
  roles: string[];
  createdAt?: Date;
  lastLogin?: Date;
  isEnabled?: boolean;
}
