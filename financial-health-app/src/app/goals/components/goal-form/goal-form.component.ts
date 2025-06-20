import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalService } from '../../../core/services/goal.service';
// Goal model might be needed if we transform formValue before sending to service,
// but service's createGoal/updateGoal expect Partial<Omit<Goal, 'id'>> which formValue should match.

@Component({
  selector: 'app-goal-form',
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.scss']
})
export class GoalFormComponent implements OnInit {
  goalForm: FormGroup;
  isEditMode = false;
  goalId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private goalService: GoalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.goalForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      targetAmount: ['', [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      currentAmount: [0, [Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      targetDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.goalId = +idParam;
      if (this.goalId !== null && !isNaN(this.goalId)) {
        this.goalService.getGoalById(this.goalId).subscribe(goal => {
          if (goal) {
            const formGoalValue = {
              ...goal,
              targetDate: goal.targetDate instanceof Date ? goal.targetDate.toISOString().substring(0,10) : goal.targetDate,
            };
            this.goalForm.patchValue(formGoalValue);
          } else {
            console.error('Goal not found for editing');
            this.router.navigate(['/goals']);
          }
        });
      } else {
        console.error('Invalid Goal ID for editing');
        this.router.navigate(['/goals']);
      }
    }
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      const formValue = this.goalForm.value;
      if (this.isEditMode && this.goalId !== null) {
        this.goalService.updateGoal(this.goalId, formValue).subscribe({
          next: () => this.router.navigate(['/goals']),
          error: (err) => console.error('Failed to update goal', err)
        });
      } else {
        this.goalService.createGoal(formValue).subscribe({
          next: () => this.router.navigate(['/goals']),
          error: (err) => console.error('Failed to create goal', err)
        });
      }
    } else {
      this.goalForm.markAllAsTouched();
    }
  }

  get f() { return this.goalForm.controls; }
}
