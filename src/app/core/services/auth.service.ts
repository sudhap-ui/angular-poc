import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, delay, throwError } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '@app/models';
import { environment } from '@environments/environment';

// Mock user data for demo
const MOCK_USERS: { [key: string]: string } = {
  'demo@example.com': 'password123'
};

const MOCK_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  phone: '+91 98765 43210',
  createdAt: new Date(),
  updatedAt: new Date()
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Mock API call
    if (environment.enableMockData) {
      const user = MOCK_USERS[credentials.email];
      if (user && user === credentials.password) {
        const response: LoginResponse = {
          user: MOCK_USER,
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 3600
        };
        return of(response).pipe(
          delay(500),
          tap(response => {
            this.setToken(response.token, response.refreshToken, response.expiresIn);
            this.currentUser.set(response.user);
            this.isAuthenticatedSubject.next(true);
          })
        );
      } else {
        return throwError(() => new Error('Invalid credentials'));
      }
    }
    
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token, response.refreshToken, response.expiresIn);
          this.currentUser.set(response.user);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(environment.jwtTokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    this.currentUser.set(null);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(environment.jwtTokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  private setToken(token: string, refreshToken: string, expiresIn: number): void {
    localStorage.setItem(environment.jwtTokenKey, token);
    localStorage.setItem(environment.refreshTokenKey, refreshToken);
    const expiryDate = new Date().getTime() + (expiresIn * 1000);
    localStorage.setItem('token_expiry', expiryDate.toString());
  }

  private loadStoredToken(): void {
    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }
}

import { BehaviorSubject } from 'rxjs';
