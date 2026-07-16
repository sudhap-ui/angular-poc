import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { RestaurantService } from '@core/services/restaurant.service';
import { Restaurant, RestaurantFilters } from '@app/models';
import { RestaurantCardComponent } from '@shared/components/restaurant-card/restaurant-card.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RestaurantCardComponent,
    LoaderComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="restaurants-container">
      <!-- Header -->
      <div class="restaurants-header">
        <div class="container">
          <h1>🍽️ Restaurants</h1>
          <p>Discover and order from the best restaurants in your area</p>
        </div>
      </div>

      <div class="container restaurants-main">
        <div class="restaurants-layout">
          <!-- Sidebar Filters -->
          <aside class="filters-sidebar">
            <form [formGroup]="filterForm" class="filters-form">
              <!-- Search -->
              <div class="filter-section">
                <h3 class="filter-title">Search</h3>
                <input
                  type="text"
                  formControlName="search"
                  class="filter-input"
                  placeholder="Restaurant name..."
                />
              </div>

              <!-- Cuisine Filter -->
              <div class="filter-section">
                <h3 class="filter-title">Cuisine</h3>
                <div class="filter-options">
                  <label *ngFor="let cuisine of cuisines" class="filter-checkbox">
                    <input
                      type="checkbox"
                      [value]="cuisine"
                      (change)="onCuisineChange($event)"
                    />
                    <span>{{ cuisine }}</span>
                  </label>
                </div>
              </div>

              <!-- Rating Filter -->
              <div class="filter-section">
                <h3 class="filter-title">Rating</h3>
                <div class="rating-filter">
                  <label *ngFor="let rating of ratings" class="filter-radio">
                    <input
                      type="radio"
                      [value]="rating"
                      formControlName="rating"
                    />
                    <span>
                      <span class="star">⭐</span>
                      {{ rating }}+ ({{ getRatingLabel(rating) }})
                    </span>
                  </label>
                </div>
              </div>

              <!-- Delivery Time Filter -->
              <div class="filter-section">
                <h3 class="filter-title">Delivery Time</h3>
                <select formControlName="maxDeliveryTime" class="filter-select">
                  <option value="">All Times</option>
                  <option value="30">Under 30 min</option>
                  <option value="45">Under 45 min</option>
                  <option value="60">Under 1 hour</option>
                </select>
              </div>

              <!-- Status Filter -->
              <div class="filter-section">
                <h3 class="filter-title">Status</h3>
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    formControlName="openOnly"
                  />
                  <span>Open Now</span>
                </label>
              </div>

              <!-- Filter Actions -->
              <div class="filter-actions">
                <button type="button" (click)="resetFilters()" class="btn-reset">
                  Reset Filters
                </button>
                <button type="button" (click)="applyFilters()" class="btn-apply">
                  Apply Filters
                </button>
              </div>
            </form>
          </aside>

          <!-- Main Content -->
          <main class="restaurants-content">
            <!-- Toolbar -->
            <div class="restaurants-toolbar">
              <div class="results-info">
                <p>Found <strong>{{ filteredRestaurants.length }}</strong> restaurants</p>
              </div>
              <div class="sort-options">
                <label>Sort by:</label>
                <select (change)="onSortChange($event)" class="sort-select">
                  <option value="rating">Highest Rating</option>
                  <option value="deliveryTime">Fastest Delivery</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            <!-- Loading State -->
            <app-loader *ngIf="isLoading" message="Loading restaurants..."></app-loader>

            <!-- Restaurants Grid -->
            <div *ngIf="!isLoading && filteredRestaurants.length > 0" class="restaurants-grid">
              <app-restaurant-card
                *ngFor="let restaurant of paginatedRestaurants"
                [restaurant]="restaurant"
              ></app-restaurant-card>
            </div>

            <!-- Empty State -->
            <app-empty-state
              *ngIf="!isLoading && filteredRestaurants.length === 0"
              [config]="{
                title: 'No restaurants found',
                message: 'Try adjusting your filters or search criteria',
                icon: '🔍',
                actionLabel: 'Reset Filters'
              }"
              (action)="resetFilters()"
            ></app-empty-state>

            <!-- Pagination -->
            <div *ngIf="!isLoading && filteredRestaurants.length > 0" class="pagination">
              <button
                (click)="previousPage()"
                [disabled]="currentPage === 1"
                class="btn-pagination"
              >
                ← Previous
              </button>

              <div class="pagination-info">
                <span *ngFor="let page of pageNumbers; let i = index" class="page-number">
                  <button
                    (click)="goToPage(page)"
                    [class.active]="page === currentPage"
                    class="btn-page"
                  >
                    {{ page }}
                  </button>
                  <span *ngIf="i < pageNumbers.length - 1" class="separator">•</span>
                </span>
              </div>

              <button
                (click)="nextPage()"
                [disabled]="currentPage === totalPages"
                class="btn-pagination"
              >
                Next →
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .restaurants-container {
      min-height: calc(100vh - 140px);
    }

    .restaurants-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 2rem;
      margin-bottom: 2rem;
    }

    .restaurants-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem;
    }

    .restaurants-header p {
      margin: 0.5rem 0 0;
      opacity: 0.95;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .restaurants-main {
      margin-bottom: 4rem;
    }

    .restaurants-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 3rem;
    }

    /* Filters Sidebar */
    .filters-sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .filters-form {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .filter-section {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .filter-section:last-of-type {
      border-bottom: none;
      margin-bottom: 1rem;
      padding-bottom: 0;
    }

    .filter-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #212121;
      margin: 0 0 0.75rem;
    }

    .filter-input,
    .filter-select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .filter-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .filter-options,
    .rating-filter {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-checkbox,
    .filter-radio {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #424242;
      transition: color 0.3s ease;
    }

    .filter-checkbox:hover,
    .filter-radio:hover {
      color: #667eea;
    }

    .filter-checkbox input,
    .filter-radio input {
      cursor: pointer;
      accent-color: #667eea;
      width: 16px;
      height: 16px;
    }

    .star {
      font-size: 0.85rem;
    }

    .filter-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-reset,
    .btn-apply {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
      font-size: 0.9rem;
    }

    .btn-reset {
      background: #f5f5f5;
      color: #212121;
      border: 1px solid #e0e0e0;
    }

    .btn-reset:hover {
      background: #e0e0e0;
    }

    .btn-apply {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-apply:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
    }

    /* Restaurants Content */
    .restaurants-content {
      display: flex;
      flex-direction: column;
    }

    .restaurants-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .results-info p {
      margin: 0;
      color: #424242;
    }

    .sort-options {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sort-select {
      padding: 0.6rem 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .sort-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .restaurants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      padding: 2rem 0;
      flex-wrap: wrap;
    }

    .btn-pagination {
      padding: 0.75rem 1.5rem;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn-pagination:hover:not(:disabled) {
      border-color: #667eea;
      color: #667eea;
    }

    .btn-pagination:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .page-number {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-page {
      width: 40px;
      height: 40px;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn-page:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .btn-page.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: transparent;
    }

    .separator {
      color: #bdbdbd;
    }

    @media (max-width: 1024px) {
      .restaurants-layout {
        grid-template-columns: 1fr;
      }

      .filters-sidebar {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .restaurants-header h1 {
        font-size: 1.75rem;
      }

      .restaurants-toolbar {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .sort-options {
        width: 100%;
      }

      .sort-select {
        flex: 1;
      }

      .restaurants-grid {
        grid-template-columns: 1fr;
      }

      .pagination {
        gap: 1rem;
      }
    }
  `]
})
export class RestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  paginatedRestaurants: Restaurant[] = [];
  isLoading = false;

  filterForm!: FormGroup;
  currentPage = 1;
  pageSize = 9;
  totalPages = 1;
  pageNumbers: number[] = [];

  cuisines = ['Italian', 'American', 'Indian', 'Chinese', 'Japanese', 'Mexican'];
  ratings = [4, 3.5, 3];
  currentSort = 'rating';

  constructor(
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadRestaurants();
  }

  private initializeForm(): void {
    this.filterForm = this.formBuilder.group({
      search: [''],
      cuisines: [[]],
      rating: [null],
      maxDeliveryTime: [''],
      openOnly: [false]
    });
  }

  private loadRestaurants(): void {
    this.isLoading = true;
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.filteredRestaurants = [...data];
        this.sortRestaurants();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading restaurants:', error);
        this.isLoading = false;
      }
    });
  }

  onCuisineChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formControl = this.filterForm.get('cuisines');
    const selected = formControl?.value || [];

    if (input.checked) {
      selected.push(input.value);
    } else {
      const index = selected.indexOf(input.value);
      if (index > -1) selected.splice(index, 1);
    }
    formControl?.setValue(selected);
  }

  applyFilters(): void {
    const { search, cuisines, rating, maxDeliveryTime, openOnly } = this.filterForm.value;

    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      // Search filter
      if (search && !restaurant.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Cuisine filter
      if (cuisines && cuisines.length > 0) {
        const hasMatchingCuisine = cuisines.some(c =>
          restaurant.cuisineTypes.some(rc => rc.toLowerCase() === c.toLowerCase())
        );
        if (!hasMatchingCuisine) return false;
      }

      // Rating filter
      if (rating && restaurant.rating < rating) {
        return false;
      }

      // Delivery time filter
      if (maxDeliveryTime && restaurant.maxDeliveryTime > parseInt(maxDeliveryTime)) {
        return false;
      }

      // Open only filter
      if (openOnly && !restaurant.isOpen) {
        return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.sortRestaurants();
    this.updatePagination();
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filteredRestaurants = [...this.restaurants];
    this.currentPage = 1;
    this.sortRestaurants();
    this.updatePagination();
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.currentSort = value;
    this.sortRestaurants();
  }

  private sortRestaurants(): void {
    switch (this.currentSort) {
      case 'deliveryTime':
        this.filteredRestaurants.sort((a, b) => a.minDeliveryTime - b.minDeliveryTime);
        break;
      case 'name':
        this.filteredRestaurants.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
      default:
        this.filteredRestaurants.sort((a, b) => b.rating - a.rating);
    }
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRestaurants.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePageNumbers();
    this.updatePage();
  }

  private updatePageNumbers(): void {
    this.pageNumbers = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      this.pageNumbers.push(i);
    }
  }

  private updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRestaurants = this.filteredRestaurants.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageNumbers();
      this.updatePage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePageNumbers();
      this.updatePage();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePageNumbers();
    this.updatePage();
  }

  getRatingLabel(rating: number): string {
    const labels: { [key: number]: string } = {
      4: 'Excellent',
      3.5: 'Very Good',
      3: 'Good'
    };
    return labels[rating] || '';
  }
}
