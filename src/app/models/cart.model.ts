import { FoodItem } from './food-item.model';

export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  total: number;
}
