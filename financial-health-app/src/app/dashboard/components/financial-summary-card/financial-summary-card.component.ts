import { Component, Input } from '@angular/core';
import { FinancialSummary } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-financial-summary-card',
  templateUrl: './financial-summary-card.component.html',
  styleUrls: ['./financial-summary-card.component.scss']
})
export class FinancialSummaryCardComponent {
  @Input() summary: FinancialSummary | null = null;

  constructor() {}
}
