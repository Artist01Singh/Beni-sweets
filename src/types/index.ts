export type ProductCategory = 
  | 'sweets' 
  | 'namkeen' 
  | 'breakfast' 
  | 'chinese' 
  | 'beverages' 
  | 'gifting';

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: ProductCategory;
  description: string;
  price: number;
  weightOrServing: string;
  isVeg: boolean;
  inStock: boolean;
  isBestseller?: boolean;
  isSeasonal?: boolean;
  isGifting?: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  ingredients?: string[];
  shelfLife?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
  customNote?: string;
  itemTotal: number;
}

export type OrderStatus = 
  | 'Order Received'
  | 'Order Confirmed'
  | 'Preparing Your Order'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'upi' | 'razorpay' | 'cod' | 'pay_at_store';

export type PaymentStatus = 'pending' | 'verified' | 'paid' | 'failed';

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  pincode?: string;
  landmark?: string;
  city?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customer: CustomerDetails;
  orderType: 'delivery' | 'takeaway';
  preferredTime: string;
  specialInstructions?: string;
  giftMessage?: {
    to: string;
    from: string;
    message: string;
  };
  couponCode?: string;
  discountAmount: number;
  subtotal: number;
  taxes: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive: boolean;
}

export interface BusinessSettings {
  brandName: string;
  tagline: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  openingHours: string;
  isStoreOpen: boolean;
  minOrderValue: number;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  gstPercent: number;
  servicePincodes: string[];
  razorpayKeyId?: string;
  upiVpa: string;
}

export type AdminRole = 'owner' | 'manager' | 'staff';

export interface AdminUser {
  id: string;
  name: string;
  role: AdminRole;
  pin: string;
  permissions: {
    canEditProducts: boolean;
    canUpdateOrderStatus: boolean;
    canEditSettings: boolean;
    canViewFinancials: boolean;
    canCancelOrders: boolean;
  };
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  landmark: string;
  pincode: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: SavedAddress[];
  savedOrderIds: string[];
  wishlistProductIds: string[];
}

export interface BulkCateringInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: 'Wedding' | 'Corporate' | 'Diwali/Festive' | 'Birthday' | 'Other';
  eventDate: string;
  guestCount: number;
  budgetRange?: string;
  requirements: string;
  createdAt: string;
}

export interface TableReservation {
  id: string;
  name: string;
  phone: string;
  guestCount: number;
  date: string;
  time: string;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}
