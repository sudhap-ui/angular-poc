import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="container navbar-container">
        <div class="navbar-brand">
          <a routerLink="/home" class="logo">🍕 FoodHub</a>
        </div>
        <div class="navbar-menu">
          <a routerLink="/home" class="nav-link">Home</a>
          <a routerLink="/restaurants" class="nav-link">Restaurants</a>
        </div>
        <div class="navbar-end">
          <a routerLink="/cart" class="cart-link">
            🛒 Cart <span *ngIf="cartItemCount() > 0" class="badge">{{ cartItemCount() }}</span>
          </a>
          <div *ngIf="isAuthenticated$ | async; then authenticated else notAuthenticated"></div>
          <ng-template #authenticated>
            <button (click)="logout()" class="btn-logout">Logout</button>
          </ng-template>
          <ng-template #notAuthenticated>
            <a routerLink="/auth/login" class="btn-login">Login</a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
    }
    .navbar-menu {
      display: flex;
      gap: 2rem;
    }
    .nav-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      transition: color 0.3s;
    }
    .nav-link:hover {
      color: white;
    }
    .navbar-end {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    .cart-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      position: relative;
    }
    .badge {
      position: absolute;
      top: -5px;
      right: -10px;
      background: #FF6B35;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
    }
    .btn-login, .btn-logout {
      padding: 0.5rem 1rem;
      border: 2px solid white;
      background: transparent;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
    }
    .btn-login:hover, .btn-logout:hover {
      background: white;
      color: #667eea;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isAuthenticated$!: any;
  cartItemCount = this.cartService.cartItemCount;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
