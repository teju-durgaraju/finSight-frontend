import { Component, Input } from '@angular/core';
import { Budget } from '../../../models/budget.model';

@Component({
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.scss']
})
export class BudgetOverviewComponent {
  @Input() budgets: Budget[] | null = null;

  constructor() {}

  getBudgetProgress(budget: Budget): number {
    if (!budget.amountSpent || budget.amountAllocated === 0) {
      return 0;
    }
    return Math.min(Math.round((budget.amountSpent / budget.amountAllocated) * 100), 100);
  }

  getProgressBarClass(progress: number): string {
    if (progress < 50) return 'bg-success';
    if (progress < 85) return 'bg-warning';
    return 'bg-danger';
  }
}
