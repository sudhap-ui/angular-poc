export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  foodItemId?: string;
  restaurantId?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}
