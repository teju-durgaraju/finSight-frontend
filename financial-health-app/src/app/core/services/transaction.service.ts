import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // find operator is usually directly on array, map is for observable
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions$: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);
  private mockTransactions: Transaction[] = [
    { id: '1', date: new Date('2023-10-01'), description: 'Initial Salary', amount: 3000, type: 'income', category: 'Job' },
    { id: '2', date: new Date('2023-10-02'), description: 'Groceries from Mock', amount: 150, type: 'expense', category: 'Food' },
    { id: '3', date: new Date('2023-10-03'), description: 'Internet Bill', amount: 60, type: 'expense', category: 'Utilities' },
    { id: '4', date: new Date('2023-10-03'), description: 'Book Purchase', amount: 25, type: 'expense', category: 'Entertainment' }
  ];

  constructor() {
    this.transactions$.next([...this.mockTransactions]);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$.asObservable();
  }

  getTransactionById(id: string): Observable<Transaction | undefined> {
    return this.transactions$.pipe(
      map(transactions => transactions.find(t => t.id === id))
    );
  }

  // Ensure input 'date' is string as it comes from form, convert to Date obj internally
  addTransaction(transactionData: Omit<Transaction, 'id' | 'date'> & { date: string }): Observable<Transaction> {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      date: new Date(transactionData.date)
    };
    this.mockTransactions.push(newTransaction);
    this.transactions$.next([...this.mockTransactions]);
    return of(newTransaction);
  }

  updateTransaction(id: string, updateData: Partial<Omit<Transaction, 'id' | 'date'> & { date?: string }>): Observable<Transaction | undefined> {
    let updatedTransaction: Transaction | undefined;
    this.mockTransactions = this.mockTransactions.map(t => {
      if (t.id === id) {
        const date = updateData.date ? new Date(updateData.date) : t.date;
        updatedTransaction = { ...t, ...updateData, date };
        return updatedTransaction;
      }
      return t;
    });
    if (updatedTransaction) {
      this.transactions$.next([...this.mockTransactions]);
      return of(updatedTransaction);
    }
    return of(undefined);
  }

  deleteTransaction(id: string): Observable<boolean> {
    const initialLength = this.mockTransactions.length;
    this.mockTransactions = this.mockTransactions.filter(t => t.id !== id);
    if (this.mockTransactions.length < initialLength) {
      this.transactions$.next([...this.mockTransactions]);
      return of(true);
    }
    return of(false);
  }
}
