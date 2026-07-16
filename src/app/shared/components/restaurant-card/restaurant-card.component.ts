import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Restaurant } from '@app/models';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="restaurant-card">
      <div class="card-image-container">
        <img [src]="restaurant.image" [alt]="restaurant.name" class="card-image" />
        <div class="card-badges">
          <span class="badge badge-open" *ngIf="restaurant.isOpen">Open Now</span>
          <span class="badge badge-closed" *ngIf="!restaurant.isOpen">Closed</span>
        </div>
      </div>

      <div class="card-content">
        <div class="card-header">
          <h3>{{ restaurant.name }}</h3>
          <div class="rating">
            <span class="star">⭐</span>
            <span class="rating-value">{{ restaurant.rating }}</span>
            <span class="review-count">({{ restaurant.reviewCount }})</span>
          </div>
        </div>

        <p class="description">{{ restaurant.description }}</p>

        <div class="cuisines">
          <span *ngFor="let cuisine of restaurant.cuisineTypes" class="cuisine-tag">
            {{ cuisine }}
          </span>
        </div>

        <div class="card-footer">
          <div class="delivery-info">
            <span class="delivery-time">⏱️ {{ restaurant.minDeliveryTime }}-{{ restaurant.maxDeliveryTime }} min</span>
            <span class="delivery-charge">₹{{ restaurant.deliveryCharge }}</span>
          </div>
          <a [routerLink]="['/restaurants', restaurant.id]" class="btn-view">
            View Menu →
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .restaurant-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .restaurant-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .card-image-container {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #f5f5f5;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .restaurant-card:hover .card-image {
      transform: scale(1.05);
    }

    .card-badges {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge-open {
      background: #4caf50;
      color: white;
    }

    .badge-closed {
      background: #f44336;
      color: white;
    }

    .card-content {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .card-header h3 {
      margin: 0;
      color: #212121;
      font-size: 1.1rem;
      flex: 1;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      white-space: nowrap;
    }

    .star {
      font-size: 1rem;
    }

    .rating-value {
      font-weight: 600;
      color: #212121;
    }

    .review-count {
      color: #757575;
      font-size: 0.85rem;
    }

    .description {
      color: #757575;
      font-size: 0.9rem;
      margin: 0 0 0.75rem;
      line-height: 1.4;
    }

    .cuisines {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .cuisine-tag {
      background: #f5f5f5;
      color: #424242;
      padding: 0.3rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }

    .card-footer {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .delivery-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: #757575;
    }

    .delivery-time {
      font-weight: 600;
      color: #212121;
    }

    .delivery-charge {
      font-size: 0.8rem;
    }

    .btn-view {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .btn-view:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
    }

    @media (max-width: 768px) {
      .card-image-container {
        height: 150px;
      }

      .card-header {
        flex-direction: column;
      }

      .card-footer {
        flex-direction: column;
        align-items: flex-start;
      }

      .btn-view {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class RestaurantCardComponent {
  @Input() restaurant!: Restaurant;
}
