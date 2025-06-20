import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorHandlingService } from './error-handling.service';
import { Goal } from '../../models/goal.model';
import { GoalResponseDto } from '../../models/dto/goal.response.dto';
import { GoalRequestDto } from '../../models/dto/goal.request.dto';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private goalsSubject = new BehaviorSubject<Goal[]>([]);
  public goals$: Observable<Goal[]> = this.goalsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  private mapDtoToModel(dto: GoalResponseDto): Goal {
    return {
      ...dto,
      targetDate: new Date(dto.targetDate)
      // createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      // updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  }

  private mapModelToRequestDto(model: Partial<Omit<Goal, 'id'>>): GoalRequestDto {
    let targetDateString = '';
    if (model.targetDate) {
        if (model.targetDate instanceof Date) {
            targetDateString = model.targetDate.toISOString().split('T')[0];
        } else {
            targetDateString = model.targetDate as string;
        }
    }

    return {
      name: model.name || '',
      description: model.description,
      targetAmount: model.targetAmount || 0,
      currentAmount: model.currentAmount === undefined ? 0 : model.currentAmount,
      targetDate: targetDateString
    };
  }

  public getGoals(filters?: any): Observable<Goal[]> {
    let httpParams = new HttpParams();
    // Example if filters were supported:
    // if (filters?.status) httpParams = httpParams.set('status', filters.status);

    return this.apiService.get('/v1/goals', httpParams).pipe(
      map((dtos: GoalResponseDto[]) => {
        const models = dtos.map(dto => this.mapDtoToModel(dto));
        this.goalsSubject.next(models);
        return models;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage('Failed to fetch goals.');
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public getGoalById(id: number): Observable<Goal | undefined> {
    return this.apiService.get(\`/v1/goals/\${id}\`).pipe(
      map((dto: GoalResponseDto | null) => dto ? this.mapDtoToModel(dto) : undefined),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to fetch goal \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public createGoal(goalData: Partial<Omit<Goal, 'id'>>): Observable<Goal> {
    const requestDto = this.mapModelToRequestDto(goalData);
    return this.apiService.post('/v1/goals', requestDto).pipe(
      map((dto: GoalResponseDto) => {
        const newModel = this.mapDtoToModel(dto);
        const currentGoals = this.goalsSubject.value;
        this.goalsSubject.next([...currentGoals, newModel]);
        return newModel;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage('Failed to create goal.');
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public updateGoal(id: number, goalData: Partial<Omit<Goal, 'id'>>): Observable<Goal | undefined> {
    const requestDto = this.mapModelToRequestDto(goalData);
    return this.apiService.put(\`/v1/goals/\${id}\`, requestDto).pipe(
      map((dto: GoalResponseDto | null) => {
        if (!dto) return undefined;
        const updatedModel = this.mapDtoToModel(dto);
        const currentGoals = this.goalsSubject.value.map(g =>
          g.id === id ? updatedModel : g
        );
        this.goalsSubject.next(currentGoals);
        return updatedModel;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to update goal \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public deleteGoal(id: number): Observable<boolean> {
    return this.apiService.delete(\`/v1/goals/\${id}\`).pipe(
      map(() => {
        const currentGoals = this.goalsSubject.value.filter(g => g.id !== id);
        this.goalsSubject.next(currentGoals);
        return true;
      }),
      catchError(err => {
        this.errorHandlingService.showMessage(\`Failed to delete goal \${id}.\`);
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public refreshGoals(filters?: any): Observable<Goal[]> {
    return this.getGoals(filters);
  }
}
