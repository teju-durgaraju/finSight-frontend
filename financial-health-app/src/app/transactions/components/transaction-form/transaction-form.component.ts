import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { take, switchMap, filter } from 'rxjs/operators';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit, OnDestroy {
  transactionForm: FormGroup;
  isEditMode = false;
  transactionId: number | null = null;
  categories$: Observable<Category[]> = of([]);
  private typeChangeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.transactionForm = this.fb.group({
      type: ['EXPENSE', Validators.required],
      transactionDate: ['', Validators.required], // Aligned with model/DTO
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0.01)]],
      category: [null, Validators.required] // Stores categoryId
    });
  }

  ngOnInit(): void {
    const initialType = (this.transactionForm.get('type')?.value || 'EXPENSE') as 'INCOME' | 'EXPENSE';
    this.categories$ = this.categoryService.getCategories(initialType);

    this.typeChangeSubscription = this.transactionForm.get('type')?.valueChanges.subscribe((typeValue: 'INCOME' | 'EXPENSE') => {
      this.categories$ = this.categoryService.getCategories(typeValue);
      this.transactionForm.get('category')?.setValue(null);
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.transactionId = +idParam;

      if (this.transactionId !== null && !isNaN(this.transactionId)) {
        this.transactionService.getTransactionById(this.transactionId).pipe(
          filter((transaction): transaction is Transaction => { // Type guard
            if (!transaction) {
              console.error('Transaction not found for editing');
              this.router.navigate(['/transactions']);
              return false;
            }
            if (!transaction.transactionDate) {
              console.error('Transaction date is missing for editing');
              this.router.navigate(['/transactions']);
              return false;
            }
            return true;
          }),
          switchMap(transaction => {
            const transactionType = transaction.type || 'EXPENSE';
            if (this.transactionForm.get('type')?.value !== transactionType) {
                 this.transactionForm.get('type')?.setValue(transactionType, { emitEvent: false });
            }
            return this.categoryService.getCategories(transactionType).pipe(
              take(1),
              map(categories => ({ transaction, categories }))
            );
          })
        ).subscribe(result => {
          // result could be null if filter above returned false, but type guard prevents that here.
          // However, if switchMap doesn't emit due to an empty categories$ observable before take(1), result might not emit.
          // It's safer to check result.
          if (result && result.transaction) {
            const { transaction, categories } = result;
            const formDate = transaction.transactionDate instanceof Date
                             ? transaction.transactionDate.toISOString().substring(0,10)
                             : transaction.transactionDate.toString();

            // Use transaction.categoryId if available (from Step 8 model update), else lookup by name
            const categoryIdToPatch = transaction.categoryId !== undefined
                                      ? transaction.categoryId
                                      : (categories.find(cat => cat.name === transaction.categoryName)?.id || null);

            this.transactionForm.patchValue({
              type: transaction.type,
              transactionDate: formDate,
              description: transaction.description,
              amount: transaction.amount,
              category: categoryIdToPatch
            });
          }
        });
      } else {
        console.error('Invalid Transaction ID for editing');
        this.isEditMode = false;
        this.router.navigate(['/transactions']);
      }
    } else {
      this.isEditMode = false;
    }
  }

  ngOnDestroy(): void {
    if (this.typeChangeSubscription) {
      this.typeChangeSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const dataToSave = {
        type: formValue.type,
        transactionDate: formValue.transactionDate,
        description: formValue.description,
        amount: formValue.amount,
        categoryId: formValue.category
      };

      if (this.isEditMode && this.transactionId !== null) {
        this.transactionService.updateTransaction(this.transactionId, dataToSave).subscribe({
          next: () => this.router.navigate(['/transactions']),
          error: (err) => console.error('Failed to update transaction', err)
        });
      } else {
        this.transactionService.addTransaction(dataToSave).subscribe({
          next: () => this.router.navigate(['/transactions']),
          error: (err) => console.error('Failed to add transaction', err)
        });
      }
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }

  get f() { return this.transactionForm.controls; }
}
