import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-financial-summary',
  templateUrl: './financial-summary.html', // Should be financial-summary.html
  // styleUrls: ['./financial-summary.scss'], // Check if financial-summary.scss exists
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FinancialSummaryComponent implements OnInit {
  transactions: Transaction[] = [];
  mockTransactions: Transaction[] = [
    { id: '1', date: new Date('2024-07-01'), description: 'Groceries', amount: 75.50, type: 'expense', category: 'Food' },
    { id: '2', date: new Date('2024-07-01'), description: 'Salary', amount: 2500, type: 'income', category: 'Job' },
    { id: '3', date: new Date('2024-07-02'), description: 'Coffee', amount: 4.20, type: 'expense', category: 'Food' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.transactions = this.mockTransactions;
  }

  addTransaction(): void {
    this.router.navigate(['/transactions/new']);
  }
}
