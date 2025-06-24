import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorHandlingService } from './error-handling.service';
import { HttpParams } from '@angular/common/http'; // Import HttpParams

// DTOs
import { InsightRequestDto } from '../../models/dto/insight.request.dto';
import { InsightResponseDto } from '../../models/dto/insight.response.dto';
import { WeeklySummaryResponseDto } from '../../models/dto/weekly-summary.response.dto';
// CategorySpendingDto is part of WeeklySummaryResponseDto

// Frontend Models
import { WeeklySummary } from '../../models/weekly-summary.model';
// CategorySpending model is part of WeeklySummary model

@Injectable({
  providedIn: 'root'
})
export class InsightService {

  constructor(
    private apiService: ApiService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  private mapWeeklySummaryDtoToModel(dto: WeeklySummaryResponseDto): WeeklySummary {
    return {
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      spendingByCategory: dto.spendingByCategory.map(item => ({ ...item }))
    };
  }

  public generateInsight(query: string): Observable<InsightResponseDto> {
    const requestDto: InsightRequestDto = { userQuery: query };
    return this.apiService.post<InsightResponseDto>('/v1/insights/generate', requestDto).pipe(
      catchError(err => {
        this.errorHandlingService.showMessage('Failed to generate insight. Please try again later.');
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }

  public getWeeklySummary(startDateOpt?: string, endDateOpt?: string): Observable<WeeklySummary> {
    let httpParams = new HttpParams();
    if (startDateOpt) {
      httpParams = httpParams.set('startDateOpt', startDateOpt);
    }
    if (endDateOpt) {
      httpParams = httpParams.set('endDateOpt', endDateOpt);
    }

    return this.apiService.get<WeeklySummaryResponseDto>('/v1/insights/weekly', httpParams).pipe(
      map(dto => this.mapWeeklySummaryDtoToModel(dto)),
      catchError(err => {
        this.errorHandlingService.showMessage('Failed to fetch weekly summary.');
        return throwError(() => this.errorHandlingService.handleError(err));
      })
    );
  }
}
