import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantCardComponent } from './restaurant-card.component';

describe('RestaurantCardComponent', () => {
  let component: RestaurantCardComponent;
  let fixture: ComponentFixture<RestaurantCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantCardComponent);
    component = fixture.componentInstance;
    component.restaurant = {
      id: '1',
      name: 'Test Restaurant',
      description: 'Test description',
      image: 'test.jpg',
      cuisineTypes: ['Italian'],
      rating: 4.5,
      reviewCount: 100,
      minDeliveryTime: 30,
      maxDeliveryTime: 45,
      deliveryCharge: 50,
      isOpen: true,
      address: 'Test Address',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display restaurant information', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Restaurant');
    expect(compiled.textContent).toContain('4.5');
  });
});
