import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs'; // 'of' is used by getCategories if it were here
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorHandlingService } from './error-handling.service';
import { Transaction } from '../../models/transaction.model';
import { TransactionResponseDto } from '../../models/dto/transaction.response.dto';
import { TransactionRequestDto } from '../../models/dto/transaction.request.dto';
import { HttpParams } from '@angular/common/http'; // Ensure HttpParams is imported

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
      id: dto.id,
      userId: dto.userId,
      type: dto.type,
      amount: dto.amount,
      categoryName: dto.categoryName,
      transactionDate: new Date(dto.transactionDate),
      description: dto.description,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined
    };
  }

  // Note: This now relies on 'transactionData' having 'categoryId' for requests.
  // It also expects 'transactionDate' to be part of 'transactionData' if a date is involved.
  private mapModelToRequestDto(transactionData: Partial<Transaction & { categoryId: number }>): TransactionRequestDto {
    let dateString = '';
    if (transactionData.transactionDate) {
        if (transactionData.transactionDate instanceof Date) {
            dateString = transactionData.transactionDate.toISOString().split('T')[0];
        } else {
            dateString = transactionData.transactionDate as string;
        }
    }

    if (transactionData.categoryId === undefined || transactionData.categoryId === null) {
      console.warn('mapModelToRequestDto: categoryId is missing. This is required for API request.');
      // Potentially throw error or use a default if backend allows, though DTO implies it's required.
    }

    const typeValue = transactionData.type?.toUpperCase() as 'INCOME' | 'EXPENSE';
    if (typeValue !== 'INCOME' && typeValue !== 'EXPENSE') {
        console.warn('mapModelToRequestDto: type is invalid in transactionData. Defaulting to EXPENSE.');
        // This default might not be appropriate; form validation should ensure correct type.
    }

    return {
      transactionDate: dateString,
      description: transactionData.description,
      amount: transactionData.amount || 0,
      type: typeValue || 'EXPENSE',
      categoryId: transactionData.categoryId || 0 // Fallback to 0, DTO requires number. Backend should validate.
    };
  }

  public getTransactions(filters?: { type?: 'INCOME' | 'EXPENSE'; category?: string; startDate?: string; endDate?: string }): Observable<Transaction[]> {
    let httpParams = new HttpParams();
    if (filters?.type) httpParams = httpParams.set('type', filters.type);
    // API spec implies filtering by category name (string) for GET, but uses categoryId (number) for POST/PUT.
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
    return this.apiService.get<TransactionResponseDto>(\`/v1/transactions/\${id}\`).pipe(
      map((dto: TransactionResponseDto | null) => dto ? this.mapDtoToModel(dto) : undefined),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to fetch transaction \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  // Input 'transactionData' should have 'categoryId' and other fields matching Transaction model structure (after user input)
  public addTransaction(transactionData: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'categoryName' > & { categoryId: number }>): Observable<Transaction> {
    const requestDto = this.mapModelToRequestDto(transactionData);
    return this.apiService.post<TransactionResponseDto>('/v1/transactions', requestDto).pipe(
      map(dto => {
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

  public updateTransaction(id: number, transactionData: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'categoryName'> & { categoryId: number }>): Observable<Transaction | undefined> {
    const requestDto = this.mapModelToRequestDto(transactionData);
    return this.apiService.put<TransactionResponseDto>(\`/v1/transactions/\${id}\`, requestDto).pipe(
      map(dto => {
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

  public refreshTransactions(filters?: { type?: 'INCOME' | 'EXPENSE'; category?: string; startDate?: string; endDate?: string }): Observable<Transaction[]> {
    return this.getTransactions(filters);
  }

  // getCategories() is removed. A dedicated CategoryService will be introduced later.
}
