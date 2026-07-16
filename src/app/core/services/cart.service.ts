import { Injectable, signal } from '@angular/core';
import { Cart, CartItem } from '@app/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();
  
  cartItemCount = signal(0);

  constructor() {
    this.loadCart();
  }

  addItem(item: CartItem): void {
    const currentCart = this.cartSubject.value || this.createNewCart();
    const existingItem = currentCart.items.find(ci => ci.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentCart.items.push(item);
    }
    
    this.updateCart(currentCart);
  }

  removeItem(itemId: string): void {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;
    
    currentCart.items = currentCart.items.filter(item => item.id !== itemId);
    this.updateCart(currentCart);
  }

  updateQuantity(itemId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;
    
    const item = currentCart.items.find(ci => ci.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        this.updateCart(currentCart);
      }
    }
  }

  clearCart(): void {
    this.cartSubject.next(null);
    localStorage.removeItem('cart');
  }

  getCart(): Cart | null {
    return this.cartSubject.value;
  }

  private updateCart(cart: Cart): void {
    this.calculateTotals(cart);
    this.cartSubject.next(cart);
    this.cartItemCount.set(cart.items.length);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private calculateTotals(cart: Cart): void {
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.tax = cart.subtotal * 0.1; // 10% tax
    cart.deliveryCharge = 50; // Fixed delivery charge
    cart.total = cart.subtotal + cart.tax + cart.deliveryCharge;
  }

  private createNewCart(): Cart {
    return {
      id: 'cart-' + Date.now(),
      userId: 'current-user',
      items: [],
      subtotal: 0,
      tax: 0,
      deliveryCharge: 0,
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      this.cartSubject.next(cart);
      this.cartItemCount.set(cart.items.length);
    }
  }
}
