import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '@core/services/order.service';
import { Order } from '@app/models';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  template: `
    <app-loader *ngIf="isLoading" message="Loading order details..."></app-loader>

    <div *ngIf="!isLoading && order" class="order-details-container">
      <!-- Header -->
      <div class="details-header">
        <div class="container">
          <div class="header-content">
            <div>
              <h1>Order #{{ order.id }}</h1>
              <p>{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="status-badge" [ngClass]="'status-' + order.status">
              {{ getStatusLabel(order.status) }}
            </div>
          </div>
        </div>
      </div>

      <div class="container details-main">
        <div class="details-layout">
          <!-- Main Content -->
          <main class="details-content">
            <!-- Order Items -->
            <section class="details-section">
              <h2>📦 Order Items</h2>
              <div class="items-list">
                <div *ngFor="let item of order.items" class="item-row">
                  <div class="item-info">
                    <h4>{{ item.foodItem.name }}</h4>
                    <p>{{ item.foodItem.description }}</p>
                  </div>
                  <div class="item-qty">x{{ item.quantity }}</div>
                  <div class="item-price">₹{{ item.quantity * item.foodItem.price }}</div>
                </div>
              </div>
            </section>

            <!-- Delivery Address -->
            <section class="details-section">
              <h2>📍 Delivery Address</h2>
              <div class="address-box">
                <div class="address-header">
                  <h3>{{ order.deliveryAddress.type }}</h3>
                  <span class="badge">Primary</span>
                </div>
                <p>{{ order.deliveryAddress.street }}</p>
                <p *ngIf="order.deliveryAddress.apartment">{{ order.deliveryAddress.apartment }}</p>
                <p>{{ order.deliveryAddress.city }}, {{ order.deliveryAddress.state }} {{ order.deliveryAddress.zipCode }}</p>
                <p>{{ order.deliveryAddress.country }}</p>
                <p class="phone">📱 {{ order.deliveryAddress.phone }}</p>
              </div>
            </section>

            <!-- Special Instructions -->
            <section class="details-section" *ngIf="order.specialInstructions">
              <h2>📝 Special Instructions</h2>
              <div class="instructions-box">
                {{ order.specialInstructions }}
              </div>
            </section>

            <!-- Order Timeline -->
            <section class="details-section">
              <h2>📋 Order Timeline</h2>
              <div class="timeline">
                <div class="timeline-item" [class.completed]="isStatusCompleted(order.status, 'pending')">
                  <div class="timeline-marker">✓</div>
                  <div class="timeline-content">
                    <h4>Order Placed</h4>
                    <p>{{ formatTime(order.createdAt) }}</p>
                  </div>
                </div>
                <div class="timeline-item" [class.completed]="isStatusCompleted(order.status, 'confirmed')">
                  <div class="timeline-marker">✓</div>
                  <div class="timeline-content">
                    <h4>Order Confirmed</h4>
                    <p>Restaurant confirmed your order</p>
                  </div>
                </div>
                <div class="timeline-item" [class.completed]="isStatusCompleted(order.status, 'preparing')">
                  <div class="timeline-marker">👨‍🍳</div>
                  <div class="timeline-content">
                    <h4>Preparing</h4>
                    <p>Your food is being prepared</p>
                  </div>
                </div>
                <div class="timeline-item" [class.completed]="isStatusCompleted(order.status, 'out_for_delivery')">
                  <div class="timeline-marker">🚴</div>
                  <div class="timeline-content">
                    <h4>Out for Delivery</h4>
                    <p>Your order is on the way</p>
                  </div>
                </div>
                <div class="timeline-item" [class.completed]="isStatusCompleted(order.status, 'delivered')">
                  <div class="timeline-marker">🎉</div>
                  <div class="timeline-content">
                    <h4>Delivered</h4>
                    <p>Your order has been delivered</p>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <!-- Sidebar -->
          <aside class="details-sidebar">
            <!-- Order Summary -->
            <div class="sidebar-card">
              <h3>Order Summary</h3>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>₹{{ order.subtotal }}</span>
              </div>
              <div class="summary-row">
                <span>Tax (10%)</span>
                <span>₹{{ (order.tax ?? 0) | number: '1.2-2' }}</span>
              </div>
              <div class="summary-row">
                <span>Delivery Charges</span>
                <span>₹{{ order.deliveryCharge }}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row total">
                <span>Total Amount</span>
                <span>₹{{ order.total }}</span>
              </div>
            </div>

            <!-- Payment Info -->
            <div class="sidebar-card">
              <h3>💳 Payment</h3>
              <p class="info-text">Payment Method: <strong>{{ getPaymentLabel(order.paymentMethod) }}</strong></p>
              <p class="info-text">Status: <span class="badge success">Paid</span></p>
            </div>

            <!-- Actions -->
            <div class="sidebar-card">
              <h3>Actions</h3>
              <button *ngIf="order.status === 'pending'" class="btn btn-danger">Cancel Order</button>
              <button *ngIf="order.status === 'delivered'" class="btn btn-primary">Reorder</button>
              <a routerLink="/orders" class="btn btn-secondary">Back to Orders</a>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div *ngIf="!isLoading && !order" class="not-found">
      <h2>Order not found</h2>
      <p>The order you're looking for doesn't exist.</p>
      <a routerLink="/orders" class="btn btn-primary">Back to Orders</a>
    </div>
  `,
  styles: [`
    .order-details-container {
      min-height: calc(100vh - 140px);
      background: #f5f5f5;
    }

    .details-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .details-header h1 {
      font-size: 2rem;
      margin: 0 0 0.5rem;
    }

    .details-header p {
      margin: 0;
      opacity: 0.9;
    }

    .status-badge {
      padding: 0.75rem 1.5rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .status-pending {
      background: rgba(255, 255, 255, 0.2);
      color: #fff3cd;
    }

    .status-confirmed,
    .status-preparing,
    .status-out_for_delivery,
    .status-delivered {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .details-main {
      margin-bottom: 4rem;
    }

    .details-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 2rem;
    }

    /* Content Sections */
    .details-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .details-section h2 {
      margin: 0 0 1.5rem;
      color: #212121;
      font-size: 1.3rem;
    }

    /* Items List */
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .item-row {
      display: grid;
      grid-template-columns: 1fr 60px 100px;
      gap: 1.5rem;
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      align-items: center;
    }

    .item-info h4 {
      margin: 0 0 0.5rem;
      color: #212121;
    }

    .item-info p {
      margin: 0;
      color: #757575;
      font-size: 0.85rem;
    }

    .item-qty {
      text-align: center;
      font-weight: 600;
      color: #667eea;
    }

    .item-price {
      text-align: right;
      font-weight: 700;
      color: #212121;
    }

    /* Address Box */
    .address-box {
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .address-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .address-header h3 {
      margin: 0;
      color: #212121;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #e8eeff;
      color: #667eea;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge.success {
      background: #d1e7dd;
      color: #0f5132;
    }

    .address-box p {
      margin: 0.5rem 0;
      color: #424242;
      line-height: 1.6;
    }

    .phone {
      margin-top: 1rem;
      font-weight: 600;
    }

    /* Instructions Box */
    .instructions-box {
      padding: 1rem;
      background: #f0f4ff;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      color: #424242;
      line-height: 1.6;
    }

    /* Timeline */
    .timeline {
      position: relative;
      padding-left: 2rem;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e0e0e0;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 2rem;
      display: flex;
      gap: 1.5rem;
    }

    .timeline-item:last-child {
      margin-bottom: 0;
    }

    .timeline-marker {
      position: absolute;
      left: -11px;
      width: 24px;
      height: 24px;
      background: white;
      border: 3px solid #e0e0e0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      color: #bdbdbd;
      transition: all 0.3s ease;
    }

    .timeline-item.completed .timeline-marker {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
      color: white;
    }

    .timeline-content h4 {
      margin: 0 0 0.25rem;
      color: #212121;
    }

    .timeline-content p {
      margin: 0;
      color: #757575;
      font-size: 0.9rem;
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
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
    }

    .summary-row span:first-child {
      color: #757575;
    }

    .summary-row span:last-child {
      font-weight: 600;
      color: #212121;
    }

    .summary-row.total {
      font-size: 1.1rem;
      margin-top: 1rem;
    }

    .summary-row.total span:last-child {
      color: #667eea;
    }

    .summary-divider {
      height: 1px;
      background: #e0e0e0;
      margin: 1rem 0;
    }

    .info-text {
      margin: 0.75rem 0;
      color: #424242;
      font-size: 0.9rem;
    }

    /* Buttons */
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
      margin-bottom: 0.75rem;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #212121;
      border: 1px solid #e0e0e0;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .btn-danger {
      background: #f44336;
      color: white;
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(244, 67, 54, 0.3);
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

    @media (max-width: 1024px) {
      .details-layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .item-row {
        grid-template-columns: 1fr;
      }

      .item-price {
        text-align: left;
      }
    }
  `]
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  isLoading = false;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadOrderDetails(id);
      }
    });
  }

  private loadOrderDetails(id: string): void {
    this.isLoading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: '⏳ Pending',
      confirmed: '✓ Confirmed',
      preparing: '👨‍🍳 Preparing',
      out_for_delivery: '🚴 Out for Delivery',
      delivered: '🎉 Delivered',
      cancelled: '✗ Cancelled'
    };
    return labels[status] || status;
  }

  isStatusCompleted(orderStatus: string, checkStatus: string): boolean {
    const statusOrder = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const orderIndex = statusOrder.indexOf(orderStatus);
    const checkIndex = statusOrder.indexOf(checkStatus);
    return orderIndex >= checkIndex;
  }

  getPaymentLabel(method: string): string {
    const labels: { [key: string]: string } = {
      credit: '💳 Credit Card',
      debit: '🏦 Debit Card',
      wallet: '💰 Digital Wallet',
      cod: '💵 Cash on Delivery'
    };
    return labels[method] || method;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
