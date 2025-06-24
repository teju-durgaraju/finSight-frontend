import { Routes } from "@angular/router";
import { authGuard } from './core/guards/auth.guard';
// Direct component imports for routes that are now lazy-loaded have been removed.
// e.g. DashboardComponent, TransactionListComponent, BudgetListComponent, GoalListComponent, ReportsComponent

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
  {
    path: 'insights',
    loadChildren: () => import('./insights/insights.module').then(m => m.InsightsModule),
    canActivate: [authGuard]
  },
  // Redirects for old top-level paths that are now part of feature modules or auth module
  { path: "login", redirectTo: "/auth/login", pathMatch: "full" },
  { path: "registration", redirectTo: "/auth/register", pathMatch: "full" },
  // Default and wildcard routes
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "/dashboard" }
];
