import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorHandlingService } from './error-handling.service';
import { Category } from '../../models/category.model';
import { CategoryResponseDto } from '../../models/dto/category.response.dto';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // NOTE: To enable API calls for categories, the backend endpoint /api/v1/categories must be available.
  // For development without a backend, this service falls back to mock data if the API call fails.

  private mockCategories: Category[] = [
    { id: 1, name: 'Food', type: 'EXPENSE' }, { id: 2, name: 'Transport', type: 'EXPENSE' },
    { id: 3, name: 'Salary', type: 'INCOME' }, { id: 4, name: 'Utilities', type: 'EXPENSE' },
    { id: 5, name: 'Entertainment', type: 'EXPENSE' }, { id: 6, name: 'Healthcare', type: 'EXPENSE' },
    { id: 7, name: 'Shopping', type: 'EXPENSE' }, { id: 8, name: 'Housing', type: 'EXPENSE' },
    { id: 9, name: 'Education', type: 'EXPENSE' }, { id: 10, name: 'Investment', type: 'INCOME' },
    { id: 11, name: 'Freelance', type: 'INCOME' }, { id: 12, name: 'Gifts', type: 'GENERAL' },
    { id: 13, name: 'Other', type: 'GENERAL' }
  ];

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable().pipe(
    shareReplay(1)
  );
  private categoriesApiFetchedSuccessfully = false;

  constructor(
    private apiService: ApiService,
    private errorHandlingService: ErrorHandlingService
  ) {
    // Initial load attempt.
    this.loadCategoriesFromApiOrUseMock().subscribe();
  }

  private mapDtoToModel(dto: CategoryResponseDto): Category {
    return { ...dto }; // Assuming DTO and Model are currently identical
  }

  private loadCategoriesFromApiOrUseMock(): Observable<Category[]> {
    // The actual API endpoint for categories is GET /api/v1/categories
    return this.apiService.get<CategoryResponseDto[]>('/v1/categories', new HttpParams()).pipe(
      map(dtos => dtos.map(dto => this.mapDtoToModel(dto))),
      tap(models => {
        this.categoriesSubject.next(models);
        this.categoriesApiFetchedSuccessfully = true;
        console.log('CategoryService: Categories loaded from API successfully.');
      }),
      catchError(err => {
        // Do not use ErrorHandlingService.showMessage here as it might be too intrusive for a fallback.
        console.error('CategoryService: API call to /v1/categories failed. Falling back to mock categories.', err);
        this.categoriesSubject.next(this.mockCategories);
        this.categoriesApiFetchedSuccessfully = false;
        return of(this.mockCategories);
      })
    );
  }

  public getCategories(type?: 'INCOME' | 'EXPENSE'): Observable<Category[]> {
    return this.categories$.pipe(
      map(categories => this.filterCategoriesByType(categories, type))
    );
  }

  private filterCategoriesByType(categories: Category[], type?: 'INCOME' | 'EXPENSE'): Category[] {
    if (type) {
      return categories.filter(cat => cat.type === type || cat.type === 'GENERAL');
    }
    return categories;
  }

  public getCategoryNameById(id: number): Observable<string | undefined> {
    return this.categories$.pipe(
      map(categories => categories.find(cat => cat.id === id)?.name)
    );
  }

  public getCategoryIdByName(name: string): Observable<number | undefined> {
    return this.categories$.pipe(
      map(categories => categories.find(cat => cat.name.toLowerCase() === name.toLowerCase())?.id)
    );
  }

  public refreshCategories(): Observable<Category[]> {
    console.log('CategoryService: Refreshing categories from API...');
    return this.loadCategoriesFromApiOrUseMock();
  }

  public haveCategoriesBeenLoadedFromApi(): boolean {
    return this.categoriesApiFetchedSuccessfully;
  }
}
