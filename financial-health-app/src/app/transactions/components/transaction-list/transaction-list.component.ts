import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../../core/services/transaction.service';
import { Router } from '@angular/router';
import { TransactionFilters } from '../../../shared/components/filter-bar/filter-bar'; // Corrected path

export interface SortConfig {
  column: keyof Transaction | 'actions' | null;
  direction: 'asc' | 'desc' | '';
}

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, OnDestroy {

  private transactionsRaw$: Observable<Transaction[]>;
  public displayedTransactions$: Observable<Transaction[]>;

  private refreshTrigger = new BehaviorSubject<void>(undefined);
  private subscriptions = new Subscription();

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalTransactions: number = 0;

  currentSort: SortConfig = { column: 'date', direction: 'desc' };
  currentFilters: TransactionFilters = {};

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {
    this.transactionsRaw$ = this.transactionService.transactions$;
    // Initialize displayedTransactions$ to apply client-side processing from the start
    this.displayedTransactions$ = this.transactionsRaw$.pipe(
      map(transactions => this.applySortAndPagination(transactions))
    );
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.refreshTrigger.pipe(
        switchMap(() => this.transactionService.getTransactions(this.currentFilters))
      ).subscribe()
    );

    this.subscriptions.add(
      this.transactionsRaw$.subscribe(transactions => {
        this.totalTransactions = transactions.length;
      })
    );
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTransactions(): void {
    this.refreshTrigger.next();
    this.currentPage = 1;
  }

  applySortAndPagination(transactions: Transaction[]): Transaction[] {
    let processed = [...transactions];
    // Apply Sorting (client-side)
    if (this.currentSort.column && this.currentSort.column !== 'actions' && this.currentSort.direction) {
      processed.sort((a, b) => {
        const valA = a[this.currentSort.column!];
        const valB = b[this.currentSort.column!];
        let comparison = 0;
        if (valA > valB) comparison = 1;
        else if (valA < valB) comparison = -1;
        return this.currentSort.direction === 'desc' ? comparison * -1 : comparison;
      });
    }
    // Apply Pagination (client-side)
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    processed = processed.slice(startIndex, startIndex + this.itemsPerPage);
    return processed;
  }

  onFiltersApplied(filters: TransactionFilters): void {
    this.currentFilters = filters;
    this.loadTransactions();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    // Trigger re-pipe of displayedTransactions$ by re-applying sort and pagination
    // This is done by transactionsRaw$ emitting and displayedTransactions$ re-evaluating
    // No, we need to re-apply the pipe if transactionsRaw$ hasn't changed but pagination has
    this.displayedTransactions$ = this.transactionsRaw$.pipe(
      map(transactions => this.applySortAndPagination(transactions))
    );
  }

  sort(column: keyof Transaction | 'actions' | null): void {
    if (!column || column === 'actions') return;
    if (this.currentSort.column === column) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.column = column;
      this.currentSort.direction = 'asc';
    }
    this.displayedTransactions$ = this.transactionsRaw$.pipe(
      map(transactions => this.applySortAndPagination(transactions))
    );
  }

  addTransaction(): void {
    this.router.navigate(['/transactions/new']);
  }

  editTransaction(id: number): void {
    this.router.navigate(['/transactions/edit', id]);
  }

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          console.log('Transaction deleted successfully');
          // The list updates via BehaviorSubject in service.
          // If getTransactions() was used for total counts or server-side pagination, might need:
          // this.loadTransactions();
        },
        error: (err) => console.error('Failed to delete transaction', err)
      });
    }
  }
}
