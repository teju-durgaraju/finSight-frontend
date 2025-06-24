import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../../core/services/admin.service';
import { AdminUser } from '../../../models/admin/user.model';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users$: Observable<AdminUser[]>;
  isLoading: boolean = false;

  constructor(
    private adminService: AdminService,
    private modalService: ModalService
  ) {
    this.users$ = this.adminService.adminUsers$;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: () => this.isLoading = false,
      error: (err) => {
        console.error('Error loading users for admin:', err);
        this.isLoading = false;
      }
    });
  }

  formatRoles(roles: string[]): string {
    return roles.map(role => role.replace('ROLE_', '')).join(', ');
  }

  editUserRoles(user: AdminUser): void {
    console.log('Placeholder: Edit roles for user:', user.username);
    alert(\`Conceptual: Open modal to edit roles for \${user.username} (ID: \${user.id}). New roles would be sent via AdminService.updateUserRoles(\${user.id}, newRolesDto).\`);
  }

  async deleteUser(userId: number, username: string): Promise<void> {
    try {
      const confirmed = await this.modalService.confirm(
        'Delete User',
        \`Are you sure you want to delete user "\${username}" (ID: \${userId})? This action cannot be undone.\`,
        'Delete User',
        'Cancel',
        'btn-danger',
        'btn-outline-secondary'
      );

      if (confirmed) {
        this.adminService.deleteUser(userId).subscribe({
          next: (success) => {
            if (success) {
              console.log(\`User \${userId} deleted successfully\`);
            } else {
              console.error(\`Failed to delete user \${userId} (service returned false)\`);
            }
          },
          error: (err) => {
            console.error(\`Error deleting user \${userId}\`, err);
          }
        });
      }
    } catch (error) {
      console.log('Delete user modal dismissed.');
    }
  }
}
