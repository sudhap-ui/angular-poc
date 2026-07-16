import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🍕 FoodHub</h1>
          <h2>Sign In</h2>
          <p>Welcome back! Login to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <!-- Email Field -->
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-input"
              placeholder="your@email.com"
              [class.error]="isFieldInvalid('email')"
            />
            <span *ngIf="isFieldInvalid('email')" class="error-message">
              {{ getFieldError('email') }}
            </span>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-input"
              placeholder="Enter your password"
              [class.error]="isFieldInvalid('password')"
            />
            <span *ngIf="isFieldInvalid('password')" class="error-message">
              {{ getFieldError('password') }}
            </span>
          </div>

          <!-- Remember Me -->
          <div class="form-group checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              formControlName="rememberMe"
              class="checkbox-input"
            />
            <label for="rememberMe" class="checkbox-label">Remember me</label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="!loginForm.valid || isLoading"
          >
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading">Signing In...</span>
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="demo-section">
          <p class="demo-title">Demo Credentials:</p>
          <div class="demo-creds">
            <p>📧 Email: <strong>demo@example.com</strong></p>
            <p>🔐 Password: <strong>password123</strong></p>
          </div>
          <button type="button" (click)="fillDemoCredentials()" class="btn-demo">
            Use Demo Credentials
          </button>
        </div>

        <!-- Register Link -->
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register">Register here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 140px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 100%;
      padding: 3rem 2rem;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem;
    }

    .login-header h2 {
      font-size: 1.75rem;
      color: #212121;
      margin: 0.5rem 0;
    }

    .login-header p {
      color: #757575;
      font-size: 0.95rem;
      margin: 0.5rem 0 0;
    }

    .login-form {
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 500;
      color: #212121;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input.error {
      border-color: #f44336;
    }

    .error-message {
      color: #f44336;
      font-size: 0.85rem;
      margin-top: 0.25rem;
      display: block;
    }

    .form-group.checkbox {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }

    .checkbox-input {
      width: 18px;
      height: 18px;
      margin-right: 0.75rem;
      cursor: pointer;
      accent-color: #667eea;
    }

    .checkbox-label {
      font-size: 0.95rem;
      cursor: pointer;
      color: #424242;
    }

    .btn {
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-block {
      width: 100%;
      padding: 0.75rem;
    }

    .demo-section {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      border-left: 4px solid #667eea;
    }

    .demo-title {
      font-weight: 600;
      color: #212121;
      font-size: 0.9rem;
      margin: 0 0 0.75rem;
    }

    .demo-creds {
      font-size: 0.85rem;
      color: #424242;
      margin-bottom: 0.75rem;
    }

    .demo-creds p {
      margin: 0.25rem 0;
      font-family: 'Courier New', monospace;
    }

    .btn-demo {
      width: 100%;
      padding: 0.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-demo:hover {
      background: #764ba2;
      transform: translateY(-1px);
    }

    .auth-footer {
      text-align: center;
      color: #757575;
      font-size: 0.95rem;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  returnUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password })
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Login successful!');
          this.router.navigateByUrl(this.returnUrl || '/home');
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.toastService.showError('Invalid email or password');
        }
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field) return '';

    if (field.errors?.['required']) return `${fieldName} is required`;
    if (field.errors?.['email']) return 'Please enter a valid email';
    if (field.errors?.['minlength']) return `${fieldName} must be at least 6 characters`;

    return '';
  }

  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'demo@example.com',
      password: 'password123'
    });
    this.toastService.showInfo('Demo credentials filled in');
  }
}
