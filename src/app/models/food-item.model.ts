export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  isVegetarian: boolean;
  rating: number;
  reviewCount: number;
  spicyLevel?: 1 | 2 | 3;
  preparationTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: FoodItem[];
}
