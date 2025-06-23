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
  // Set to true when backend endpoint '/api/v1/categories' is available and configured.
  private readonly API_ENDPOINT_EXISTS = false;

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
  private categoriesFetched = false;

  constructor(
    private apiService: ApiService,
    private errorHandlingService: ErrorHandlingService
  ) {
    this.loadCategories().subscribe();
  }

  private mapDtoToModel(dto: CategoryResponseDto): Category {
    return { ...dto }; // Assuming DTO and Model are identical for now
  }

  private loadCategories(): Observable<Category[]> {
    if (this.API_ENDPOINT_EXISTS) {
      return this.apiService.get<CategoryResponseDto[]>('/v1/categories', new HttpParams()).pipe(
        map(dtos => dtos.map(dto => this.mapDtoToModel(dto))),
        tap(models => {
          this.categoriesSubject.next(models);
          this.categoriesFetched = true;
        }),
        catchError(err => {
          this.errorHandlingService.showMessage('Failed to fetch categories from API. Using mock data.');
          console.error('API fetch categories failed:', err);
          this.categoriesSubject.next(this.mockCategories);
          this.categoriesFetched = true;
          return of(this.mockCategories);
        })
      );
    } else {
      console.warn("CategoryService: API_ENDPOINT_EXISTS is false. Using mock categories. Define '/api/v1/categories' and set API_ENDPOINT_EXISTS to true for API integration.");
      this.categoriesSubject.next(this.mockCategories);
      this.categoriesFetched = true;
      return of(this.mockCategories);
    }
  }

  public getCategories(type?: 'INCOME' | 'EXPENSE'): Observable<Category[]> {
    // This method relies on categories$ being populated by loadCategories in constructor.
    // categoriesFetched flag ensures loadCategories isn't called repeatedly if getCategories is called multiple times,
    // though with shareReplay(1) and constructor load, direct re-fetch logic here is less critical.
    if (!this.categoriesFetched) {
      // This path should ideally not be hit frequently if constructor logic is sound.
      // It's a fallback to ensure data is loaded if it wasn't for some reason.
      return this.loadCategories().pipe(
        map(categories => this.filterCategoriesByType(categories, type))
      );
    }

    return this.categories$.pipe(
      map(categories => this.filterCategoriesByType(categories, type))
    );
  }

  private filterCategoriesByType(categories: Category[], type?: 'INCOME' | 'EXPENSE'): Category[] {
    if (type) {
      // Include categories of the specified type AND 'GENERAL' type categories.
      return categories.filter(cat => cat.type === type || cat.type === 'GENERAL');
    }
    return categories; // If no type filter, return all (or could be all non-GENERAL, depending on reqs)
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
    this.categoriesFetched = false; // Reset flag to allow refetch from API (if enabled)
    return this.loadCategories();
  }
}
