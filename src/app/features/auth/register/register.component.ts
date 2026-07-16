import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1>🍕 FoodHub</h1>
          <h2>Create Account</h2>
          <p>Join us for delicious food delivery</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <!-- Full Name Field -->
          <div class="form-group">
            <label for="fullName" class="form-label">Full Name</label>
            <input
              type="text"
              id="fullName"
              formControlName="fullName"
              class="form-input"
              placeholder="John Doe"
              [class.error]="isFieldInvalid('fullName')"
            />
            <span *ngIf="isFieldInvalid('fullName')" class="error-message">
              {{ getFieldError('fullName') }}
            </span>
          </div>

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

          <!-- Phone Field -->
          <div class="form-group">
            <label for="phone" class="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              formControlName="phone"
              class="form-input"
              placeholder="+91 98765 43210"
              [class.error]="isFieldInvalid('phone')"
            />
            <span *ngIf="isFieldInvalid('phone')" class="error-message">
              {{ getFieldError('phone') }}
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
              placeholder="At least 8 characters"
              [class.error]="isFieldInvalid('password')"
            />
            <span *ngIf="isFieldInvalid('password')" class="error-message">
              {{ getFieldError('password') }}
            </span>
            <div class="password-requirements">
              <p [class.met]="registerForm.get('password')?.value?.length >= 8">
                ✓ At least 8 characters
              </p>
              <p [class.met]="/[A-Z]/.test(registerForm.get('password')?.value || '')">
                ✓ One uppercase letter
              </p>
              <p [class.met]="/[0-9]/.test(registerForm.get('password')?.value || '')">
                ✓ One number
              </p>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              class="form-input"
              placeholder="Re-enter your password"
              [class.error]="isFieldInvalid('confirmPassword')"
            />
            <span *ngIf="isFieldInvalid('confirmPassword')" class="error-message">
              {{ getFieldError('confirmPassword') }}
            </span>
          </div>

          <!-- Terms and Conditions -->
          <div class="form-group checkbox">
            <input
              type="checkbox"
              id="terms"
              formControlName="terms"
              class="checkbox-input"
            />
            <label for="terms" class="checkbox-label">
              I agree to the Terms and Conditions
            </label>
          </div>
          <span *ngIf="isFieldInvalid('terms')" class="error-message">
            You must agree to the terms and conditions
          </span>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="!registerForm.valid || isLoading"
          >
            <span *ngIf="!isLoading">Create Account</span>
            <span *ngIf="isLoading">Creating Account...</span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Login here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 140px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
    }

    .register-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 450px;
      width: 100%;
      padding: 3rem 2rem;
    }

    .register-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .register-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem;
    }

    .register-header h2 {
      font-size: 1.75rem;
      color: #212121;
      margin: 0.5rem 0;
    }

    .register-header p {
      color: #757575;
      font-size: 0.95rem;
      margin: 0.5rem 0 0;
    }

    .register-form {
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

    .password-requirements {
      background: #f5f5f5;
      border-radius: 4px;
      padding: 0.75rem 1rem;
      margin-top: 0.5rem;
      font-size: 0.85rem;
    }

    .password-requirements p {
      margin: 0.25rem 0;
      color: #9e9e9e;
      transition: color 0.3s ease;
    }

    .password-requirements p.met {
      color: #4caf50;
    }

    .form-group.checkbox {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .checkbox-input {
      width: 18px;
      height: 18px;
      margin-right: 0.75rem;
      margin-top: 0.25rem;
      cursor: pointer;
      accent-color: #667eea;
      flex-shrink: 0;
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
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {}

  private initializeForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, this.phoneValidator]],
        password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  onSubmit(): void {
    if (!this.registerForm.valid) return;

    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.toastService.showSuccess('Account created successfully! Please login.');
      this.router.navigate(['/auth/login']);
      this.isLoading = false;
    }, 1500);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field) return '';

    if (field.errors?.['required']) return `${fieldName} is required`;
    if (field.errors?.['email']) return 'Please enter a valid email';
    if (field.errors?.['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `${fieldName} must be at least ${minLength} characters`;
    }
    if (field.errors?.['invalidPhone']) return 'Please enter a valid phone number';
    if (field.errors?.['weakPassword']) return 'Password must contain uppercase letters and numbers';
    if (this.registerForm.errors?.['passwordMismatch']) return 'Passwords do not match';

    return '';
  }

  // Custom Validators
  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const password = control.value;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUppercase && hasNumber ? null : { weakPassword: true };
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
