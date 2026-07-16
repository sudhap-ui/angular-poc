import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '@core/services/order.service';
import { Order, OrderStatus } from '@app/models';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent, EmptyStateComponent],
  template: `
    <div class="orders-container">
      <!-- Header -->
      <div class="orders-header">
        <div class="container">
          <h1>📦 Your Orders</h1>
          <p>Track and manage your food orders</p>
        </div>
      </div>

      <div class="container orders-main">
        <!-- Tabs -->
        <div class="orders-tabs">
          <button
            (click)="setCurrentTab('current')"
            [class.active]="currentTab === 'current'"
            class="tab-btn"
          >
            Current Orders
          </button>
          <button
            (click)="setCurrentTab('history')"
            [class.active]="currentTab === 'history'"
            class="tab-btn"
          >
            Order History
          </button>
        </div>

        <!-- Loading State -->
        <app-loader *ngIf="isLoading" message="Loading orders..."></app-loader>

        <!-- Current Orders -->
        <div *ngIf="!isLoading && currentTab === 'current'" class="orders-section">
          <div *ngIf="currentOrders.length === 0" class="empty-section">
            <app-empty-state
              [config]="{
                title: 'No active orders',
                message: 'You don\'t have any active orders at the moment',
                icon: '📦',
                actionLabel: 'Start Ordering'
              }"
              (action)="startOrdering()"
            ></app-empty-state>
          </div>

          <div *ngIf="currentOrders.length > 0" class="orders-grid">
            <div *ngFor="let order of currentOrders" class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <h3>Order #{{ order.id }}</h3>
                  <p class="order-date">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div class="order-status" [ngClass]="'status-' + order.status">
                  {{ getStatusLabel(order.status) }}
                </div>
              </div>

              <div class="order-progress">
                <div class="progress-step" [class.completed]="isStatusCompleted(order.status, 'confirmed')">
                  <div class="progress-icon">✓</div>
                  <span>Confirmed</span>
                </div>
                <div class="progress-line" [class.completed]="isStatusCompleted(order.status, 'preparing')"></div>
                <div class="progress-step" [class.completed]="isStatusCompleted(order.status, 'preparing')">
                  <div class="progress-icon">👨‍🍳</div>
                  <span>Preparing</span>
                </div>
                <div class="progress-line" [class.completed]="isStatusCompleted(order.status, 'out_for_delivery')"></div>
                <div class="progress-step" [class.completed]="isStatusCompleted(order.status, 'out_for_delivery')">
                  <div class="progress-icon">🚴</div>
                  <span>On Way</span>
                </div>
                <div class="progress-line" [class.completed]="isStatusCompleted(order.status, 'delivered')"></div>
                <div class="progress-step" [class.completed]="isStatusCompleted(order.status, 'delivered')">
                  <div class="progress-icon">🚪</div>
                  <span>Delivered</span>
                </div>
              </div>

              <div class="order-details">
                <p><strong>Items:</strong> {{ order.items.length }} items</p>
                <p><strong>Total:</strong> ₹{{ order.total }}</p>
                <p><strong>Delivery:</strong> {{ order.deliveryAddress.city }}</p>
              </div>

              <div class="order-actions">
                <a [routerLink]="['/orders', order.id]" class="btn-view">View Details</a>
                <button *ngIf="order.status === 'pending'" class="btn-cancel">Cancel Order</button>
                <button *ngIf="order.status === 'delivered'" class="btn-reorder">Reorder</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order History -->
        <div *ngIf="!isLoading && currentTab === 'history'" class="orders-section">
          <div *ngIf="orderHistory.length === 0" class="empty-section">
            <app-empty-state
              [config]="{
                title: 'No order history',
                message: 'You haven\'t placed any orders yet',
                icon: '📋',
                actionLabel: 'Start Ordering'
              }"
              (action)="startOrdering()"
            ></app-empty-state>
          </div>

          <div *ngIf="orderHistory.length > 0" class="orders-list">
            <div *ngFor="let order of orderHistory" class="history-item">
              <div class="history-header">
                <div class="history-info">
                  <h4>Order #{{ order.id }}</h4>
                  <p class="history-date">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div class="history-amount">
                  <strong>₹{{ order.total }}</strong>
                </div>
              </div>
              <div class="history-items">
                <div *ngFor="let item of order.items" class="history-item-row">
                  <span>{{ item.foodItem.name }} x{{ item.quantity }}</span>
                  <span>₹{{ item.quantity * item.foodItem.price }}</span>
                </div>
              </div>
              <div class="history-footer">
                <a [routerLink]="['/orders', order.id]" class="link">View Details</a>
                <button class="link reorder-link">Reorder</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      min-height: calc(100vh - 140px);
      background: #f5f5f5;
    }

    .orders-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 2rem;
      margin-bottom: 2rem;
    }

    .orders-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem;
    }

    .orders-header p {
      margin: 0.5rem 0 0;
      opacity: 0.95;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .orders-main {
      margin-bottom: 4rem;
    }

    /* Tabs */
    .orders-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid #e0e0e0;
      background: white;
      padding: 0 1rem;
      border-radius: 12px 12px 0 0;
    }

    .tab-btn {
      padding: 1rem 1.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-weight: 600;
      color: #757575;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      border-bottom: 3px solid transparent;
      font-family: inherit;
      margin-bottom: -2px;
    }

    .tab-btn:hover {
      color: #667eea;
    }

    .tab-btn.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    /* Orders Section */
    .orders-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .empty-section {
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Orders Grid (Current) */
    .orders-grid {
      display: grid;
      gap: 2rem;
    }

    .order-card {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .order-card:hover {
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .order-info h3 {
      margin: 0 0 0.25rem;
      color: #212121;
      font-size: 1.1rem;
    }

    .order-date {
      margin: 0;
      color: #757575;
      font-size: 0.85rem;
    }

    .order-status {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-confirmed {
      background: #d1ecf1;
      color: #0c5460;
    }

    .status-preparing {
      background: #cfe2ff;
      color: #084298;
    }

    .status-out_for_delivery {
      background: #d1e7dd;
      color: #0f5132;
    }

    .status-delivered {
      background: #d1e7dd;
      color: #0f5132;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #842029;
    }

    /* Progress */
    .order-progress {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
      padding: 1rem 0;
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 8px;
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      min-width: 60px;
    }

    .progress-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e0e0e0;
      color: white;
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .progress-step.completed .progress-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .progress-step span {
      font-size: 0.75rem;
      color: #757575;
      text-align: center;
      font-weight: 600;
    }

    .progress-line {
      width: 30px;
      height: 3px;
      background: #e0e0e0;
      margin-top: 10px;
      transition: all 0.3s ease;
    }

    .progress-line.completed {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }

    /* Order Details */
    .order-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .order-details p {
      margin: 0;
      font-size: 0.9rem;
      color: #424242;
    }

    .order-details strong {
      color: #212121;
    }

    /* Order Actions */
    .order-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-view,
    .btn-cancel,
    .btn-reorder {
      flex: 1;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
      font-family: inherit;
    }

    .btn-view {
      background: #667eea;
      color: white;
    }

    .btn-view:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
    }

    .btn-cancel {
      background: #f5f5f5;
      color: #212121;
      border: 1px solid #e0e0e0;
    }

    .btn-cancel:hover {
      background: #e0e0e0;
    }

    .btn-reorder {
      background: #4caf50;
      color: white;
    }

    .btn-reorder:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(76, 175, 80, 0.3);
    }

    /* Orders List (History) */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .history-item {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .history-item:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .history-info h4 {
      margin: 0 0 0.25rem;
      color: #212121;
    }

    .history-date {
      margin: 0;
      color: #757575;
      font-size: 0.85rem;
    }

    .history-amount {
      text-align: right;
    }

    .history-amount strong {
      font-size: 1.25rem;
      color: #667eea;
    }

    .history-items {
      margin-bottom: 1rem;
      max-height: 200px;
      overflow-y: auto;
    }

    .history-item-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.9rem;
      color: #424242;
      border-bottom: 1px solid #f0f0f0;
    }

    .history-footer {
      display: flex;
      gap: 2rem;
    }

    .link {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-weight: 600;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .link:hover {
      color: #764ba2;
    }

    .reorder-link {
      padding: 0;
    }

    @media (max-width: 768px) {
      .orders-header h1 {
        font-size: 1.75rem;
      }

      .order-details {
        grid-template-columns: 1fr;
      }

      .order-actions {
        flex-direction: column;
      }

      .order-progress {
        overflow-x: auto;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  currentOrders: Order[] = [];
  orderHistory: Order[] = [];
  isLoading = false;
  currentTab: 'current' | 'history' = 'current';

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.isLoading = true;
    this.orderService.getUserOrders('user1').subscribe({
      next: (orders) => {
        this.orders = orders;
        this.separateOrders();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  private separateOrders(): void {
    const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery'];
    this.currentOrders = this.orders.filter(o => statuses.includes(o.status));
    this.orderHistory = this.orders.filter(o => !statuses.includes(o.status));
  }

  setCurrentTab(tab: 'current' | 'history'): void {
    this.currentTab = tab;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: '⏳ Pending',
      confirmed: '✓ Confirmed',
      preparing: '👨‍🍳 Preparing',
      out_for_delivery: '🚴 Out for Delivery',
      delivered: '🚪 Delivered',
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  startOrdering(): void {
    // Navigate to restaurants
  }
}
