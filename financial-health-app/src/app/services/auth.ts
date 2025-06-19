import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {}

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUserLoggedInStatus(): boolean {
    return this.loggedIn.value;
  }

  login(credentials: any): Observable<boolean> {
    console.log('Attempting login with:', credentials);
    this.loggedIn.next(true);
    this.router.navigate(['/dashboard']);
    return new BehaviorSubject<boolean>(true);
  }

  logout(): void {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
    console.log('User logged out');
  }

  register(userInfo: any): Observable<any> {
    console.log('Attempting registration with:', userInfo);
    this.loggedIn.next(true);
    this.router.navigate(['/dashboard']);
    return new BehaviorSubject<any>({ success: true, message: 'Registration successful' });
  }
}
