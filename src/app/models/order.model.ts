import { CartItem } from './cart.model';
import { Address } from './address.model';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  deliveryAddress: Address;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  estimatedDeliveryTime: number;
  paymentMethod: string;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

export interface OrderFilter {
  status?: OrderStatus;
  dateRange?: { start: Date; end: Date };
  sortBy?: 'recent' | 'oldest';
}
