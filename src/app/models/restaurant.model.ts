export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisineTypes: string[];
  rating: number;
  reviewCount: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  deliveryCharge: number;
  isOpen: boolean;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantFilters {
  cuisine?: string;
  minRating?: number;
  maxDeliveryTime?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface RestaurantSort {
  sortBy: 'rating' | 'deliveryTime' | 'name';
  order: 'asc' | 'desc';
}
