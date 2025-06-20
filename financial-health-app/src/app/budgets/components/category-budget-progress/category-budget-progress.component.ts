import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Budget } from '../../../models/budget.model';

@Component({
  selector: 'app-category-budget-progress',
  templateUrl: './category-budget-progress.component.html',
  styleUrls: ['./category-budget-progress.component.scss']
})
export class CategoryBudgetProgressComponent implements OnChanges {
  @Input() budget?: Budget;

  progressPercentage: number = 0;
  progressBarClass: string = 'bg-success';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['budget'] && this.budget) {
      this.calculateProgress();
    }
  }

  private calculateProgress(): void {
    if (!this.budget || this.budget.amountAllocated === 0) {
      this.progressPercentage = 0;
      this.progressBarClass = 'bg-secondary';
      return;
    }

    const spent = this.budget.amountSpent || 0;
    this.progressPercentage = Math.min(Math.round((spent / this.budget.amountAllocated) * 100), 100);

    if (this.progressPercentage < 50) {
      this.progressBarClass = 'bg-success';
    } else if (this.progressPercentage < 85) {
      this.progressBarClass = 'bg-warning';
    } else {
      this.progressBarClass = 'bg-danger';
    }
  }
}
