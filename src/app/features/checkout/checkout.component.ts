import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { OrderService } from '@core/services/order.service';
import { ToastService } from '@core/services/toast.service';
import { Cart, Address, PaymentMethod, Order } from '@app/models';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoaderComponent],
  template: `
    <div class="checkout-container">
      <!-- Header -->
      <div class="checkout-header">
        <div class="container">
          <h1>🛍️ Checkout</h1>
          <p>Review and confirm your order</p>
        </div>
      </div>

      <div class="container checkout-main">
        <!-- Progress Steps -->
        <div class="progress-steps">
          <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
            <div class="step-number">1</div>
            <div class="step-label">Delivery Address</div>
          </div>
          <div class="step-connector" [class.active]="currentStep > 1"></div>
          <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
            <div class="step-number">2</div>
            <div class="step-label">Payment</div>
          </div>
          <div class="step-connector" [class.active]="currentStep > 2"></div>
          <div class="step" [class.active]="currentStep >= 3">
            <div class="step-number">3</div>
            <div class="step-label">Review & Order</div>
          </div>
        </div>

        <div class="checkout-layout">
          <!-- Main Content -->
          <main class="checkout-content">
            <!-- Step 1: Delivery Address -->
            <section *ngIf="currentStep === 1" class="checkout-section" [@fadeIn]>
              <div class="section-header">
                <h2>📍 Delivery Address</h2>
                <p>Enter where we should deliver your order</p>
              </div>

              <!-- Saved Addresses -->
              <div *ngIf="savedAddresses.length > 0" class="saved-addresses-section">
                <h3>Saved Addresses</h3>
                <div class="addresses-grid">
                  <button
                    *ngFor="let address of savedAddresses"
                    (click)="selectSavedAddress(address)"
                    [class.selected]="selectedAddressId === address.id"
                    class="address-card"
                  >
                    <div class="address-type">{{ address.type }}</div>
                    <p class="address-text">{{ address.street }}, {{ address.city }}</p>
                    <p class="address-pin">{{ address.zipCode }}</p>
                  </button>
                </div>
              </div>

              <!-- Address Form -->
              <form [formGroup]="addressForm" class="address-form">
                <h3>Enter New Address</h3>

                <div class="form-row">
                  <div class="form-group">
                    <label>Address Type</label>
                    <select formControlName="type" class="form-control">
                      <option value="Home">🏠 Home</option>
                      <option value="Work">💼 Work</option>
                      <option value="Other">📍 Other</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Country</label>
                    <input type="text" formControlName="country" class="form-control" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>State</label>
                    <input type="text" formControlName="state" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>City</label>
                    <input type="text" formControlName="city" class="form-control" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Zip Code</label>
                    <input type="text" formControlName="zipCode" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" formControlName="phone" class="form-control" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Street Address</label>
                  <input type="text" formControlName="street" class="form-control" />
                </div>

                <div class="form-group">
                  <label>Apartment/Suite (Optional)</label>
                  <input type="text" formControlName="apartment" class="form-control" />
                </div>

                <label class="checkbox">
                  <input type="checkbox" formControlName="saveAddress" />
                  <span>Save this address for future orders</span>
                </label>
              </form>
            </section>

            <!-- Step 2: Payment Method -->
            <section *ngIf="currentStep === 2" class="checkout-section" [@fadeIn]>
              <div class="section-header">
                <h2>💳 Payment Method</h2>
                <p>Choose how you want to pay</p>
              </div>

              <div class="payment-options">
                <!-- Credit/Debit Card -->
                <div class="payment-method-group">
                  <h3>💳 Cards</h3>
                  <div class="payment-methods-list">
                    <button
                      *ngFor="let card of savedPaymentMethods"
                      (click)="selectPaymentMethod(card)"
                      [class.selected]="selectedPaymentMethodId === card.id"
                      class="payment-method-btn"
                    >
                      <span class="payment-icon">{{ getPaymentIcon(card.type) }}</span>
                      <span class="payment-details">
                        <strong>{{ card.cardholderName }}</strong>
                        <span class="card-number">{{ card.lastFourDigits }}</span>
                      </span>
                      <span class="checkmark" *ngIf="selectedPaymentMethodId === card.id">✓</span>
                    </button>
                  </div>
                </div>

                <!-- Add New Card -->
                <div class="add-new-card" (click)="toggleAddNewCard()" *ngIf="!showAddNewCard">
                  <span>+ Add New Card</span>
                </div>

                <form *ngIf="showAddNewCard" [formGroup]="cardForm" class="card-form">
                  <div class="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" formControlName="cardholderName" class="form-control" />
                  </div>

                  <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" formControlName="cardNumber" class="form-control" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Expiry Date</label>
                      <input type="text" formControlName="expiryDate" class="form-control" placeholder="MM/YY" />
                    </div>
                    <div class="form-group">
                      <label>CVV</label>
                      <input type="text" formControlName="cvv" class="form-control" placeholder="123" />
                    </div>
                  </div>

                  <label class="checkbox">
                    <input type="checkbox" formControlName="saveCard" />
                    <span>Save card for future purchases</span>
                  </label>

                  <button type="button" (click)="toggleAddNewCard()" class="btn btn-secondary">
                    Cancel
                  </button>
                </form>

                <!-- Other Payment Methods -->
                <div class="payment-method-group">
                  <h3>Other Options</h3>
                  <button
                    (click)="selectPaymentOption('wallet')"
                    [class.selected]="selectedPaymentOption === 'wallet'"
                    class="payment-option-btn"
                  >
                    <span class="icon">💰</span>
                    <span>Digital Wallet</span>
                  </button>
                  <button
                    (click)="selectPaymentOption('cod')"
                    [class.selected]="selectedPaymentOption === 'cod'"
                    class="payment-option-btn"
                  >
                    <span class="icon">💵</span>
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>
            </section>

            <!-- Step 3: Review & Place Order -->
            <section *ngIf="currentStep === 3" class="checkout-section" [@fadeIn]>
              <div class="section-header">
                <h2>📋 Review Your Order</h2>
                <p>Everything looks good? Place your order!</p>
              </div>

              <!-- Order Summary -->
              <div class="review-section">
                <div class="review-item">
                  <h3>📍 Delivery Address</h3>
                  <p>
                    {{ selectedAddress?.street }}<br />
                    {{ selectedAddress?.apartment }}<br />
                    {{ selectedAddress?.city }}, {{ selectedAddress?.state }} {{ selectedAddress?.zipCode }}<br />
                    <strong>📱 {{ selectedAddress?.phone }}</strong>
                  </p>
                </div>

                <div class="review-item">
                  <h3>💳 Payment Method</h3>
                  <p *ngIf="selectedPaymentMethod">
                    {{ selectedPaymentMethod.cardholderName }}<br />
                    Card ending in {{ selectedPaymentMethod.lastFourDigits }}
                  </p>
                  <p *ngIf="!selectedPaymentMethod && selectedPaymentOption">
                    <strong>{{ getPaymentOptionLabel(selectedPaymentOption) }}</strong>
                  </p>
                </div>
              </div>

              <!-- Special Instructions -->
              <div class="special-instructions">
                <label>Special Instructions (Optional)</label>
                <textarea
                  [(ngModel)]="specialInstructions"
                  placeholder="E.g., Ring the doorbell twice, Leave at door, etc."
                  class="form-control"
                ></textarea>
              </div>

              <!-- Terms & Conditions -->
              <div class="terms-section">
                <label class="checkbox">
                  <input type="checkbox" [(ngModel)]="agreeToTerms" />
                  <span>I agree to the terms and conditions</span>
                </label>
              </div>
            </section>
          </main>

          <!-- Sidebar: Order Summary -->
          <aside class="checkout-summary">
            <div class="summary-card">
              <h3>Order Summary</h3>

              <div class="cart-items-summary">
                <div *ngFor="let item of cart?.items" class="summary-item">
                  <span class="item-name">
                    {{ item.foodItem.name }} <span class="qty">x{{ item.quantity }}</span>
                  </span>
                  <span class="item-price">₹{{ item.quantity * item.foodItem.price }}</span>
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row">
                <span class="label">Subtotal</span>
                <span class="value">₹{{ cart?.subtotal }}</span>
              </div>

              <div class="summary-row">
                <span class="label">Tax (10%)</span>
                <span class="value">₹{{ (cart?.tax ?? 0) | number: '1.2-2' }}</span>
              </div>

              <div class="summary-row">
                <span class="label">Delivery</span>
                <span class="value">₹{{ cart?.deliveryCharge }}</span>
              </div>

              <div class="promo-code-section">
                <input
                  type="text"
                  [(ngModel)]="promoCode"
                  placeholder="Enter promo code"
                  class="promo-input"
                />
                <button (click)="applyPromoCode()" class="btn-apply-promo">Apply</button>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total">
                <span class="label">Total Amount</span>
                <span class="value">₹{{ cart?.total }}</span>
              </div>

              <!-- Navigation Buttons -->
              <div class="button-group">
                <button
                  (click)="previousStep()"
                  class="btn btn-secondary"
                  [disabled]="currentStep === 1 || isProcessing"
                >
                  ← Back
                </button>
                <button
                  (click)="nextStep()"
                  class="btn btn-primary"
                  [disabled]="!isStepValid() || isProcessing"
                >
                  <app-loader *ngIf="isProcessing" message="Processing..."></app-loader>
                  <span *ngIf="!isProcessing">{{ currentStep === 3 ? '✓ Place Order' : 'Continue →' }}</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      min-height: calc(100vh - 140px);
      background: #f5f5f5;
    }

    .checkout-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 2rem;
      margin-bottom: 2rem;
    }

    .checkout-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem;
    }

    .checkout-header p {
      margin: 0.5rem 0 0;
      opacity: 0.95;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    /* Progress Steps */
    .progress-steps {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 3rem;
      gap: 2rem;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .step-number {
      width: 50px;
      height: 50px;
      border: 3px solid #e0e0e0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #bdbdbd;
      background: white;
      transition: all 0.3s ease;
    }

    .step.active .step-number {
      border-color: #667eea;
      color: #667eea;
      background: #f0f4ff;
    }

    .step.completed .step-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: transparent;
    }

    .step.completed .step-number::after {
      content: '✓';
    }

    .step-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #757575;
      text-align: center;
    }

    .step.active .step-label {
      color: #667eea;
    }

    .step.completed .step-label {
      color: #4caf50;
    }

    .step-connector {
      width: 60px;
      height: 3px;
      background: #e0e0e0;
      transition: all 0.3s ease;
    }

    .step-connector.active {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }

    /* Main Layout */
    .checkout-main {
      margin-bottom: 4rem;
    }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
    }

    /* Checkout Content */
    .checkout-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .checkout-section {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section-header {
      margin-bottom: 2rem;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 1rem;
    }

    .section-header h2 {
      margin: 0 0 0.5rem;
      color: #212121;
      font-size: 1.5rem;
    }

    .section-header p {
      margin: 0;
      color: #757575;
    }

    /* Address Form */
    .saved-addresses-section {
      margin-bottom: 2rem;
    }

    .saved-addresses-section h3 {
      margin: 0 0 1rem;
      color: #212121;
    }

    .addresses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .address-card {
      padding: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
      font-family: inherit;
    }

    .address-card:hover {
      border-color: #667eea;
    }

    .address-card.selected {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .address-type {
      font-weight: 600;
      color: #667eea;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .address-text {
      margin: 0.25rem 0;
      color: #212121;
      font-size: 0.9rem;
    }

    .address-pin {
      margin: 0.5rem 0 0;
      color: #757575;
      font-size: 0.85rem;
    }

    .address-form {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #e0e0e0;
    }

    .address-form h3 {
      margin: 0 0 1.5rem;
      color: #212121;
    }

    /* Form Groups */
    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #212121;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    /* Checkboxes */
    .checkbox {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      margin-top: 1rem;
      font-size: 0.9rem;
    }

    .checkbox input {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #667eea;
    }

    /* Payment Methods */
    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .payment-method-group h3 {
      margin: 0 0 1rem;
      color: #212121;
    }

    .payment-methods-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .payment-method-btn {
      padding: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
      font-family: inherit;
    }

    .payment-method-btn:hover {
      border-color: #667eea;
    }

    .payment-method-btn.selected {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .payment-icon {
      font-size: 1.5rem;
      min-width: 40px;
    }

    .payment-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .payment-details strong {
      color: #212121;
    }

    .card-number {
      color: #757575;
      font-size: 0.85rem;
    }

    .checkmark {
      color: #4caf50;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .add-new-card {
      padding: 1rem;
      border: 2px dashed #667eea;
      border-radius: 8px;
      background: #f0f4ff;
      cursor: pointer;
      text-align: center;
      color: #667eea;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .add-new-card:hover {
      background: #e8eeff;
    }

    .card-form {
      padding: 1.5rem;
      border: 2px solid #667eea;
      border-radius: 8px;
      background: #f9f9f9;
      margin-top: 1rem;
    }

    .payment-option-btn {
      padding: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: inherit;
      margin-bottom: 0.75rem;
    }

    .payment-option-btn:hover {
      border-color: #667eea;
    }

    .payment-option-btn.selected {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .payment-option-btn .icon {
      font-size: 1.5rem;
    }

    /* Review Section */
    .review-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .review-item {
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .review-item h3 {
      margin: 0 0 0.75rem;
      color: #212121;
    }

    .review-item p {
      margin: 0;
      color: #424242;
      line-height: 1.6;
    }

    /* Special Instructions */
    .special-instructions {
      margin-bottom: 1.5rem;
    }

    .special-instructions label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #212121;
    }

    .special-instructions textarea {
      width: 100%;
      min-height: 100px;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.9rem;
      resize: vertical;
    }

    .special-instructions textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .terms-section {
      padding: 1rem;
      background: #f0f4ff;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    /* Sidebar Summary */
    .checkout-summary {
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

    .cart-items-summary {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
      max-height: 250px;
      overflow-y: auto;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }

    .item-name {
      color: #424242;
    }

    .qty {
      color: #bdbdbd;
      margin-left: 0.5rem;
    }

    .item-price {
      font-weight: 600;
      color: #212121;
    }

    .summary-divider {
      height: 1px;
      background: #e0e0e0;
      margin: 1rem 0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
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

    .promo-code-section {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .promo-input {
      flex: 1;
      padding: 0.6rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
      font-family: inherit;
    }

    .promo-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .btn-apply-promo {
      padding: 0.6rem 1rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn-apply-promo:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
    }

    /* Button Group */
    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      flex: 1;
      padding: 0.85rem 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #212121;
      border: 1px solid #e0e0e0;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #e0e0e0;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 1024px) {
      .checkout-layout {
        grid-template-columns: 1fr;
      }

      .checkout-summary {
        position: static;
      }

      .progress-steps {
        gap: 1rem;
      }

      .step-connector {
        width: 30px;
      }
    }

    @media (max-width: 768px) {
      .checkout-header h1 {
        font-size: 1.75rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .addresses-grid {
        grid-template-columns: 1fr;
      }

      .progress-steps {
        flex-wrap: wrap;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  isProcessing = false;

  cart: Cart | null = null;
  addressForm!: FormGroup;
  cardForm!: FormGroup;

  savedAddresses: Address[] = [];
  savedPaymentMethods: PaymentMethod[] = [];

  selectedAddressId: string | null = null;
  selectedAddress: Address | null = null;
  selectedPaymentMethod: PaymentMethod | null = null;
  selectedPaymentMethodId: string | null = null;
  selectedPaymentOption: string | null = null;

  showAddNewCard = false;
  specialInstructions = '';
  agreeToTerms = false;
  promoCode = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
    this.loadSavedAddresses();
    this.loadSavedPaymentMethods();
  }

  private initializeForms(): void {
    this.addressForm = this.formBuilder.group({
      type: ['Home', Validators.required],
      country: ['India', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      phone: ['', Validators.required],
      street: ['', Validators.required],
      apartment: [''],
      saveAddress: [false]
    });

    this.cardForm = this.formBuilder.group({
      cardholderName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required],
      saveCard: [false]
    });
  }

  private loadSavedAddresses(): void {
    // Mock saved addresses
    this.savedAddresses = [
      {
        id: 'addr1',
        userId: 'user1',
        type: 'Home',
        street: '123 Main Street',
        apartment: 'Apt 456',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94102',
        phone: '+1-555-0123',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'addr2',
        userId: 'user1',
        type: 'Work',
        street: '456 Business Ave',
        apartment: 'Suite 789',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94103',
        phone: '+1-555-0456',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private loadSavedPaymentMethods(): void {
    // Mock payment methods
    this.savedPaymentMethods = [
      {
        id: 'card1',
        userId: 'user1',
        type: 'credit',
        cardholderName: 'John Doe',
        lastFourDigits: '4242',
        expiryDate: '12/25',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'card2',
        userId: 'user1',
        type: 'debit',
        cardholderName: 'John Doe',
        lastFourDigits: '5555',
        expiryDate: '06/26',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  selectSavedAddress(address: Address): void {
    this.selectedAddressId = address.id;
    this.selectedAddress = address;
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethodId = method.id;
    this.selectedPaymentMethod = method;
    this.selectedPaymentOption = null;
  }

  toggleAddNewCard(): void {
    this.showAddNewCard = !this.showAddNewCard;
  }

  selectPaymentOption(option: string): void {
    this.selectedPaymentOption = option;
    this.selectedPaymentMethodId = null;
    this.selectedPaymentMethod = null;
  }

  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.selectedAddress !== null || (this.addressForm.valid && this.addressForm.get('street')?.value);
      case 2:
        return this.selectedPaymentMethod !== null || this.selectedPaymentOption !== null;
      case 3:
        return this.agreeToTerms && this.selectedAddress !== null;
      default:
        return false;
    }
  }

  nextStep(): void {
    if (!this.isStepValid()) {
      this.toastService.showError('Please complete this step');
      return;
    }

    if (this.currentStep === 1 && !this.selectedAddress && this.addressForm.valid) {
      this.selectedAddress = this.addressForm.value;
    }

    if (this.currentStep === 3) {
      this.placeOrder();
    } else {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private placeOrder(): void {
    if (!this.cart || !this.selectedAddress) {
      this.toastService.showError('Missing order details');
      return;
    }

    this.isProcessing = true;

    const order: Order = {
      id: `ORDER-${Date.now()}`,
      userId: 'user1',
      items: this.cart.items,
      deliveryAddress: this.selectedAddress,
      paymentMethod: this.selectedPaymentMethod ? this.selectedPaymentMethod.type : this.selectedPaymentOption || 'cod',
      subtotal: this.cart.subtotal,
      tax: this.cart.tax,
      deliveryCharge: this.cart.deliveryCharge,
      total: this.cart.total,
      status: 'pending',
      specialInstructions: this.specialInstructions,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simulate API call
    setTimeout(() => {
      this.orderService.placeOrder(order).subscribe({
        next: (result) => {
          this.isProcessing = false;
          this.toastService.showSuccess('Order placed successfully! 🎉');
          this.cartService.clearCart();
          this.router.navigate(['/orders', result.id]);
        },
        error: (error) => {
          this.isProcessing = false;
          this.toastService.showError('Failed to place order. Please try again.');
        }
      });
    }, 1500);
  }

  applyPromoCode(): void {
    if (this.promoCode.trim()) {
      this.toastService.showInfo(`Promo code '${this.promoCode}' applied! (Mock)`);
      this.promoCode = '';
    }
  }

  getPaymentIcon(type: string): string {
    const icons: { [key: string]: string } = {
      credit: '💳',
      debit: '🏦',
      wallet: '💰'
    };
    return icons[type] || '💳';
  }

  getPaymentOptionLabel(option: string): string {
    const labels: { [key: string]: string } = {
      wallet: '💰 Digital Wallet',
      cod: '💵 Cash on Delivery'
    };
    return labels[option] || option;
  }
}
