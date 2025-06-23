import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, switchMap, filter } from 'rxjs/operators';
import { BudgetService } from '../../../core/services/budget.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../models/category.model';
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
  categories$: Observable<Category[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.budgetForm = this.fb.group({
      category: [null, Validators.required],
      allocatedAmount: ['', [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      month: ['', Validators.required],
      totalMonthlyBudgetGoal: [null, [Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

  ngOnInit(): void {
    // Budgets are typically for expenses.
    this.categories$ = this.categoryService.getCategories('EXPENSE');

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.budgetId = +idParam;

      if (this.budgetId !== null && !isNaN(this.budgetId)) {
        this.budgetService.getBudgetById(this.budgetId).pipe(
          filter((budget): budget is Budget => { // Type guard
            if (!budget) {
              console.error('Budget not found for editing');
              this.router.navigate(['/budgets']);
              return false;
            }
            if (!budget.month) { // Budget model's month is Date
              console.error('Budget month is missing for editing');
              this.router.navigate(['/budgets']);
              return false;
            }
            return true;
          }),
          switchMap(budget => {
            // Categories for budgets are typically 'EXPENSE' type, already fetched.
            return this.categories$.pipe(
              take(1),
              map(categories => ({ budget, categories }))
            );
          })
        ).subscribe(result => {
          // result could be null if filter above returned false, but type guard prevents that.
          if (result && result.budget) {
            const { budget, categories } = result;
            const formMonth = budget.month instanceof Date
                              ? budget.month.toISOString().substring(0,7) // YYYY-MM
                              : budget.month.toString();

            // Use budget.categoryId if available (from Step 8 model update), else lookup by name
            const categoryIdToPatch = budget.categoryId !== undefined
                                      ? budget.categoryId
                                      : (categories.find(cat => cat.name === budget.categoryName)?.id || null);

            this.budgetForm.patchValue({
              category: categoryIdToPatch,
              allocatedAmount: budget.allocatedAmount,
              month: formMonth,
              totalMonthlyBudgetGoal: budget.totalMonthlyBudgetGoal
            });
          }
        });
      } else {
        console.error('Invalid Budget ID for editing');
        this.isEditMode = false;
        this.router.navigate(['/budgets']);
      }
    } else {
      this.isEditMode = false;
    }
  }

  onSubmit(): void {
    if (this.budgetForm.valid) {
      const formValue = this.budgetForm.value;
      const dataToSave = {
        categoryId: formValue.category,
        allocatedAmount: formValue.allocatedAmount,
        month: formValue.month,
        totalMonthlyBudgetGoal: formValue.totalMonthlyBudgetGoal
        // Ensure this structure matches what BudgetService expects,
        // particularly that `month` is a "YYYY-MM" string from the form.
      };

      if (this.isEditMode && this.budgetId !== null) {
        this.budgetService.updateBudget(this.budgetId, dataToSave).subscribe({
          next: () => this.router.navigate(['/budgets']),
          error: (err) => console.error('Failed to update budget', err)
        });
      } else {
        this.budgetService.createBudget(dataToSave).subscribe({
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
