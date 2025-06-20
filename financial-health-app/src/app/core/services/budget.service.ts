import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs'; // 'of' might be needed if getCategories is kept or similar mocks
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorHandlingService } from './error-handling.service';
import { Budget } from '../../models/budget.model';
import { BudgetResponseDto } from '../../models/dto/budget.response.dto';
import { BudgetRequestDto } from '../../models/dto/budget.request.dto';
import { HttpParams } from '@angular/common/http'; // Added HttpParams import

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  public budgets$: Observable<Budget[]> = this.budgetsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  private mapDtoToModel(dto: BudgetResponseDto): Budget {
    return {
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate)
    };
  }

  private mapModelToRequestDto(model: Partial<Omit<Budget, 'id' | 'amountSpent'>>): BudgetRequestDto {
    let startDateString = '';
    if (model.startDate) {
        startDateString = model.startDate instanceof Date ? model.startDate.toISOString().split('T')[0] : model.startDate as string;
    }
    let endDateString = '';
    if (model.endDate) {
        endDateString = model.endDate instanceof Date ? model.endDate.toISOString().split('T')[0] : model.endDate as string;
    }
    return {
      category: model.category || '',
      amountAllocated: model.amountAllocated || 0,
      startDate: startDateString,
      endDate: endDateString
    };
  }

  public getBudgets(filters?: { month?: string }): Observable<Budget[]> {
    let apiParams = new HttpParams(); // Use HttpParams
    if (filters?.month && filters.month.trim() !== '') {
      apiParams = apiParams.set('month', filters.month); // Use .set() for HttpParams
    }

    return this.apiService.get('/v1/budgets', apiParams).pipe(
      map((dtos: BudgetResponseDto[]) => {
        const models = dtos.map(dto => this.mapDtoToModel(dto));
        this.budgetsSubject.next(models);
        return models;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage('Failed to fetch budgets.');
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public getBudgetById(id: number): Observable<Budget | undefined> {
    return this.apiService.get(\`/v1/budgets/\${id}\`).pipe(
      map((dto: BudgetResponseDto | null) => dto ? this.mapDtoToModel(dto) : undefined),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to fetch budget \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public createBudget(budgetData: Partial<Omit<Budget, 'id' | 'amountSpent'>>): Observable<Budget> {
    const requestDto = this.mapModelToRequestDto(budgetData);
    return this.apiService.post('/v1/budgets', requestDto).pipe(
      map((dto: BudgetResponseDto) => {
        const newModel = this.mapDtoToModel(dto);
        const currentBudgets = this.budgetsSubject.value;
        this.budgetsSubject.next([...currentBudgets, newModel]);
        return newModel;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage('Failed to create budget.');
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public updateBudget(id: number, budgetData: Partial<Omit<Budget, 'id' | 'amountSpent'>>): Observable<Budget | undefined> {
    const requestDto = this.mapModelToRequestDto(budgetData);
    return this.apiService.put(\`/v1/budgets/\${id}\`, requestDto).pipe(
      map((dto: BudgetResponseDto | null) => {
        if (!dto) return undefined;
        const updatedModel = this.mapDtoToModel(dto);
        const currentBudgets = this.budgetsSubject.value.map(b =>
          b.id === id ? updatedModel : b
        );
        this.budgetsSubject.next(currentBudgets);
        return updatedModel;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to update budget \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public deleteBudget(id: number): Observable<boolean> {
    return this.apiService.delete(\`/v1/budgets/\${id}\`).pipe(
      map(() => {
        const currentBudgets = this.budgetsSubject.value.filter(b => b.id !== id);
        this.budgetsSubject.next(currentBudgets);
        return true;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to delete budget \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public refreshBudgets(filters?: { month?: string }): Observable<Budget[]> {
    return this.getBudgets(filters);
  }
}
