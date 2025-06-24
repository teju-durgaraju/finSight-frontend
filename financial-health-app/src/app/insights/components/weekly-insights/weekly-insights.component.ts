import { Component, OnInit } from '@angular/core';
import { InsightService } from '../../../core/services/insight.service';
import { WeeklySummary } from '../../../models/weekly-summary.model';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-weekly-insights',
  templateUrl: './weekly-insights.component.html',
  styleUrls: ['./weekly-insights.component.scss']
})
export class WeeklyInsightsComponent implements OnInit {
  weeklySummary$: Observable<WeeklySummary | null> = of(null);
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // TODO: Implement date selection for fetching different weeks
  // selectedStartDate?: string;
  // selectedEndDate?: string;

  constructor(private insightService: InsightService) {}

  ngOnInit(): void {
    this.fetchWeeklySummary();
  }

  fetchWeeklySummary(startDate?: string, endDate?: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    // For initial load without date pickers, call without params to get default week from backend
    this.weeklySummary$ = this.insightService.getWeeklySummary(startDate, endDate).pipe(
      finalize(() => this.isLoading = false),
      catchError(err => {
        console.error('Error fetching weekly summary:', err);
        this.errorMessage = 'Could not load weekly summary. Please try again later.';
        return of(null);
      })
    );
  }
}
