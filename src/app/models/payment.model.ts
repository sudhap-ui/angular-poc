export type PaymentMethod = 'credit_card' | 'debit_card' | 'upi' | 'wallet' | 'cash';

export interface PaymentCard {
  id: string;
  userId: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface PaymentInfo {
  method: PaymentMethod;
  cardId?: string;
  upiId?: string;
}
