import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorHandlingService } from './error-handling.service';
import { Transaction } from '../../models/transaction.model';
import { TransactionResponseDto } from '../../models/dto/transaction.response.dto';
import { TransactionRequestDto } from '../../models/dto/transaction.request.dto';
import { HttpParams } from '@angular/common/http'; // Import HttpParams

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$: Observable<Transaction[]> = this.transactionsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  private mapDtoToModel(dto: TransactionResponseDto): Transaction {
    return {
      ...dto,
      date: new Date(dto.date)
    };
  }

  private mapModelToRequestDto(model: Partial<Omit<Transaction, 'id'>>): TransactionRequestDto {
    let dateString = '';
    if (model.date) {
        if (model.date instanceof Date) {
            dateString = model.date.toISOString().split('T')[0];
        } else {
            dateString = model.date as string; // Assume it's already a string in 'YYYY-MM-DD'
        }
    }

    return {
      date: dateString,
      description: model.description || '',
      amount: model.amount || 0,
      type: model.type || 'expense',
      category: model.category || ''
    };
  }

  public getTransactions(filters?: { type?: string; category?: string; startDate?: string; endDate?: string }): Observable<Transaction[]> {
    let httpParams = new HttpParams();
    if (filters?.type) httpParams = httpParams.set('type', filters.type);
    if (filters?.category) httpParams = httpParams.set('category', filters.category);
    if (filters?.startDate) httpParams = httpParams.set('startDate', filters.startDate);
    if (filters?.endDate) httpParams = httpParams.set('endDate', filters.endDate);

    return this.apiService.get('/v1/transactions', httpParams).pipe(
      map((dtos: TransactionResponseDto[]) => {
        const models = dtos.map(dto => this.mapDtoToModel(dto));
        this.transactionsSubject.next(models);
        return models;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage('Failed to fetch transactions.');
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public getTransactionById(id: number): Observable<Transaction | undefined> {
    return this.apiService.get(\`/v1/transactions/\${id}\`).pipe(
      map((dto: TransactionResponseDto | null) => dto ? this.mapDtoToModel(dto) : undefined),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to fetch transaction \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public addTransaction(transactionData: Partial<Omit<Transaction, 'id'>>): Observable<Transaction> {
    const requestDto = this.mapModelToRequestDto(transactionData);
    return this.apiService.post('/v1/transactions', requestDto).pipe(
      map((dto: TransactionResponseDto) => {
        const newModel = this.mapDtoToModel(dto);
        const currentTransactions = this.transactionsSubject.value;
        this.transactionsSubject.next([...currentTransactions, newModel]);
        return newModel;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage('Failed to add transaction.');
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public updateTransaction(id: number, transactionData: Partial<Omit<Transaction, 'id'>>): Observable<Transaction | undefined> {
    const requestDto = this.mapModelToRequestDto(transactionData);
    return this.apiService.put(\`/v1/transactions/\${id}\`, requestDto).pipe(
      map((dto: TransactionResponseDto | null) => {
        if (!dto) return undefined;
        const updatedModel = this.mapDtoToModel(dto);
        const currentTransactions = this.transactionsSubject.value.map(t =>
          t.id === id ? updatedModel : t
        );
        this.transactionsSubject.next(currentTransactions);
        return updatedModel;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to update transaction \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public deleteTransaction(id: number): Observable<boolean> {
    return this.apiService.delete(\`/v1/transactions/\${id}\`).pipe(
      map(() => {
        const currentTransactions = this.transactionsSubject.value.filter(t => t.id !== id);
        this.transactionsSubject.next(currentTransactions);
        return true;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to delete transaction \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public refreshTransactions(filters?: { type?: string; category?: string; startDate?: string; endDate?: string }): Observable<Transaction[]> {
    return this.getTransactions(filters);
  }
}
