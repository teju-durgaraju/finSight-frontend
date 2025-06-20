import { Routes } from "@angular/router";
// Removed: import { FinancialSummaryComponent } from "./components/financial-summary/financial-summary"; // This was refactored to TransactionListComponent
// Removed: import { TransactionFormComponent } from "./components/financial-summary/transaction-form/transaction-form.component"; // This was moved
// DashboardComponent import was removed when DashboardModule was created
import { BudgetManagementComponent } from "./components/budget-management/budget-management";
import { GoalSettingsComponent } from "./components/goal-settings/goal-settings";
import { ReportsComponent } from "./features/reports.component";
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule),
    canActivate: [authGuard]
  },
  { path: "budgets", component: BudgetManagementComponent, canActivate: [authGuard] },
  { path: "goals", component: GoalSettingsComponent, canActivate: [authGuard] },
  { path: "reports", component: ReportsComponent, canActivate: [authGuard] },
  { path: "login", redirectTo: "/auth/login", pathMatch: "full" },
  { path: "registration", redirectTo: "/auth/register", pathMatch: "full" },
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "/dashboard" }
];
