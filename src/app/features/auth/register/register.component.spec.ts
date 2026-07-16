import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate password strength', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('weak');
    expect(passwordControl?.hasError('weakPassword')).toBeTruthy();

    passwordControl?.setValue('Strong123');
    expect(passwordControl?.valid).toBeTruthy();
  });
});
