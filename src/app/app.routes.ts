import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    data: { title: 'Authentication' }
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    data: { title: 'Home' }
  },
  {
    path: 'restaurants',
    loadComponent: () => import('./features/restaurants/restaurants.component').then(m => m.RestaurantsComponent),
    data: { title: 'Restaurants' }
  },
  {
    path: 'restaurants/:id',
    loadComponent: () => import('./features/restaurant-details/restaurant-details.component').then(m => m.RestaurantDetailsComponent),
    data: { title: 'Restaurant Details' }
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    canActivate: [AuthGuard],
    data: { title: 'Shopping Cart' }
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [AuthGuard],
    data: { title: 'Checkout' }
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [AuthGuard],
    data: { title: 'Orders' }
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
    data: { title: 'Profile' }
  },
  {
    path: '404',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
