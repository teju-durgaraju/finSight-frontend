import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // For CategoryManagementComponent form

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module'; // For shared components

// Admin Components
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserManagementComponent,
    CategoryManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,  // Needed for CategoryManagementComponent form
    AdminRoutingModule,   // The module's own routing
    SharedModule          // For app-lucide-icon, app-loading-spinner etc.
  ]
})
export class AdminModule { }
