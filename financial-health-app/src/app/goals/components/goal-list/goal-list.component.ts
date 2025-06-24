import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Goal } from '../../../models/goal.model';
import { GoalService } from '../../../core/services/goal.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../core/services/modal.service'; // Import ModalService

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit {
  goals$: Observable<Goal[]>;

  constructor(
    private goalService: GoalService,
    private router: Router,
    private modalService: ModalService // Injected ModalService
  ) {
    this.goals$ = this.goalService.goals$;
  }

  ngOnInit(): void {
    this.goalService.getGoals().subscribe();
  }

  navigateToAddGoal(): void {
    this.router.navigate(['/goals/add']);
  }

  navigateToEditGoal(goalId: number): void {
    this.router.navigate(['/goals/edit', goalId]);
  }

  async deleteGoal(goalId: number): Promise<void> { // Changed to async
    try {
      const confirmed = await this.modalService.confirm(
        'Delete Goal',
        'Are you sure you want to delete this financial goal?',
        'Delete', 'Cancel', 'btn-danger', 'btn-outline-secondary'
      );
      if (confirmed) {
        this.goalService.deleteGoal(goalId).subscribe({
          next: () => console.log(\`Goal \${goalId} deleted successfully\`),
          error: (err) => console.error(\`Error deleting goal \${goalId}\`, err)
        });
      }
    } catch (error) {
      console.log('Delete goal modal dismissed.');
    }
  }

  calculateProgress(goal: Goal): number {
    if (!goal || goal.targetAmount === 0) return 0;
    const currentAmount = goal.currentAmount || 0;
    return Math.min(Math.round((currentAmount / goal.targetAmount) * 100), 100);
  }
}
