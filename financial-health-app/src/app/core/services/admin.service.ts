import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorHandlingService } from './error-handling.service';
import { HttpParams } from '@angular/common/http';

// Conceptual Admin Models & DTOs
import { AdminUser } from '../../models/admin/user.model';
import { UserResponseDto } from '../../models/dto/admin/user.response.dto';
import { UpdateUserRolesRequestDto } from '../../models/dto/admin/update-user-roles.request.dto';
import { AdminCategoryRequestDto } from '../../models/dto/admin/admin-category.request.dto';
import { Category } from '../../models/category.model';
import { CategoryResponseDto } from '../../models/dto/category.response.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private mockAdminUsers: AdminUser[] = [
    { id: 1, username: 'admin_user', email: 'admin@example.com', roles: ['ROLE_ADMIN', 'ROLE_USER'], createdAt: new Date(Date.now() - 100000000), isEnabled: true, lastLogin: new Date(Date.now() - 500000) },
    { id: 2, username: 'regular_user', email: 'user@example.com', roles: ['ROLE_USER'], createdAt: new Date(Date.now() - 200000000), isEnabled: true, lastLogin: new Date(Date.now() - 600000) },
    { id: 3, username: 'test_user_disabled', email: 'disabled@example.com', roles: ['ROLE_USER'], createdAt: new Date(Date.now() - 300000000), isEnabled: false, lastLogin: new Date(Date.now() - 700000) }
  ];
  private adminUsersSubject = new BehaviorSubject<AdminUser[]>([...this.mockAdminUsers]);
  public adminUsers$: Observable<AdminUser[]> = this.adminUsersSubject.asObservable();

  private mockGlobalCategories: Category[] = [
    { id: 100, name: 'Global Expense - Rent', type: 'EXPENSE' },
    { id: 101, name: 'Global Income - Dividends', type: 'INCOME' },
    { id: 102, name: 'Global General - Miscellaneous', type: 'GENERAL' }
  ];
  private globalCategoriesSubject = new BehaviorSubject<Category[]>([...this.mockGlobalCategories]);
  public globalCategories$: Observable<Category[]> = this.globalCategoriesSubject.asObservable();


  constructor(
    private apiService: ApiService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  // --- User Management ---
  private mapUserDtoToModel(dto: UserResponseDto): AdminUser {
    return {
      id: dto.id,
      username: dto.username,
      email: dto.email,
      roles: dto.roles || [],
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      lastLogin: dto.lastLogin ? new Date(dto.lastLogin) : undefined,
      isEnabled: dto.isEnabled === undefined ? true : dto.isEnabled
    };
  }

  getUsers(): Observable<AdminUser[]> {
    // Conceptual API: GET /api/v1/admin/users - Replace mock with API call when ready
    // For now, return mock data
    this.adminUsersSubject.next([...this.mockAdminUsers]);
    return this.adminUsers$;
    // Example API call structure:
    // return this.apiService.get<UserResponseDto[]>('/v1/admin/users', new HttpParams()).pipe(
    //   map(dtos => dtos.map(dto => this.mapUserDtoToModel(dto))),
    //   tap(users => this.adminUsersSubject.next(users)),
    //   catchError(err => this.handleErrorWithMessage(err, 'Failed to fetch users.', this.mockAdminUsers))
    // );
  }

  updateUserRoles(userId: number, rolesData: UpdateUserRolesRequestDto): Observable<AdminUser | undefined> {
    // Conceptual API: PUT /api/v1/admin/users/{userId}/roles - Replace mock with API call
    // Example API call structure:
    // return this.apiService.put<UserResponseDto>(\`/v1/admin/users/\${userId}/roles\`, rolesData).pipe(
    //   map(dto => this.mapUserDtoToModel(dto)),
    //   tap(updatedUser => {
    //     const users = this.adminUsersSubject.value.map(u => u.id === userId ? updatedUser : u);
    //     this.adminUsersSubject.next(users);
    //   }),
    //   catchError(err => this.handleErrorWithMessage(err, \`Failed to update roles for user \${userId}.\`, undefined))
    // );
    const userIndex = this.mockAdminUsers.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      this.mockAdminUsers[userIndex].roles = [...rolesData.roles];
      const updatedUser = { ...this.mockAdminUsers[userIndex] };
      this.adminUsersSubject.next([...this.mockAdminUsers]);
      return of(updatedUser);
    }
    this.errorHandlingService.showMessage(\`User with ID \${userId} not found for role update.\`);
    return of(undefined);
  }

  // Conceptual: deleteUser would also have a mock and an API version
  // public deleteUser(userId: number): Observable<boolean> { /* ... */ }


  // --- Global Category Management ---
  private mapCategoryDtoToModel(dto: CategoryResponseDto): Category {
     return { ...dto }; // Assuming Category and CategoryResponseDto are similar for now
  }

  getGlobalCategories(): Observable<Category[]> {
    // Conceptual API: GET /api/v1/admin/categories - Replace mock with API call
    // Example API call structure:
    // return this.apiService.get<CategoryResponseDto[]>('/v1/admin/categories', new HttpParams()).pipe(
    //   map(dtos => dtos.map(dto => this.mapCategoryDtoToModel(dto))),
    //   tap(categories => this.globalCategoriesSubject.next(categories)),
    //   catchError(err => this.handleErrorWithMessage(err, 'Failed to fetch global categories.', this.mockGlobalCategories))
    // );
    this.globalCategoriesSubject.next([...this.mockGlobalCategories]);
    return this.globalCategories$;
  }

  createGlobalCategory(categoryData: AdminCategoryRequestDto): Observable<Category> {
    // Conceptual API: POST /api/v1/admin/categories - Replace mock with API call
    // Example API call structure:
    // return this.apiService.post<CategoryResponseDto>('/v1/admin/categories', categoryData).pipe(
    //   map(dto => this.mapCategoryDtoToModel(dto)),
    //   tap(createdCategory => this.globalCategoriesSubject.next([...this.globalCategoriesSubject.value, createdCategory])),
    //   catchError(err => this.handleErrorWithMessage(err, 'Failed to create global category.')) // Potentially return a specific error type or rethrow
    // );
    const newCategory: Category = {
      id: Math.max(0, ...this.mockGlobalCategories.map(c => c.id)) + 1,
      name: categoryData.name,
      type: categoryData.type
    };
    this.mockGlobalCategories.push(newCategory);
    this.globalCategoriesSubject.next([...this.mockGlobalCategories]);
    return of(newCategory);
  }

  // Conceptual: updateGlobalCategory and deleteGlobalCategory would also have mock/API versions
  // public updateGlobalCategory(categoryId: number, categoryData: AdminCategoryRequestDto): Observable<Category | undefined> { /* ... */ }
  // public deleteGlobalCategory(categoryId: number): Observable<boolean> { /* ... */ }

  // Conceptual private error handler wrapper (example)
  // private handleErrorWithMessage<T>(error: any, message: string, fallbackValue?: T): Observable<T> {
  //   this.errorHandlingService.showMessage(message);
  //   console.error(message, error);
  //   // For methods expecting a specific return type on error (like an empty array or specific object):
  //   if (fallbackValue !== undefined) return of(fallbackValue);
  //   // For methods that should propagate the error to be handled by component:
  //   return throwError(() => new Error(message)); // Or pass the original error: this.errorHandlingService.handleError(error)
  // }
}
