import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login";
import { DashboardComponent } from "./components/dashboard/dashboard";
import { FinancialSummaryComponent } from "./components/financial-summary/financial-summary";
import { BudgetManagementComponent } from "./components/budget-management/budget-management";
import { GoalSettingsComponent } from "./components/goal-settings/goal-settings";
import { ReportsComponent } from "./features/reports.component";
import { TransactionFormComponent } from "./components/financial-summary/transaction-form/transaction-form.component";
import { RegistrationComponent } from './registration/registration.component';

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "transactions", component: FinancialSummaryComponent },
  { path: "transactions/new", component: TransactionFormComponent },
  { path: "transactions/edit/:id", component: TransactionFormComponent },
  { path: "budgets", component: BudgetManagementComponent },
  { path: "goals", component: GoalSettingsComponent },
  { path: "reports", component: ReportsComponent },
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "/dashboard" }
];
