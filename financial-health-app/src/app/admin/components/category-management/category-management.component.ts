import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Category } from '../../../models/category.model';
import { AdminCategoryRequestDto } from '../../../models/dto/admin/admin-category.request.dto';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  categories$: Observable<Category[]>;
  categoryForm: FormGroup;
  isEditMode = false;
  editingCategoryId: number | null = null;
  isLoading: boolean = false;

  categoryTypes: Array<{ value: 'INCOME' | 'EXPENSE' | 'GENERAL', label: string }> = [
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' },
    { value: 'GENERAL', label: 'General' }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private modalService: ModalService
  ) {
    this.categories$ = this.adminService.globalCategories$;

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      type: ['EXPENSE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.adminService.getGlobalCategories().subscribe({
        next: () => this.isLoading = false,
        error: (err) => {
          console.error("Error loading global categories", err);
          this.isLoading = false;
        }
    });
  }

  get f() { return this.categoryForm.controls; }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const categoryData: AdminCategoryRequestDto = this.categoryForm.value;

    if (this.isEditMode && this.editingCategoryId !== null) {
      this.adminService.updateGlobalCategory(this.editingCategoryId, categoryData).subscribe({
        next: () => {
          console.log('Category updated successfully');
          this.resetForm();
        },
        error: (err) => console.error('Error updating category', err)
      });
    } else {
      this.adminService.createGlobalCategory(categoryData).subscribe({
        next: () => {
          console.log('Category created successfully');
          this.resetForm();
        },
        error: (err) => console.error('Error creating category', err)
      });
    }
  }

  editCategory(category: Category): void {
    this.isEditMode = true;
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      type: category.type
    });
  }

  async deleteCategory(categoryId: number, categoryName: string): Promise<void> {
    try {
      const confirmed = await this.modalService.confirm(
        'Delete Category',
        \`Are you sure you want to delete category "\${categoryName}" (ID: \${categoryId})?\`,
        'Delete Category',
        'Cancel',
        'btn-danger',
        'btn-outline-secondary'
      );
      if (confirmed) {
        this.adminService.deleteGlobalCategory(categoryId).subscribe({ // Assumes this method exists and returns Observable<boolean>
          next: (success) => {
            if (success) {
              console.log(\`Category \${categoryId} deleted successfully\`);
              this.resetForm();
            } else {
              console.error(\`Failed to delete category \${categoryId}\`);
              // Potentially show error message via ErrorHandlingService or similar
            }
          },
          error: (err) => console.error(\`Error deleting category \${categoryId}\`, err)
        });
      }
    } catch (error) {
      console.log('Delete category modal dismissed.');
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.isEditMode = false;
    this.editingCategoryId = null;
    this.categoryForm.reset({ type: 'EXPENSE' });
  }
}
