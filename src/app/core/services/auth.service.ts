import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '@app/models';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
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
