import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../core/services/transaction.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-financial-summary',
  templateUrl: './financial-summary.html', // Corrected
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule]
})
export class FinancialSummaryComponent implements OnInit {
  transactions$: Observable<Transaction[]>;

  constructor(private transactionService: TransactionService, private router: Router) {
    this.transactions$ = this.transactionService.getTransactions();
  }

  ngOnInit(): void {}

  addTransaction(): void {
    this.router.navigate(['/transactions/new']);
  }

  editTransaction(id: number): void {
    this.router.navigate(['/transactions/edit', id]);
  }

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe(success => {
        if (success) {
          console.log('Transaction deleted successfully');
        } else {
          console.error('Failed to delete transaction');
        }
      });
    }
  }
}
