import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '@core/services/restaurant.service';
import { Restaurant } from '@app/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RestaurantCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Hungry? 🍕</h1>
        <p>Discover delicious food from your favorite restaurants</p>
        <div class="hero-search">
          <input
            type="text"
            placeholder="Search for restaurants or cuisines..."
            class="search-input"
            (input)="onSearch($event)"
          />
          <button class="btn-search">🔍</button>
        </div>
      </div>
      <div class="hero-image">
        <div class="emoji-large">🍔</div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section categories">
      <div class="container">
        <h2>Browse by Category</h2>
        <div class="categories-grid">
          <div
            *ngFor="let category of categories"
            class="category-card"
            (click)="selectCategory(category.id)"
            [class.active]="selectedCategory === category.id"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <div class="category-name">{{ category.name }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Offers Section -->
    <section class="section offers">
      <div class="container">
        <h2>🎉 Featured Offers</h2>
        <div class="offers-grid">
          <div *ngFor="let offer of featuredOffers" class="offer-card">
            <div class="offer-badge">{{ offer.discount }}% OFF</div>
            <div class="offer-image" [style.background-image]="'url(' + offer.image + ')'"></div>
            <div class="offer-content">
              <h3>{{ offer.title }}</h3>
              <p>{{ offer.description }}</p>
              <p class="offer-code">Code: <strong>{{ offer.code }}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Restaurants Section -->
    <section class="section restaurants">
      <div class="container">
        <div class="section-header">
          <h2>Popular Restaurants</h2>
          <a routerLink="/restaurants" class="view-all">View All →</a>
        </div>
        <div class="restaurants-grid">
          <app-restaurant-card
            *ngFor="let restaurant of popularRestaurants"
            [restaurant]="restaurant"
          ></app-restaurant-card>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section how-it-works">
      <div class="container">
        <h2>How It Works</h2>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">1</div>
            <div class="step-icon">🔍</div>
            <h3>Search</h3>
            <p>Find your favorite restaurant or cuisine</p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <div class="step-icon">🛒</div>
            <h3>Select</h3>
            <p>Browse menu and add items to cart</p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <div class="step-icon">💳</div>
            <h3>Checkout</h3>
            <p>Enter delivery address and payment details</p>
          </div>
          <div class="step-card">
            <div class="step-number">4</div>
            <div class="step-icon">🚴</div>
            <h3>Deliver</h3>
            <p>Track your order and receive delicious food</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Order?</h2>
          <p>Explore thousands of restaurants and food items</p>
          <a routerLink="/restaurants" class="btn btn-primary btn-large">Start Exploring</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
      min-height: 500px;
    }

    .hero-content h1 {
      font-size: 3.5rem;
      margin: 0 0 1rem;
      font-weight: 700;
    }

    .hero-content > p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.95;
    }

    .hero-search {
      display: flex;
      gap: 0.5rem;
      background: white;
      border-radius: 50px;
      padding: 0.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 0 1.5rem;
      font-size: 1rem;
      background: transparent;
    }

    .btn-search {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      cursor: pointer;
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }

    .btn-search:hover {
      transform: scale(1.05);
    }

    .hero-image {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .emoji-large {
      font-size: 200px;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .section {
      padding: 4rem 2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section h2 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: #212121;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .view-all {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .view-all:hover {
      transform: translateX(5px);
    }

    /* Categories Section */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .category-card:hover,
    .category-card.active {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.2);
    }

    .category-icon {
      font-size: 3rem;
      margin-bottom: 0.75rem;
    }

    .category-name {
      font-weight: 600;
      color: #212121;
      font-size: 0.95rem;
    }

    /* Offers Section */
    .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .offer-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }

    .offer-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .offer-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #FF6B35;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      z-index: 10;
    }

    .offer-image {
      height: 150px;
      background-size: cover;
      background-position: center;
      background-color: #f5f5f5;
    }

    .offer-content {
      padding: 1.5rem;
    }

    .offer-content h3 {
      margin: 0 0 0.5rem;
      color: #212121;
    }

    .offer-content p {
      color: #757575;
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }

    .offer-code {
      background: #f5f5f5;
      padding: 0.5rem;
      border-radius: 4px;
      font-family: monospace;
      margin-top: 0.75rem;
    }

    /* Restaurants Section */
    .restaurants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }

    /* How It Works Section */
    .how-it-works {
      background: #f5f5f5;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .step-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .step-number {
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .step-icon {
      font-size: 3rem;
      margin: 1rem 0;
    }

    .step-card h3 {
      margin: 0.75rem 0 0.5rem;
      color: #212121;
    }

    .step-card p {
      color: #757575;
      font-size: 0.9rem;
      margin: 0;
    }

    /* CTA Section */
    .cta {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .cta-content h2 {
      color: white;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .cta-content p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.95;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      font-family: inherit;
      font-size: 1rem;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-large {
      padding: 1rem 3rem;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .hero {
        grid-template-columns: 1fr;
        min-height: auto;
      }

      .emoji-large {
        font-size: 100px;
      }

      .hero-content h1 {
        font-size: 2rem;
      }

      .section {
        padding: 2rem 1rem;
      }

      .section h2 {
        font-size: 1.75rem;
      }

      .categories-grid {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      }

      .steps-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  popularRestaurants: Restaurant[] = [];
  selectedCategory: string | null = null;

  categories = [
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'burger', name: 'Burger', icon: '🍔' },
    { id: 'sushi', name: 'Sushi', icon: '🍣' },
    { id: 'indian', name: 'Indian', icon: '🍛' },
    { id: 'chinese', name: 'Chinese', icon: '🥢' },
    { id: 'dessert', name: 'Dessert', icon: '🍰' }
  ];

  featuredOffers = [
    {
      id: 1,
      title: 'Pizza Paradise',
      description: 'Get any large pizza with extra toppings',
      discount: 30,
      code: 'PIZZA30',
      image: 'https://via.placeholder.com/300x150?text=Pizza+Offer'
    },
    {
      id: 2,
      title: 'Burger Bonanza',
      description: 'Buy 2 burgers and get 1 free',
      discount: 50,
      code: 'BURGER50',
      image: 'https://via.placeholder.com/300x150?text=Burger+Offer'
    },
    {
      id: 3,
      title: 'Sushi Special',
      description: 'Free delivery on orders above ₹500',
      discount: 20,
      code: 'SUSHI20',
      image: 'https://via.placeholder.com/300x150?text=Sushi+Offer'
    }
  ];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (restaurants) => {
        this.popularRestaurants = restaurants.slice(0, 6);
      },
      error: (error) => {
        console.error('Error loading restaurants:', error);
      }
    });
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = this.selectedCategory === categoryId ? null : categoryId;
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    console.log('Search for:', searchTerm);
    // TODO: Implement search functionality
  }
}

import { RestaurantCardComponent } from '@shared/components/restaurant-card/restaurant-card.component';
