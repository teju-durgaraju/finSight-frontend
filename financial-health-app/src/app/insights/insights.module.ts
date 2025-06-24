import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // For FinancialTipsComponent

import { InsightsRoutingModule } from './insights-routing.module';
import { SharedModule } from '../../shared/shared.module'; // For shared components, pipes, directives

// Components to be declared
import { InsightsComponent } from './components/insights/insights.component';
import { FinancialTipsComponent } from './components/financial-tips/financial-tips.component';
import { WeeklyInsightsComponent } from './components/weekly-insights/weekly-insights.component';

@NgModule({
  declarations: [
    InsightsComponent,
    FinancialTipsComponent,
    WeeklyInsightsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,      // Needed for FinancialTipsComponent
    InsightsRoutingModule,    // The module's own routing
    SharedModule              // For app-lucide-icon, app-loading-spinner etc.
  ]
  // No exports needed as components are routed to or used within InsightsComponent.
})
export class InsightsModule { }
