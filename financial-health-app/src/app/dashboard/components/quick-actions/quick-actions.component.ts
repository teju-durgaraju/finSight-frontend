import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss']
})
export class QuickActionsComponent {
  constructor(private router: Router) {}

  navigateToAddTransaction(): void {
    this.router.navigate(['/transactions/new']);
  }

  navigateToSetBudget(): void {
    this.router.navigate(['/budgets']);
    console.log('Navigate to Set Budget page - (placeholder)');
  }

  navigateToViewReports(): void {
    this.router.navigate(['/reports']);
    console.log('Navigate to View Reports page - (placeholder)');
  }
}
