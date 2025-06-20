import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module'; // For common UI elements
import { NgxChartsModule } from '@swimlane/ngx-charts'; // For charts on dashboard

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FinancialSummaryCardComponent } from './components/financial-summary-card/financial-summary-card.component';
import { BudgetOverviewComponent } from './components/budget-overview/budget-overview.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';

@NgModule({
  declarations: [
    DashboardComponent,
    FinancialSummaryCardComponent,
    BudgetOverviewComponent,
    QuickActionsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxChartsModule // Import for charts
  ]
})
export class DashboardModule { }
