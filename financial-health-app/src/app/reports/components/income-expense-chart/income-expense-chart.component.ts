import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../models/transaction.model';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface GroupedBarChartData {
  name: string; // e.g., Month
  series: {
    name: string; // 'Income' or 'Expenses'
    value: number;
  }[];
}

@Component({
  selector: 'app-income-expense-chart',
  templateUrl: './income-expense-chart.component.html',
  styleUrls: ['./income-expense-chart.component.scss']
})
export class IncomeExpenseChartComponent implements OnInit {
  incomeExpenseData$: Observable<GroupedBarChartData[]> = of([]);
  isLoading: boolean = true;

  // Chart options for Grouped Vertical Bar Chart
  // view: [number, number] = [700, 380]; // Default view size, commented out for responsiveness
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendTitle: string = 'Legend';
  legendPosition: any = 'below';
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Amount';
  colorScheme: Color = {
    name: 'incomeExpense',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C'] // Green for Income, Red for Expenses, Yellow for Net (if added)
  };

  yAxisTickFormattingFn = (val: any) => val.toLocaleString(); // For basic number formatting

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 5);
    startDate.setDate(1);

    this.isLoading = true;
    this.incomeExpenseData$ = this.transactionService.getTransactions({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }).pipe(
      map(transactions => {
        this.isLoading = false;
        return this.processTransactionsForGroupedBarChart(transactions, startDate, endDate);
      }),
      catchError(error => {
        console.error('Error fetching transactions for income/expense chart:', error);
        this.isLoading = false;
        return of([]);
      })
    );
  }

  private processTransactionsForGroupedBarChart(transactions: Transaction[], overallStartDate: Date, overallEndDate: Date): GroupedBarChartData[] {
    if (!transactions) {
      return [];
    }

    const monthlyData: { [monthYear: string]: { income: number; expenses: number } } = {};

    // Initialize all months in the range
    let loopEndDate = new Date(overallEndDate); // Create a new date object for loop end
    loopEndDate.setDate(1); // Ensure we iterate up to the first of the end month

    for (let d = new Date(overallStartDate); d <= loopEndDate; d.setMonth(d.getMonth() + 1)) {
        const monthYearKey = \`\${d.getFullYear()}-\${(d.getMonth() + 1).toString().padStart(2, '0')}\`;
        monthlyData[monthYearKey] = { income: 0, expenses: 0 };
        // Break if year exceeds overallEndDate's year to prevent infinite loop with month setting
        if (d.getFullYear() > overallEndDate.getFullYear() || (d.getFullYear() === overallEndDate.getFullYear() && d.getMonth() >= overallEndDate.getMonth())) {
            break;
        }
    }

    transactions.forEach(t => {
      const date = (t.transactionDate instanceof Date) ? t.transactionDate : new Date(t.transactionDate);
      const monthYear = \`\${date.getFullYear()}-\${(date.getMonth() + 1).toString().padStart(2, '0')}\`;

      if (monthlyData[monthYear]) {
          if (t.type === 'INCOME') {
            monthlyData[monthYear].income += t.amount;
          } else if (t.type === 'EXPENSE') {
            monthlyData[monthYear].expenses += t.amount;
          }
      }
    });

    const chartData: GroupedBarChartData[] = Object.keys(monthlyData)
      .map(monthYear => ({
        name: this.formatMonthYearForDisplay(monthYear),
        series: [
          { name: 'Income', value: monthlyData[monthYear].income },
          { name: 'Expenses', value: monthlyData[monthYear].expenses }
        ]
      }))
      .sort((a, b) => {
        // Convert 'MMM YYYY' back to a comparable date for sorting
        const dateAVal = new Date(a.name.split(" ")[1] + "-" + this.monthNameToNumber(a.name.split(" ")[0]) + "-01");
        const dateBVal = new Date(b.name.split(" ")[1] + "-" + this.monthNameToNumber(b.name.split(" ")[0]) + "-01");
        return dateAVal.getTime() - dateBVal.getTime();
      });

    return chartData;
  }

  private formatMonthYearForDisplay(monthYear: string): string {
    const [year, month] = monthYear.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  private monthNameToNumber(monthName: string): string {
    const months: { [key: string]: string } = {'Jan':'01', 'Feb':'02', 'Mar':'03', 'Apr':'04', 'May':'05', 'Jun':'06', 'Jul':'07', 'Aug':'08', 'Sep':'09', 'Oct':'10', 'Nov':'11', 'Dec':'12'};
    return months[monthName] || '01';
  }
}
