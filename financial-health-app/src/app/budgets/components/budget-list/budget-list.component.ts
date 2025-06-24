import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget } from '../../../models/budget.model';
import { BudgetService } from '../../../core/services/budget.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../core/services/modal.service'; // Import ModalService

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit {
  budgets$: Observable<Budget[]>;
  selectedMonth: string = '';

  constructor(
    private budgetService: BudgetService,
    private router: Router,
    private modalService: ModalService // Injected ModalService
  ) {
    this.budgets$ = this.budgetService.budgets$;
    const today = new Date();
    this.selectedMonth = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0');
  }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    const filterParams = this.selectedMonth ? { month: this.selectedMonth } : undefined;
    this.budgetService.getBudgets(filterParams).subscribe();
  }

  onMonthFilterChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedMonth = inputElement.value;
    this.loadBudgets();
  }

  navigateToAddBudget(): void {
    this.router.navigate(['/budgets/add']);
  }

  navigateToEditBudget(budgetId: number): void {
    this.router.navigate(['/budgets/edit', budgetId]);
  }

  async deleteBudget(budgetId: number): Promise<void> { // Changed to async
    try {
      const confirmed = await this.modalService.confirm(
        'Delete Budget',
        'Are you sure you want to delete this budget?',
        'Delete', 'Cancel', 'btn-danger', 'btn-outline-secondary'
      );
      if (confirmed) {
        this.budgetService.deleteBudget(budgetId).subscribe({
          next: () => console.log(\`Budget \${budgetId} deleted successfully\`),
          error: (err) => console.error(\`Error deleting budget \${budgetId}\`, err)
        });
      }
    } catch (error) {
      console.log('Delete budget modal dismissed.');
    }
  }
}
