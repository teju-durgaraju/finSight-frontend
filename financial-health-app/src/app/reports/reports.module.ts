import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared/shared.module';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './components/reports/reports.component';
import { SpendingTrendsChartComponent } from './components/spending-trends-chart/spending-trends-chart.component';

@NgModule({
  declarations: [
    ReportsComponent,
    SpendingTrendsChartComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    NgxChartsModule
  ]
})
export class ReportsModule { }
