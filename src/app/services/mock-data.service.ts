import { Restaurant, FoodItem } from '@app/models';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    description: 'Authentic Italian pizzas and pasta',
    image: 'https://via.placeholder.com/300x200?text=Pizza+Palace',
    cuisineTypes: ['Italian', 'Pizza'],
    rating: 4.5,
    reviewCount: 250,
    minDeliveryTime: 30,
    maxDeliveryTime: 45,
    deliveryCharge: 50,
    isOpen: true,
    address: '123 Main Street',
    phone: '+1234567890',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Burger Barn',
    description: 'Juicy burgers and crispy fries',
    image: 'https://via.placeholder.com/300x200?text=Burger+Barn',
    cuisineTypes: ['American', 'Fast Food'],
    rating: 4.2,
    reviewCount: 180,
    minDeliveryTime: 20,
    maxDeliveryTime: 30,
    deliveryCharge: 40,
    isOpen: true,
    address: '456 Oak Avenue',
    phone: '+1234567891',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Curry House',
    description: 'Authentic Indian cuisine',
    image: 'https://via.placeholder.com/300x200?text=Curry+House',
    cuisineTypes: ['Indian', 'Asian'],
    rating: 4.7,
    reviewCount: 320,
    minDeliveryTime: 35,
    maxDeliveryTime: 50,
    deliveryCharge: 60,
    isOpen: true,
    address: '789 Pine Road',
    phone: '+1234567892',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const MOCK_FOOD_ITEMS: FoodItem[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, basil',
    image: 'https://via.placeholder.com/200x150?text=Margherita',
    price: 350,
    category: 'Pizza',
    isVegetarian: true,
    rating: 4.6,
    reviewCount: 125,
    preparationTime: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Pepperoni Pizza',
    description: 'Pepperoni, cheese, tomato sauce',
    image: 'https://via.placeholder.com/200x150?text=Pepperoni',
    price: 450,
    category: 'Pizza',
    isVegetarian: false,
    rating: 4.7,
    reviewCount: 180,
    preparationTime: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
