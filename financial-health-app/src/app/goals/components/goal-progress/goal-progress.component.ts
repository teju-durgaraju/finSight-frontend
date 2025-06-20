import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Goal } from '../../../models/goal.model';

@Component({
  selector: 'app-goal-progress',
  templateUrl: './goal-progress.component.html',
  styleUrls: ['./goal-progress.component.scss']
})
export class GoalProgressComponent implements OnChanges {
  @Input() goal?: Goal;

  progressPercentage: number = 0;
  progressBarClass: string = 'bg-primary';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['goal'] && this.goal) {
      this.calculateProgress();
    }
  }

  private calculateProgress(): void {
    if (!this.goal || this.goal.targetAmount === 0) {
      this.progressPercentage = 0;
      this.progressBarClass = 'bg-secondary';
      return;
    }

    const current = this.goal.currentAmount || 0;
    this.progressPercentage = Math.round((current / this.goal.targetAmount) * 100);

    // Example: Simple class based on completion. More sophisticated logic can be added.
    if (this.progressPercentage >= 100) {
      this.progressBarClass = 'bg-success'; // Goal achieved
    } else if (this.progressPercentage >= 75) {
      this.progressBarClass = 'bg-info'; // Nearing completion
    } else if (this.progressPercentage >= 40) {
      this.progressBarClass = 'bg-primary'; // Good progress
    } else {
      this.progressBarClass = 'bg-warning'; // Changed from bg-secondary for low progress, as secondary might mean inactive/no data
    }
  }
}
