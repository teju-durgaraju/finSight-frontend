import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget } from '../../../models/budget.model';
import { BudgetService } from '../../../core/services/budget.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit {
  budgets$: Observable<Budget[]>;
  selectedMonth: string = ''; // Format YYYY-MM

  constructor(
    private budgetService: BudgetService,
    private router: Router
  ) {
    this.budgets$ = this.budgetService.budgets$;
  }

  ngOnInit(): void {
    // Set initial month (e.g., current month) and load budgets
    const today = new Date();
    // Format as YYYY-MM
    this.selectedMonth = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
    this.loadBudgets();
  }

  onMonthFilterChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedMonth = inputElement.value;
    this.loadBudgets();
  }

  loadBudgets(): void {
    // Pass undefined if selectedMonth is empty, otherwise pass the filter object
    const filterParams = this.selectedMonth ? { month: this.selectedMonth } : undefined;
    this.budgetService.getBudgets(filterParams).subscribe({
      // next: (data) => console.log('Budgets loaded for month:', this.selectedMonth, data),
      // error: (err) => console.error('Error loading budgets for month:', this.selectedMonth, err)
    });
  }

  navigateToAddBudget(): void {
    this.router.navigate(['/budgets/add']);
  }

  navigateToEditBudget(budgetId: number): void {
    this.router.navigate(['/budgets/edit', budgetId]);
  }

  deleteBudget(budgetId: number): void {
    const confirmed = confirm('Are you sure you want to delete this budget?');
    if (confirmed) {
      this.budgetService.deleteBudget(budgetId).subscribe({
        next: () => {
          console.log(\`Budget \${budgetId} deleted successfully\`);
          // Optionally re-load or rely on BehaviorSubject in service to update list
          // this.loadBudgets();
        },
        error: (err) => {
          console.error(\`Error deleting budget \${budgetId}\`, err);
        }
      });
    }
  }
}
