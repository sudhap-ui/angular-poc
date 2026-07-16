export type AddressType = 'home' | 'work' | 'other';

export interface Address {
  id: string;
  userId: string;
  label: string;
  type: AddressType;
  street: string;
  building: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
