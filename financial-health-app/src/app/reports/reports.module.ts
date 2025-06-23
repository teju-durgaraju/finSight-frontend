import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared/shared.module'; // For app-loading-spinner

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './components/reports/reports.component';
import { SpendingTrendsChartComponent } from './components/spending-trends-chart/spending-trends-chart.component';
import { CategoryBreakdownChartComponent } from './components/category-breakdown-chart/category-breakdown-chart.component';
import { IncomeExpenseChartComponent } from './components/income-expense-chart/income-expense-chart.component';

@NgModule({
  declarations: [
    ReportsComponent,
    SpendingTrendsChartComponent,
    CategoryBreakdownChartComponent,
    IncomeExpenseChartComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    NgxChartsModule
  ]
})
export class ReportsModule { }
