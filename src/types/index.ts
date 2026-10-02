export type UserRole = 'customer' | 'superadmin';

export interface SavedAddress {
  id: string;
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  mobile: string;
  role: UserRole;
  createdAt: string;
  savedAddresses?: SavedAddress[];
  status: 'active' | 'blocked';
}

export interface FragranceNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface ProductVolumeVariant {
  volume: string; // e.g., "12ml", "50ml", "100ml", "24ml", "6ml"
  price: number; // MRP for this volume
  salePrice?: number; // Discounted Offer Price for this volume
}

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  category: string; // e.g. "Men", "Women", "Unisex", "Attar", "Perfume", "Premium", "New Arrivals"
  description: string;
  notes: FragranceNotes;
  volume: string; // e.g., "100ml EDP", "50ml Extrait", "12ml Pure Attar"
  volumeVariants?: ProductVolumeVariant[]; // Custom volume/size variants with independent prices
  sku: string;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  status: 'available' | 'out_of_stock' | 'draft';
  images: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVolume?: string;
  selectedPrice?: number;
  selectedSalePrice?: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Awaiting Screenshot';

export interface OrderDeliveryAddress {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  volume: string;
  image: string;
}

export interface Order {
  id: string; // Document ID / Order ID (e.g. AAF-2026-0001)
  orderId: string;
  customerId: string; // user UID or "guest"
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  deliveryAddress: OrderDeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: 'Prepaid (Razorpay / UPI / Cards / NetBanking)' | 'Prepaid UPI + WhatsApp Screenshot' | string;
  paymentStatus: PaymentStatus;
  razorpayPaymentId?: string;
  status: OrderStatus;
  trackingNumber?: string;
  courierCompany?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountType?: 'percentage' | 'flat';
  discountValue?: number;
  minOrderAmount?: number;
  minOrder?: number;
  maxDiscount?: number;
  isActive?: boolean;
  active?: boolean;
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  date: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  isActive: boolean;
}

export interface StoreSettings {
  brandName: string;
  brandTagline: string;
  ownerName: string;
  contactPhone: string;
  whatsappNumber: string;
  contactAddress: string;
  aboutText: string;
  announcementBarText: string;
  isAnnouncementEnabled: boolean;
  heroVideoUrl?: string;
  heroVideoPoster?: string;
  instagramUrl?: string;
  instagramLink?: string;
  googleMapsUrl?: string;
  contactPhone2?: string;
  supportEmail?: string;
  deliveryDetails?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  showroomImageUrl?: string;
  // Dynamic Combo Offer Settings ("Buy Any 5 @ ₹1499")
  comboOfferTitle?: string;
  comboOfferPrice?: number;
  comboOfferOriginalPrice?: number;
  comboBottleCount?: number;
  comboOfferEnabled?: boolean;
  comboProductIds?: string[];
  comboOfferDescription?: string;
  // Admin Credentials & Access Control
  adminEmail?: string;
  adminPassword?: string;
  // Razorpay Payment Gateway Settings
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  razorpayUpiId?: string;
  razorpayPaymentLink?: string;
  razorpayQrImageUrl?: string;
  razorpayEnabled?: boolean;
}

export interface WholesaleEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  city: string;
  message: string;
  createdAt: string;
}
