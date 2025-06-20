import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Corrected path from original script
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.html', // Points to header.html
  styleUrls: ['./header.scss'],  // Points to header.scss
  // standalone: false, // Part of CoreModule
  // imports: [CommonModule, RouterModule, SharedModule] // Not needed as it's part of CoreModule
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  username: string | null = null;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    // Example: this.authSubscription = this.authService.currentUser.subscribe(user => this.username = user?.username);
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
