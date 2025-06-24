import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component'; // Example

const routes: Routes = [
  // Example route:
  // { path: '', component: AdminDashboardComponent },
  // More routes for user management, category management, etc. will be added here
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
