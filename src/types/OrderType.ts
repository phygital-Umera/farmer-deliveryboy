export enum unit {
  KG = 'KG',
  GRAM = 'GRAM',
  LTR = 'LTR',
  ML = 'ML',
  PCS = 'PCS',
  PACKET = 'PACKET',
}

export const Unit = unit;
export type Unit = unit | `${unit}`;

export interface WeightOption {
  weight: string; // e.g. "250 g", "500 g", "1 kg", "2 kg"
  price: number;
  mrp: number;
  cutPrice?: number;
  rawQty?: number; // Exact numerical quantity e.g. 100, 500.5, 1
  note?: string; // e.g. "Chhota Parivar (1 Din)", "Sabse Popular Choice"
  isPopular?: boolean;
}

export interface CartItemApiPayload {
  productId: string;
  price?: number;
  productQuantity: number;
  productCount: number;
}

export interface TadkaItem {
  id: string;
  name: string;
  hindiName?: string;
  weight: string;
  price: number;
  mrp: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  hindiName: string;
  englishSubtitle: string;
  category: 'all' | 'daily' | 'leafy' | 'roots' | 'exotic' | string;
  categoryLabel: string;
  unit?: unit | string;
  image: string;
  originBadge: string; // e.g. "Direct from Nashik Mandi"
  freshnessBadge: string; // e.g. "AAJ SUBAH 4 AM MANDI FRESH"
  certifiedBadge: string; // e.g. "100% Certified Wazan"
  discountPercent: number; // e.g. 22
  defaultWeight: string; // e.g. "1 kg"
  price: number;
  mrp: number;
  cutPrice?: number;
  weightOptions: WeightOption[];
  localMandiPrice: number; // e.g. 40 (for Mandi Bhav Muqabla)
  apnaMandiPrice: number; // e.g. 35
  guarantees: string[];
  rasoiTips: {
    description: string;
    tags: string[];
  };
  quickAddTadka: TadkaItem[];
}

export interface CartItem {
  product: Product;
  selectedWeight: string;
  unitPrice: number;
  unitMrp: number;
  quantity: number;
}

export type DeliveryInstruction = 'ring_bell' | 'leave_door' | 'do_not_ring';

export type PaymentMethod = 'cod' | 'upi' | 'card';

export type ActiveTab = 'home' | 'categories' | 'offers' | 'cart' | 'orders';

export type ViewState =
  | { type: 'home' }
  | { type: 'cart' }
  | { type: 'orders' }
  | { type: 'order_detail'; orderId: string }
  | { type: 'product_detail'; productId: string };

export interface OrderItem {
  name: string;
  image: string;
  weight: string;
  quantity: number;
  price: number;
  mrp: number;
}

export interface Order {
  id: string;
  status: 'live' | 'delivered';
  placedAt: string;
  items: OrderItem[];
  itemsTotal: number;
  discountTotal: number;
  deliveryCharge: number;
  totalPaid: number;
  savingsTotal: number;
  paymentMethod: PaymentMethod;
  deliveryInstruction?: string;
  riderName?: string;
  riderPhone?: string;
  deliveryAddress: {
    label: string;
    flat: string;
    landmark: string;
    pincode: string;
    city: string;
  };
}

export interface ApiOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  productQuantity: number;
  productCount: number;
  totalQuantity: number;
  subtotal: number;
  cgst?: number;
  sgst?: number;
  taxAmount: number;
  totalPrice: number;
  createdAt: string;
  updatedAt?: string;
  image?: string;
}

export interface ApiAdminUser {
  fullname: string;
  phoneNumber: string;
}

export interface ApiAdmin {
  id: string;
  userId?: string;
  user?: ApiAdminUser;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  [key: string]: any;
}

export interface ApiDeliveryBoy {
  id: string;
  name?: string;
  phone?: string;
  [key: string]: any;
}

export interface ApiOrder {
  id: string;
  orderNo: string;
  customerId: string;
  adminId: string;
  deliveryBoyId: string | null;
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  status: 'PENDING' | 'PACKED' | 'ASSIGNED' | 'DISPATCHED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | string;
  packedAt: string | null;
  assignedAt: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
  admin?: ApiAdmin;
  deliveryBoy?: ApiDeliveryBoy | null;
}

export interface ApiOrdersResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    orders: ApiOrder[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  errors?: any;
}