import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load restaurants on init', () => {
    spyOn(component, 'loadRestaurants');
    component.ngOnInit();
    expect(component.loadRestaurants).toHaveBeenCalled();
  });

  it('should toggle category selection', () => {
    component.selectCategory('pizza');
    expect(component.selectedCategory).toBe('pizza');
    component.selectCategory('pizza');
    expect(component.selectedCategory).toBeNull();
  });
});
