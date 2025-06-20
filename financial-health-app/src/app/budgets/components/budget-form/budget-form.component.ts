import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BudgetService } from '../../../core/services/budget.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Budget } from '../../../models/budget.model';

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss']
})
export class BudgetFormComponent implements OnInit {
  budgetForm: FormGroup;
  isEditMode = false;
  budgetId: number | null = null;
  categories$: Observable<string[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.budgetForm = this.fb.group({
      category: ['', Validators.required],
      amountAllocated: ['', [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categories$ = this.transactionService.getCategories();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.budgetId = +idParam;
      if (this.budgetId !== null && !isNaN(this.budgetId)) {
        this.budgetService.getBudgetById(this.budgetId).subscribe(budget => {
          if (budget) {
            const formBudgetValue = {
              ...budget,
              startDate: budget.startDate instanceof Date ? budget.startDate.toISOString().substring(0,10) : budget.startDate,
              endDate: budget.endDate instanceof Date ? budget.endDate.toISOString().substring(0,10) : budget.endDate,
            };
            this.budgetForm.patchValue(formBudgetValue);
          } else {
            console.error('Budget not found for editing');
            this.router.navigate(['/budgets']);
          }
        });
      } else {
         console.error('Invalid budget ID for editing');
         this.router.navigate(['/budgets']);
      }
    }
  }

  onSubmit(): void {
    if (this.budgetForm.valid) {
      const formValue = this.budgetForm.value;

      if (this.isEditMode && this.budgetId !== null) {
        this.budgetService.updateBudget(this.budgetId, formValue).subscribe({
          next: () => this.router.navigate(['/budgets']),
          error: (err) => console.error('Failed to update budget', err)
        });
      } else {
        this.budgetService.createBudget(formValue).subscribe({
          next: () => this.router.navigate(['/budgets']),
          error: (err) => console.error('Failed to create budget', err)
        });
      }
    } else {
      this.budgetForm.markAllAsTouched();
    }
  }

  get f() { return this.budgetForm.controls; }
}
