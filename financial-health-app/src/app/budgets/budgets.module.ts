import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // For BudgetFormComponent

import { BudgetsRoutingModule } from './budgets-routing.module';
import { SharedModule } from '../../shared/shared.module'; // For shared components like LucideIcon

// Components to be declared
import { BudgetListComponent } from './components/budget-list/budget-list.component';
import { BudgetFormComponent } from './components/budget-form/budget-form.component';
import { CategoryBudgetProgressComponent } from './components/category-budget-progress/category-budget-progress.component';

@NgModule({
  declarations: [
    BudgetListComponent,
    BudgetFormComponent,
    CategoryBudgetProgressComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,      // Needed for BudgetFormComponent
    BudgetsRoutingModule,     // The module's own routing
    SharedModule              // For app-lucide-icon, etc.
  ]
  // No exports needed if components are only routed to within this module.
})
export class BudgetModule { }
