import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
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
    this.categories$ = this.categoryService.getCategories('EXPENSE');

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.budgetId = +idParam;
      if (this.budgetId !== null && !isNaN(this.budgetId)) {
        this.budgetService.getBudgetById(this.budgetId).subscribe(budget => {
          if (budget && budget.month) {
            const formMonth = budget.month instanceof Date
                              ? budget.month.toISOString().substring(0,7)
                              : budget.month.toString();

            this.categories$.pipe(take(1)).subscribe(categories => {
              // Assuming Budget model now has categoryId (as per Step 8 of overall plan)
              const selectedCategoryObj = categories.find(cat => cat.name === budget.categoryName);
              const categoryIdToPatch = budget.categoryId || (selectedCategoryObj ? selectedCategoryObj.id : null);

              this.budgetForm.patchValue({
                category: categoryIdToPatch, // This is categoryId
                allocatedAmount: budget.allocatedAmount,
                month: formMonth,
                totalMonthlyBudgetGoal: budget.totalMonthlyBudgetGoal
              });
            });
          } else {
            console.error('Budget not found or missing month for editing');
            this.router.navigate(['/budgets']);
          }
        });
      } else {
        console.error('Invalid Budget ID for editing');
        this.router.navigate(['/budgets']);
        this.isEditMode = false; // Ensure isEditMode is false if ID is invalid
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
