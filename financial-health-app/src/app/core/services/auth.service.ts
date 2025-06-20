import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { ErrorHandlingService } from './error-handling.service';

// Define interfaces for request/response
export interface AuthResponse {
  token?: string;
  id?: string;
  username?: string;
  email?: string;
  message?: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  username?: string;
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserToken = new BehaviorSubject<string | null>(null);

  constructor(
    private router: Router,
    private apiService: ApiService,
    private errorHandlingService: ErrorHandlingService
  ) {
    const token = this.getToken();
    if (token) {
      this.loggedIn.next(true);
      this.currentUserToken.next(token);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUserLoggedInStatus(): boolean {
    return this.loggedIn.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post('/auth/login', credentials).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          this.currentUserToken.next(response.token);
          this.loggedIn.next(true);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorHandlingService.showMessage('Login successful, but no token received.');
        }
      }),
      catchError(error => {
        this.errorHandlingService.showMessage('Login failed. Please check your credentials.');
        return throwError(() => this.errorHandlingService.handleError(error));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUserToken.next(null);
    this.loggedIn.next(false);
    this.router.navigate(['/auth/login']);
    console.log('User logged out');
  }

  register(userInfo: RegisterRequest): Observable<AuthResponse> {
    // Assuming ApiService is configured to handle paths appropriately,
    // or backend maps /api/finsight/auth/register to the target endpoint.
    return this.apiService.post('/finsight/auth/register', userInfo).pipe(
      tap((response: AuthResponse) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } }); // Ensure registered is a string
      }),
      catchError(error => {
        this.errorHandlingService.showMessage('Registration failed. Please try again.');
        return throwError(() => this.errorHandlingService.handleError(error));
      })
    );
  }
}
