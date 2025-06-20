import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../models/transaction.model';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'], // .component.scss
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule]
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  isEditMode = false;
  transactionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.transactionForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      type: ['expense', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.paramMap.get('id');
    if (this.transactionId) {
      this.isEditMode = true;
      this.transactionService.getTransactionById(this.transactionId).subscribe(transaction => {
        if (transaction) {
          const formDate = transaction.date.toISOString().substring(0,10);
          this.transactionForm.patchValue({...transaction, date: formDate});
        } else {
          console.error('Transaction not found for editing');
          this.router.navigate(['/transactions']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      if (this.isEditMode && this.transactionId) {
        this.transactionService.updateTransaction(this.transactionId, formValue).subscribe(() => {
          this.router.navigate(['/transactions']);
        });
      } else {
        this.transactionService.addTransaction(formValue).subscribe(() => {
          this.router.navigate(['/transactions']);
        });
      }
    }
  }
}
