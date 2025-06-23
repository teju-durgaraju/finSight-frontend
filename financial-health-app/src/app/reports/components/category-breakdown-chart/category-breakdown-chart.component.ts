import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../models/transaction.model';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { map, catchError } from 'rxjs/operators'; // Added catchError
import { Observable, of } from 'rxjs';

// Interface for chart data points (name-value pairs)
export interface NameValueDataPoint {
  name: string;
  value: number;
}

@Component({
  selector: 'app-category-breakdown-chart',
  templateUrl: './category-breakdown-chart.component.html',
  styleUrls: ['./category-breakdown-chart.component.scss']
})
export class CategoryBreakdownChartComponent implements OnInit {
  categorySpendingData$: Observable<NameValueDataPoint[]> = of([]);
  isLoading: boolean = true;

  // Chart options for Pie Chart
  // view: [number, number] = [700, 380]; // Default view size, commented out for responsiveness
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below'; // Changed legend position
  colorScheme: Color = {
    name: 'vivid', // Example color scheme
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#3B5998', '#FF0000', '#00FF00', '#0000FF', '#FF8C00', '#8A2BE2']
  };

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    // Fetch expenses for a default period (e.g., last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29); // 30 days of data

    this.isLoading = true;
    this.categorySpendingData$ = this.transactionService.getTransactions({
      type: 'EXPENSE',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }).pipe(
      map(transactions => {
        this.isLoading = false;
        return this.processTransactionsForPieChart(transactions);
      }),
      catchError(error => {
        console.error('Error fetching transactions for category breakdown chart:', error);
        this.isLoading = false;
        return of([]); // Return empty data on error
      })
    );
  }

  private processTransactionsForPieChart(transactions: Transaction[]): NameValueDataPoint[] {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const spendingByCategory: { [key: string]: number } = {};
    transactions.forEach(t => {
      // Use categoryName from the Transaction model (updated in Step 3)
      const categoryKey = t.categoryName || 'Uncategorized';
      spendingByCategory[categoryKey] = (spendingByCategory[categoryKey] || 0) + t.amount;
    });

    return Object.keys(spendingByCategory).map(category => ({
      name: category,
      value: spendingByCategory[category]
    }));
  }

  // onSelect(event: any): void {
  //   console.log('Item selected', event);
  // }
}
