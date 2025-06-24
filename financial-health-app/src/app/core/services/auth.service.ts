import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { ErrorHandlingService } from './error-handling.service';

export interface LoginRequest {
  email?: string;
  password?: string;
  username?: string;
}

export interface AuthResponse {
  token?: string;
  id?: string;
  username?: string;
  email?: string;
  message?: string;
  roles?: string[];
}

export interface RegisterRequest {
  username?: string;
  // email?: string; // Per OpenAPI spec, only username/password for register
  password?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserToken = new BehaviorSubject<string | null>(null);
  private userRoles = new BehaviorSubject<string[]>([]);

  public userRoles$: Observable<string[]> = this.userRoles.asObservable();

  constructor(
    private router: Router,
    private apiService: ApiService,
    private errorHandlingService: ErrorHandlingService
  ) {
    const token = this.getToken();
    if (token) {
      this.loggedIn.next(true);
      this.currentUserToken.next(token);
      // TODO: Consider fetching user profile/roles here if token is valid
      // For now, roles are only set on fresh login response.
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
    const loginPayload: { username?: string, password?: string } = {};
    // OpenAPI spec for LoginRequest uses 'username'.
    // If components send 'email' from form, we use it as 'username'.
    loginPayload.username = credentials.username || credentials.email;
    loginPayload.password = credentials.password;

    return this.apiService.post<AuthResponse>('/auth/login', loginPayload).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          this.currentUserToken.next(response.token);
          this.loggedIn.next(true);

          this.userRoles.next(response.roles || []); // Store roles

          this.router.navigate(['/dashboard']);
        } else {
          // This case implies a successful HTTP response but malformed data (e.g. no token)
          this.errorHandlingService.showMessage('Login successful, but no token received. Please contact support.');
          this.userRoles.next([]);
        }
      }),
      catchError(error => {
        this.errorHandlingService.showMessage('Login failed. Please check your credentials.');
        this.userRoles.next([]);
        return throwError(() => this.errorHandlingService.handleError(error));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUserToken.next(null);
    this.loggedIn.next(false);
    this.userRoles.next([]);
    this.router.navigate(['/auth/login']);
    console.log('User logged out');
  }

  register(userInfo: RegisterRequest): Observable<AuthResponse> {
    // OpenAPI spec for RegisterRequest has 'username' and 'password'.
    const registerPayload: RegisterRequest = {
        username: userInfo.username,
        password: userInfo.password
    };

    // Path for register is /api/finsight/auth/register as per previous setup
    return this.apiService.post<AuthResponse>('/finsight/auth/register', registerPayload).pipe(
      tap((response: AuthResponse) => {
        console.log('Registration successful (raw response):', response);
        // Typically, registration does not automatically log the user in.
        // Navigate to login page with a success message/param.
        this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } });
      }),
      catchError(error => {
        this.errorHandlingService.showMessage('Registration failed. Please try again.');
        return throwError(() => this.errorHandlingService.handleError(error));
      })
    );
  }

  /**
   * Checks if the current user has a specific role.
   * @param role The role string to check for (e.g., 'ROLE_ADMIN').
   * @returns boolean True if the user has the role, false otherwise.
   */
  public hasRole(role: string): boolean {
    return this.userRoles.value.includes(role);
  }
}
