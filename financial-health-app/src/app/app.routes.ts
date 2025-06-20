import { Routes } from "@angular/router";
// Removed: import { GoalSettingsComponent } from "./components/goal-settings/goal-settings.component";
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
  {
    path: 'budgets',
    loadChildren: () => import('./budgets/budgets.module').then(m => m.BudgetModule),
    canActivate: [authGuard]
  },
  {
    path: 'goals',
    loadChildren: () => import('./goals/goals.module').then(m => m.GoalsModule),
    canActivate: [authGuard]
  },
  { path: "reports", component: ReportsComponent, canActivate: [authGuard] },
  { path: "login", redirectTo: "/auth/login", pathMatch: "full" },
  { path: "registration", redirectTo: "/auth/register", pathMatch: "full" },
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "/dashboard" }
];
