import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
// import { ApiService } from './api.service'; // Future use
import { Category } from '../../models/category.model';
// import { CategoryResponseDto } from '../../models/dto/category.response.dto'; // Future use

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private mockCategories: Category[] = [
    { id: 1, name: 'Food', type: 'EXPENSE' }, { id: 2, name: 'Transport', type: 'EXPENSE' },
    { id: 3, name: 'Salary', type: 'INCOME' }, { id: 4, name: 'Utilities', type: 'EXPENSE' },
    { id: 5, name: 'Entertainment', type: 'EXPENSE' }, { id: 6, name: 'Healthcare', type: 'EXPENSE' },
    { id: 7, name: 'Shopping', type: 'EXPENSE' }, { id: 8, name: 'Housing', type: 'EXPENSE' },
    { id: 9, name: 'Education', type: 'EXPENSE' }, { id: 10, name: 'Investment', type: 'INCOME' },
    { id: 11, name: 'Freelance', type: 'INCOME' }, { id: 12, name: 'Gifts', type: 'GENERAL' },
    { id: 13, name: 'Other', type: 'GENERAL' }
  ];

  private categoriesSubject = new BehaviorSubject<Category[]>(this.mockCategories);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor(/*private apiService: ApiService*/) {} // Inject ApiService later

  public getCategories(type?: 'INCOME' | 'EXPENSE'): Observable<Category[]> { // GENERAL categories always included
    return this.categories$.pipe(
      map(categories => {
        if (type) {
          return categories.filter(cat => cat.type === type || cat.type === 'GENERAL');
        }
        return categories;
      })
    );
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
}
