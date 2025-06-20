import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // For GoalFormComponent

import { GoalsRoutingModule } from './goals-routing.module';
import { SharedModule } from '../../shared/shared.module'; // For shared components, pipes, directives

// Components to be declared
import { GoalListComponent } from './components/goal-list/goal-list.component';
import { GoalFormComponent } from './components/goal-form/goal-form.component';
import { GoalProgressComponent } from './components/goal-progress/goal-progress.component';

@NgModule({
  declarations: [
    GoalListComponent,
    GoalFormComponent,
    GoalProgressComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,      // Needed for GoalFormComponent
    GoalsRoutingModule,       // The module's own routing
    SharedModule              // For app-lucide-icon, etc.
  ]
  // No exports needed if components are only routed to within this module.
  // GoalProgressComponent is used by GoalListComponent within this module.
})
export class GoalsModule { }
