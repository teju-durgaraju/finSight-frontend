import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetListComponent } from './components/budget-list/budget-list.component';
import { BudgetFormComponent } from './components/budget-form/budget-form.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetListComponent
  },
  {
    path: 'add',
    component: BudgetFormComponent
  },
  {
    path: 'edit/:id',
    component: BudgetFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetsRoutingModule { }
