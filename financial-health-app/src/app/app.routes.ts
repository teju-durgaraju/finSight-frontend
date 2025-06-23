import { Routes } from "@angular/router";
import { authGuard } from './core/guards/auth.guard';
// GoalSettingsComponent import removed as it was superseded by GoalsModule
// ReportsComponent import removed as it's now part of lazy-loaded ReportsModule

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
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
    canActivate: [authGuard]
  },
  { path: "login", redirectTo: "/auth/login", pathMatch: "full" },
  { path: "registration", redirectTo: "/auth/register", pathMatch: "full" },
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "/dashboard" }
];
