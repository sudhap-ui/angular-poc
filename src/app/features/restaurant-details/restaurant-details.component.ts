import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService } from '@core/services/restaurant.service';
import { ToastService } from '@core/services/toast.service';
import { CartService } from '@core/services/cart.service';
import { Restaurant, FoodItem, Review } from '@app/models';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  template: `
    <!-- Loading State -->
    <app-loader *ngIf="isLoading" message="Loading restaurant details..."></app-loader>

    <div *ngIf="!isLoading && restaurant" class="restaurant-details">
      <!-- Header Banner -->
      <div class="restaurant-banner">
        <img [src]="restaurant.image" [alt]="restaurant.name" class="banner-image" />
        <div class="banner-overlay"></div>
        <div class="banner-content">
          <h1>{{ restaurant.name }}</h1>
          <div class="restaurant-meta">
            <span class="meta-item">
              <span class="star">⭐</span> {{ restaurant.rating }} ({{ restaurant.reviewCount }} reviews)
            </span>
            <span class="meta-item" *ngIf="restaurant.isOpen">🟢 Open Now</span>
            <span class="meta-item" *ngIf="!restaurant.isOpen">🔴 Closed</span>
            <span class="meta-item">📍 {{ restaurant.address }}</span>
          </div>
          <p class="restaurant-description">{{ restaurant.description }}</p>
          <div class="delivery-info-header">
            <span>⏱️ {{ restaurant.minDeliveryTime }}-{{ restaurant.maxDeliveryTime }} min</span>
            <span>🚚 ₹{{ restaurant.deliveryCharge }} delivery</span>
          </div>
        </div>
      </div>

      <div class="container details-container">
        <div class="details-layout">
          <!-- Menu Section -->
          <main class="menu-section">
            <div class="menu-categories">
              <button
                *ngFor="let category of menuCategories"
                (click)="selectCategory(category.id)"
                [class.active]="selectedCategoryId === category.id"
                class="category-btn"
              >
                {{ category.name }}
              </button>
            </div>

            <!-- Food Items -->
            <div class="food-items-container">
              <div *ngFor="let item of foodItems" class="food-item-card">
                <div class="food-item-image">
                  <img [src]="item.image" [alt]="item.name" />
                  <div class="item-badges">
                    <span class="badge badge-veg" *ngIf="item.isVegetarian">🌱 Veg</span>
                    <span class="badge badge-nonveg" *ngIf="!item.isVegetarian">🍗 Non-Veg</span>
                  </div>
                </div>
                <div class="food-item-content">
                  <h3>{{ item.name }}</h3>
                  <p class="description">{{ item.description }}</p>
                  <div class="item-meta">
                    <span class="price">₹{{ item.price }}</span>
                    <span class="rating" *ngIf="item.rating > 0">
                      ⭐ {{ item.rating }} ({{ item.reviewCount }})
                    </span>
                  </div>
                  <button
                    (click)="addToCart(item)"
                    class="btn btn-add-to-cart"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </main>

          <!-- Sidebar -->
          <aside class="details-sidebar">
            <!-- About Section -->
            <div class="sidebar-card">
              <h3>About</h3>
              <div class="about-content">
                <p><strong>Cuisines:</strong></p>
                <div class="cuisine-tags">
                  <span *ngFor="let cuisine of restaurant.cuisineTypes" class="tag">
                    {{ cuisine }}
                  </span>
                </div>
                <p class="mt"><strong>Contact:</strong></p>
                <p>📞 {{ restaurant.phone }}</p>
              </div>
            </div>

            <!-- Reviews Section -->
            <div class="sidebar-card">
              <h3>Reviews</h3>
              <div class="reviews-list">
                <div *ngFor="let review of reviews" class="review-item">
                  <div class="review-header">
                    <strong>{{ review.userName }}</strong>
                    <span class="review-rating">⭐ {{ review.rating }}</span>
                  </div>
                  <p class="review-title">{{ review.title }}</p>
                  <p class="review-comment">{{ review.comment }}</p>
                  <small class="review-date">{{ formatDate(review.createdAt) }}</small>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div *ngIf="!isLoading && !restaurant" class="not-found">
      <h2>Restaurant not found</h2>
      <p>The restaurant you're looking for doesn't exist.</p>
      <a routerLink="/restaurants" class="btn btn-primary">Back to Restaurants</a>
    </div>
  `,
  styles: [`
    .restaurant-details {
      min-height: 100vh;
    }

    .restaurant-banner {
      position: relative;
      height: 300px;
      background: #f5f5f5;
      overflow: hidden;
    }

    .banner-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .banner-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
    }

    .banner-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      color: white;
      padding: 2rem;
      z-index: 10;
    }

    .banner-content h1 {
      font-size: 2.5rem;
      margin: 0 0 1rem;
    }

    .restaurant-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
    }

    .star {
      font-size: 1rem;
    }

    .restaurant-description {
      margin: 0 0 1rem;
      opacity: 0.95;
      font-size: 0.95rem;
    }

    .delivery-info-header {
      display: flex;
      gap: 2rem;
      font-weight: 600;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .details-container {
      padding: 3rem 1rem;
    }

    .details-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 2rem;
    }

    .menu-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .menu-categories {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding: 0.5rem 0;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .category-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      background: white;
      color: #424242;
      cursor: pointer;
      font-weight: 600;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
      white-space: nowrap;
      font-family: inherit;
    }

    .category-btn:hover,
    .category-btn.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .food-items-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .food-item-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .food-item-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .food-item-image {
      position: relative;
      height: 200px;
      background: #f5f5f5;
      overflow: hidden;
    }

    .food-item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .food-item-card:hover .food-item-image img {
      transform: scale(1.05);
    }

    .item-badges {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .badge {
      padding: 0.35rem 0.75rem;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-veg {
      background: #4caf50;
      color: white;
    }

    .badge-nonveg {
      background: #f44336;
      color: white;
    }

    .food-item-content {
      padding: 1.5rem;
    }

    .food-item-content h3 {
      margin: 0 0 0.5rem;
      color: #212121;
      font-size: 1.1rem;
    }

    .description {
      color: #757575;
      font-size: 0.85rem;
      margin: 0 0 0.75rem;
      line-height: 1.4;
    }

    .item-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #667eea;
    }

    .rating {
      font-size: 0.85rem;
      color: #424242;
    }

    .btn-add-to-cart {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn-add-to-cart:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
    }

    /* Sidebar */
    .details-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .sidebar-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .sidebar-card h3 {
      margin: 0 0 1rem;
      color: #212121;
      font-size: 1.1rem;
    }

    .about-content p {
      margin: 0.5rem 0;
      color: #424242;
      font-size: 0.9rem;
    }

    .about-content p.mt {
      margin-top: 1rem;
    }

    .cuisine-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .tag {
      background: #f5f5f5;
      padding: 0.35rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      color: #424242;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 400px;
      overflow-y: auto;
    }

    .review-item {
      padding: 1rem 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .review-item:last-child {
      border-bottom: none;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .review-header strong {
      color: #212121;
      font-size: 0.9rem;
    }

    .review-rating {
      font-size: 0.85rem;
    }

    .review-title {
      font-weight: 600;
      color: #424242;
      margin: 0.25rem 0;
      font-size: 0.9rem;
    }

    .review-comment {
      color: #757575;
      font-size: 0.85rem;
      margin: 0.25rem 0;
      line-height: 1.4;
    }

    .review-date {
      color: #bdbdbd;
      font-size: 0.8rem;
    }

    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      padding: 2rem;
    }

    .not-found h2 {
      color: #212121;
      margin-bottom: 1rem;
    }

    .not-found p {
      color: #757575;
      margin-bottom: 2rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      font-family: inherit;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    @media (max-width: 1024px) {
      .details-layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .banner-content h1 {
        font-size: 1.75rem;
      }

      .restaurant-meta {
        gap: 1rem;
        font-size: 0.85rem;
      }

      .food-items-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RestaurantDetailsComponent implements OnInit {
  restaurant: Restaurant | null = null;
  foodItems: FoodItem[] = [];
  reviews: Review[] = [];
  isLoading = false;

  menuCategories = [
    { id: 'all', name: 'All' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'pasta', name: 'Pasta' },
    { id: 'appetizers', name: 'Appetizers' }
  ];
  selectedCategoryId = 'all';

  constructor(
    private restaurantService: RestaurantService,
    private cartService: CartService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadRestaurantDetails(id);
      }
    });
  }

  private loadRestaurantDetails(id: string): void {
    this.isLoading = true;
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (restaurant) => {
        this.restaurant = restaurant;
        this.loadMenuItems();
        this.loadReviews();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading restaurant details:', error);
        this.isLoading = false;
      }
    });
  }

  private loadMenuItems(): void {
    // Mock menu items
    this.foodItems = [
      {
        id: '1',
        restaurantId: this.restaurant?.id || '',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, basil',
        image: 'https://via.placeholder.com/250x200?text=Margherita',
        price: 350,
        category: 'pizza',
        isVegetarian: true,
        rating: 4.6,
        reviewCount: 125,
        preparationTime: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        restaurantId: this.restaurant?.id || '',
        name: 'Pepperoni Pizza',
        description: 'Pepperoni, cheese, tomato sauce',
        image: 'https://via.placeholder.com/250x200?text=Pepperoni',
        price: 450,
        category: 'pizza',
        isVegetarian: false,
        rating: 4.7,
        reviewCount: 180,
        preparationTime: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        restaurantId: this.restaurant?.id || '',
        name: 'Garlic Bread',
        description: 'Crispy bread with garlic butter',
        image: 'https://via.placeholder.com/250x200?text=Garlic+Bread',
        price: 150,
        category: 'appetizers',
        isVegetarian: true,
        rating: 4.4,
        reviewCount: 95,
        preparationTime: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private loadReviews(): void {
    // Mock reviews
    this.reviews = [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        title: 'Excellent Food!',
        comment: 'Great quality pizza and fast delivery',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 4,
        title: 'Good Restaurant',
        comment: 'Nice ambiance and tasty food',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  selectCategory(categoryId: string): void {
    this.selectedCategoryId = categoryId;
  }

  addToCart(item: FoodItem): void {
    const cartItem = {
      id: item.id,
      foodItem: item,
      quantity: 1,
      price: item.price,
      specialInstructions: ''
    };
    this.cartService.addItem(cartItem);
    this.toastService.showSuccess(`${item.name} added to cart!`);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
