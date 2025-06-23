import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorHandlingService } from './error-handling.service';
import { Budget } from '../../models/budget.model';
import { BudgetResponseDto } from '../../models/dto/budget.response.dto';
import { BudgetRequestDto } from '../../models/dto/budget.request.dto';
import { HttpParams } from '@angular/common/http';

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
      id: dto.id,
      userId: dto.userId,
      categoryName: dto.categoryName,
      allocatedAmount: dto.allocatedAmount,
      month: new Date(dto.month + '-01T00:00:00Z'), // Ensures Date is UTC, first of the month
      totalMonthlyBudgetGoal: dto.totalMonthlyBudgetGoal,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  }

  // Expects budgetData.categoryId to be present for requests.
  // Expects budgetData.month to be a Date object from the form/model.
  private mapModelToRequestDto(budgetData: Partial<Omit<Budget, 'id' | 'userId' | 'categoryName' | 'createdAt' | 'updatedAt'> & { categoryId: number }>): BudgetRequestDto {
    let monthString = '';
    if (budgetData.month) {
        if (budgetData.month instanceof Date) {
            const year = budgetData.month.getFullYear();
            const month = (budgetData.month.getMonth() + 1).toString().padStart(2, '0');
            monthString = \`\${year}-\${month}\`;
        } else {
            monthString = budgetData.month as string;
        }
    }

    if (budgetData.categoryId === undefined || budgetData.categoryId === null) {
      console.warn('mapModelToRequestDto (Budget): categoryId is missing. This is required for API request.');
    }

    return {
      month: monthString,
      categoryId: budgetData.categoryId || 0, // Fallback, should be validated by form
      allocatedAmount: budgetData.allocatedAmount || 0,
      totalMonthlyBudgetGoal: budgetData.totalMonthlyBudgetGoal
    };
  }

  public getBudgets(filters?: { month?: string }): Observable<Budget[]> {
    let apiParams = new HttpParams();
    if (filters?.month && filters.month.trim() !== '') {
      apiParams = apiParams.set('month', filters.month);
    }

    return this.apiService.get<BudgetResponseDto[]>('/v1/budgets', apiParams).pipe(
      map(dtos => {
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
    return this.apiService.get<BudgetResponseDto>(\`/v1/budgets/\${id}\`).pipe(
      map(dto => dto ? this.mapDtoToModel(dto) : undefined),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to fetch budget \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public createBudget(budgetData: Partial<Omit<Budget, 'id' | 'userId' | 'categoryName' | 'createdAt' | 'updatedAt'> & { categoryId: number }>): Observable<Budget> {
    const requestDto = this.mapModelToRequestDto(budgetData);
    return this.apiService.post<BudgetResponseDto>('/v1/budgets', requestDto).pipe(
      map(dto => {
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

  public updateBudget(id: number, budgetData: Partial<Omit<Budget, 'id' | 'userId' | 'categoryName' | 'createdAt' | 'updatedAt'> & { categoryId: number }>): Observable<Budget | undefined> {
    const requestDto = this.mapModelToRequestDto(budgetData);
    return this.apiService.put<BudgetResponseDto>(\`/v1/budgets/\${id}\`, requestDto).pipe(
      map(dto => {
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
