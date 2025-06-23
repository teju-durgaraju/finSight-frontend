import { Component, OnInit, OnDestroy } from '@angular/core'; // Added OnDestroy
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs'; // Added Subscription
import { take } from 'rxjs/operators';
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
  private typeChangeSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.transactionForm = this.fb.group({
      type: ['EXPENSE', Validators.required],
      transactionDate: ['', Validators.required], // Renamed from 'date'
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0.01)]],
      category: [null, Validators.required] // Stores categoryId
    });
  }

  ngOnInit(): void {
    // Update categories when transaction type changes
    this.typeChangeSubscription = this.transactionForm.get('type')?.valueChanges.subscribe(typeValue => {
      const typeForFilter = typeValue === 'INCOME' ? 'INCOME' : 'EXPENSE';
      this.categories$ = this.categoryService.getCategories(typeForFilter);
      this.transactionForm.get('category')?.setValue(null);
    });

    // Initial category load based on default form type
    const initialType = this.transactionForm.get('type')?.value === 'INCOME' ? 'INCOME' : 'EXPENSE';
    this.categories$ = this.categoryService.getCategories(initialType);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.transactionId = +idParam;
      if (this.transactionId !== null && !isNaN(this.transactionId)) {
        this.transactionService.getTransactionById(this.transactionId).subscribe(transaction => {
          if (transaction && transaction.transactionDate) {
            const formDate = transaction.transactionDate instanceof Date
                             ? transaction.transactionDate.toISOString().substring(0,10)
                             : transaction.transactionDate.toString(); // Should be string from model if not Date (though model is Date)

            this.categories$.pipe(take(1)).subscribe(categories => {
              // transaction.categoryId should be populated if Step 8 (model update) ran correctly
              const categoryIdToPatch = transaction.categoryId ||
                                        categories.find(cat => cat.name === transaction.categoryName)?.id ||
                                        null;

              this.transactionForm.patchValue({
                type: transaction.type,
                transactionDate: formDate, // Use new form control name
                description: transaction.description,
                amount: transaction.amount,
                category: categoryIdToPatch // This is categoryId
              });
            });
          } else {
            console.error('Transaction not found or missing date for editing');
            this.router.navigate(['/transactions']);
          }
        });
      } else {
        console.error('Invalid Transaction ID for editing');
        this.router.navigate(['/transactions']);
        this.isEditMode = false; // Ensure isEditMode is false if ID is invalid
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
