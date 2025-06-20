import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  isEditMode = false;
  transactionId: number | null = null;
  categories$: Observable<string[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.transactionForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0.01)]],
      type: ['expense', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categories$ = this.transactionService.getCategories();

    const idParam = this.route.snapshot.paramMap.get('id');
    this.transactionId = idParam ? +idParam : null;

    // Check if transactionId is a valid number before proceeding
    if (this.transactionId !== null && !isNaN(this.transactionId)) {
      this.isEditMode = true;
      this.transactionService.getTransactionById(this.transactionId).subscribe(transaction => {
        if (transaction) {
          // Ensure date is formatted correctly for the date input (YYYY-MM-DD)
          const formDate = transaction.date instanceof Date ? transaction.date.toISOString().substring(0,10) : transaction.date;
          this.transactionForm.patchValue({...transaction, date: formDate});
        } else {
          console.error('Transaction not found for editing');
          this.router.navigate(['/transactions']);
        }
      });
    } else {
      this.isEditMode = false; // Explicitly set to false if no valid ID
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      if (this.isEditMode && this.transactionId !== null) { // Ensure transactionId is not null for update
        this.transactionService.updateTransaction(this.transactionId, formValue).subscribe(() => {
          this.router.navigate(['/transactions']);
        });
      } else {
        this.transactionService.addTransaction(formValue).subscribe(() => {
          this.router.navigate(['/transactions']);
        });
      }
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }

  get f() { return this.transactionForm.controls; }
}
