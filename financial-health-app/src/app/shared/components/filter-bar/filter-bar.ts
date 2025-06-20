import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'; // ReactiveFormsModule is imported in SharedModule

// Interface for TransactionFilters is defined here or can be in a separate models file
export interface TransactionFilters {
  type?: string | null;
  category?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.html', // Original name
  styleUrls: ['./filter-bar.scss']  // Original name
})
export class FilterBarComponent {
  @Output() filtersApplied = new EventEmitter<TransactionFilters>();
  filterForm: FormGroup;
  categories: string[] = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Salary', 'Other'];
  transactionTypes: string[] = ['income', 'expense'];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      type: [null],
      category: [null],
      startDate: [null],
      endDate: [null]
    });
  }

  applyFilters(): void {
    this.filtersApplied.emit(this.filterForm.value);
  }

  resetFilters(): void {
    this.filterForm.reset({ type: null, category: null, startDate: null, endDate: null });
    this.filtersApplied.emit({});
  }
}
