import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../models/transaction.model';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface ChartDataPoint {
  name: string; // Typically date or label
  value: number;
}

export interface ChartSeries {
  name: string; // Series name (e.g., 'Spending')
  series: ChartDataPoint[];
}

@Component({
  selector: 'app-spending-trends-chart',
  templateUrl: './spending-trends-chart.component.html',
  styleUrls: ['./spending-trends-chart.component.scss']
})
export class SpendingTrendsChartComponent implements OnInit {
  spendingData$: Observable<ChartSeries[]> = of([]);

  // Chart options
  view: [number, number] = [700, 350];
  legend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Amount Spent';
  timeline: boolean = true;
  colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29); // 30 days of data

    this.spendingData$ = this.transactionService.getTransactions({
      type: 'EXPENSE',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }).pipe(
      map(transactions => this.processTransactionsForChart(transactions, startDate, endDate))
    );
  }

  private processTransactionsForChart(transactions: Transaction[], startDate: Date, endDate: Date): ChartSeries[] {
    if (!transactions) {
      return [{ name: 'Spending', series: [] }];
    }

    const dailySpending: Map<string, number> = new Map();
    // Initialize all dates in the range to 0 spending to ensure continuity on the chart
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dailySpending.set(d.toISOString().split('T')[0], 0);
    }

    transactions.forEach(t => {
      // Ensure transactionDate is a Date object for reliable formatting
      const dateKey = (t.transactionDate instanceof Date)
                      ? t.transactionDate.toISOString().split('T')[0]
                      : new Date(t.transactionDate).toISOString().split('T')[0];
      if (dailySpending.has(dateKey)) { // Only include if within the 30-day range
        dailySpending.set(dateKey, (dailySpending.get(dateKey) || 0) + t.amount);
      }
    });

    const chartDataPoints: ChartDataPoint[] = Array.from(dailySpending.entries())
      .map(([date, amount]) => ({
        name: date,
        value: amount
      }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    return [{ name: 'Spending', series: chartDataPoints }];
  }

  // Custom date formatting for x-axis ticks
  dateTickFormatting(val: string): string {
    return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
