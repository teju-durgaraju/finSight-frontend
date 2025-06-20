import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionService } from '../../../core/services/transaction.service';
import { BudgetService } from '../../../core/services/budget.service';
import { Transaction } from '../../../models/transaction.model';
import { Budget } from '../../../models/budget.model';
import { Color, ScaleType } from '@swimlane/ngx-charts';

// Define a structure for financial summary data
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  transactions$: Observable<Transaction[]>;
  budgets$: Observable<Budget[]>;
  financialSummary$: Observable<FinancialSummary | null>;

  sampleChartData: any[] = [];
  view: [number, number] = [700, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Category';
  showYAxisLabel = true;
  yAxisLabel = 'Amount';
  colorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private transactionService: TransactionService,
    private budgetService: BudgetService
  ) {
    this.transactions$ = this.transactionService.transactions$;
    this.budgets$ = this.budgetService.budgets$;

    this.financialSummary$ = this.transactions$.pipe(
      map(transactions => {
        if (!transactions || transactions.length === 0) {
          return { totalIncome: 0, totalExpenses: 0, netSavings: 0 };
        }
        let income = 0;
        let expenses = 0;
        transactions.forEach(t => {
          if (t.type === 'income') {
            income += t.amount;
          } else {
            expenses += t.amount;
          }
        });
        return {
          totalIncome: income,
          totalExpenses: expenses,
          netSavings: income - expenses
        };
      })
    );
  }

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe();
    this.budgetService.getBudgets().subscribe();

    this.transactions$.subscribe(transactions => {
      if (transactions && transactions.length > 0) {
        const expenseSummary = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => {
            const categoryExists = acc.find(item => item.name === t.category);
            if (categoryExists) {
              categoryExists.value += t.amount;
            } else {
              acc.push({ name: t.category, value: t.amount });
            }
            return acc;
          }, [] as {name: string; value: number}[]);
        this.sampleChartData = expenseSummary.length > 0 ? expenseSummary : [{name: "No Expenses", value: 0}];
      } else {
        this.sampleChartData = [{name: "No Data", value: 0}];
      }
    });
  }
}
