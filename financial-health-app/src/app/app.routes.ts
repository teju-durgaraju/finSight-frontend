import { Routes } from "@angular/router";
// DashboardComponent import removed
import { FinancialSummaryComponent } from "./components/financial-summary/financial-summary";
import { BudgetManagementComponent } from "./components/budget-management/budget-management";
import { GoalSettingsComponent } from "./components/goal-settings/goal-settings";
import { ReportsComponent } from "./features/reports.component";
import { TransactionFormComponent } from "./components/financial-summary/transaction-form/transaction-form.component";
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
  { path: "transactions", component: FinancialSummaryComponent, canActivate: [authGuard] },
  { path: "transactions/new", component: TransactionFormComponent, canActivate: [authGuard] },
  { path: "transactions/edit/:id", component: TransactionFormComponent, canActivate: [authGuard] },
  { path: "budgets", component: BudgetManagementComponent, canActivate: [authGuard] },
  { path: "goals", component: GoalSettingsComponent, canActivate: [authGuard] },
  { path: "reports", component: ReportsComponent, canActivate: [authGuard] },
  { path: "login", redirectTo: "/auth/login", pathMatch: "full" },
  { path: "registration", redirectTo: "/auth/register", pathMatch: "full" },
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "/dashboard" }
];
