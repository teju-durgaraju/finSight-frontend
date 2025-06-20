import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoalListComponent } from './components/goal-list/goal-list.component';
import { GoalFormComponent } from './components/goal-form/goal-form.component';

const routes: Routes = [
  {
    path: '',
    component: GoalListComponent
  },
  {
    path: 'add',
    component: GoalFormComponent
  },
  {
    path: 'edit/:id',
    component: GoalFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalsRoutingModule { }
