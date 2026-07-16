import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { ToastService } from '@core/services/toast.service';
import { Cart, CartItem } from '@app/models';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, EmptyStateComponent],
  template: `
    <div class="cart-container">
      <!-- Header -->
      <div class="cart-header">
        <div class="container">
          <h1>🛒 Shopping Cart</h1>
          <p>Review your items before checkout</p>
        </div>
      </div>

      <div class="container cart-main">
        <div *ngIf="!cart || cart.items.length === 0" class="empty-cart">
          <app-empty-state
            [config]="{
              title: 'Your cart is empty',
              message: 'Add some delicious items from restaurants to get started',
              icon: '🛒',
              actionLabel: 'Continue Shopping'
            }"
            (action)="continueShopping()"
          ></app-empty-state>
        </div>

        <div *ngIf="cart && cart.items.length > 0" class="cart-layout">
          <!-- Cart Items -->
          <main class="cart-items-section">
            <div class="cart-items-header">
              <h2>Items ({{ cart.items.length }})</h2>
              <button (click)="clearCart()" class="btn-clear-cart">Clear Cart</button>
            </div>

            <div class="cart-items-list">
              <div *ngFor="let item of cart.items" class="cart-item">
                <div class="item-image">
                  <img [src]="item.foodItem.image" [alt]="item.foodItem.name" />
                </div>
                <div class="item-details">
                  <h3>{{ item.foodItem.name }}</h3>
                  <p class="restaurant-name">{{ item.foodItem.description }}</p>
                  <div class="item-info">
                    <span class="price">₹{{ item.foodItem.price }}</span>
                    <span *ngIf="item.foodItem.isVegetarian" class="badge badge-veg">🌱 Veg</span>
                    <span *ngIf="!item.foodItem.isVegetarian" class="badge badge-nonveg">🍗 Non-Veg</span>
                  </div>
                </div>
                <div class="quantity-control">
                  <button
                    (click)="decreaseQuantity(item.id)"
                    class="qty-btn"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    [value]="item.quantity"
                    (change)="updateQuantity(item.id, $event)"
                    class="qty-input"
                    min="1"
                  />
                  <button
                    (click)="increaseQuantity(item.id)"
                    class="qty-btn"
                  >
                    +
                  </button>
                </div>
                <div class="item-total">
                  <div class="total-price">₹{{ item.quantity * item.foodItem.price }}</div>
                  <button
                    (click)="removeItem(item.id)"
                    class="btn-remove"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </main>

          <!-- Order Summary -->
          <aside class="order-summary">
            <div class="summary-card">
              <h3>Order Summary</h3>

              <div class="summary-row">
                <span class="label">Subtotal</span>
                <span class="value">₹{{ cart.subtotal }}</span>
              </div>

              <div class="summary-row">
                <span class="label">Tax (10%)</span>
                <span class="value">₹{{ cart.tax | number: '1.2-2' }}</span>
              </div>

              <div class="summary-row">
                <span class="label">Delivery Charges</span>
                <span class="value">₹{{ cart.deliveryCharge }}</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total">
                <span class="label">Total Amount</span>
                <span class="value">₹{{ cart.total }}</span>
              </div>

              <div class="summary-info">
                <p>
                  <span class="icon">🎁</span>
                  Apply promo code at checkout
                </p>
              </div>

              <a routerLink="/checkout" class="btn btn-checkout">Proceed to Checkout</a>

              <a routerLink="/restaurants" class="btn btn-continue-shopping">
                Continue Shopping
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      min-height: calc(100vh - 140px);
      background: #f5f5f5;
    }

    .cart-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 2rem;
      margin-bottom: 2rem;
    }

    .cart-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem;
    }

    .cart-header p {
      margin: 0.5rem 0 0;
      opacity: 0.95;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .cart-main {
      margin-bottom: 4rem;
    }

    .empty-cart {
      min-height: 50vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
    }

    /* Cart Items Section */
    .cart-items-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .cart-items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .cart-items-header h2 {
      margin: 0;
      color: #212121;
      font-size: 1.5rem;
    }

    .btn-clear-cart {
      background: #f44336;
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn-clear-cart:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(244, 67, 54, 0.3);
    }

    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 100px 1fr 150px 120px;
      gap: 1.5rem;
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 8px;
      align-items: center;
      border: 1px solid #e0e0e0;
      transition: all 0.3s ease;
    }

    .cart-item:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .item-image {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      background: #f5f5f5;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details h3 {
      margin: 0 0 0.25rem;
      color: #212121;
      font-size: 1rem;
    }

    .restaurant-name {
      color: #757575;
      font-size: 0.85rem;
      margin: 0 0 0.75rem;
    }

    .item-info {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .price {
      font-weight: 700;
      color: #667eea;
      font-size: 1rem;
    }

    .badge {
      padding: 0.25rem 0.6rem;
      border-radius: 12px;
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

    .quantity-control {
      display: flex;
      align-items: center;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      overflow: hidden;
    }

    .qty-btn {
      background: white;
      border: none;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 1.2rem;
      color: #667eea;
      transition: all 0.2s ease;
    }

    .qty-btn:hover {
      background: #f5f5f5;
    }

    .qty-input {
      width: 60px;
      border: none;
      text-align: center;
      font-weight: 600;
      font-size: 1rem;
      background: white;
    }

    .qty-input:focus {
      outline: none;
    }

    .item-total {
      text-align: right;
    }

    .total-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #212121;
      margin-bottom: 0.5rem;
    }

    .btn-remove {
      background: #ffebee;
      border: none;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .btn-remove:hover {
      background: #ffcdd2;
    }

    /* Order Summary */
    .order-summary {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .summary-card h3 {
      margin: 0 0 1.5rem;
      color: #212121;
      font-size: 1.25rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }

    .summary-row .label {
      color: #757575;
    }

    .summary-row .value {
      font-weight: 600;
      color: #212121;
    }

    .summary-row.total {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }

    .summary-row.total .value {
      color: #667eea;
      font-size: 1.25rem;
    }

    .summary-divider {
      height: 1px;
      background: #e0e0e0;
      margin: 1rem 0;
    }

    .summary-info {
      background: #f5f5f5;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
      color: #424242;
    }

    .summary-info p {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .icon {
      font-size: 1rem;
    }

    .btn {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      font-family: inherit;
      transition: all 0.3s ease;
      margin-bottom: 0.75rem;
    }

    .btn-checkout {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-checkout:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-continue-shopping {
      background: #f5f5f5;
      color: #212121;
      border: 1px solid #e0e0e0;
    }

    .btn-continue-shopping:hover {
      background: #e0e0e0;
    }

    @media (max-width: 1024px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .cart-items-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .cart-item {
        grid-template-columns: 80px 1fr;
        gap: 1rem;
      }

      .quantity-control,
      .item-total {
        grid-column: 2;
        justify-self: start;
      }

      .item-total {
        text-align: left;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  increaseQuantity(itemId: string): void {
    if (this.cart) {
      const item = this.cart.items.find(i => i.id === itemId);
      if (item) {
        this.cartService.updateQuantity(itemId, item.quantity + 1);
      }
    }
  }

  decreaseQuantity(itemId: string): void {
    if (this.cart) {
      const item = this.cart.items.find(i => i.id === itemId);
      if (item && item.quantity > 1) {
        this.cartService.updateQuantity(itemId, item.quantity - 1);
      }
    }
  }

  updateQuantity(itemId: string, event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value);
    if (value > 0) {
      this.cartService.updateQuantity(itemId, value);
    }
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId);
    this.toastService.showInfo('Item removed from cart');
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
      this.toastService.showInfo('Cart cleared');
    }
  }

  continueShopping(): void {
    // Navigate to restaurants
  }
}
