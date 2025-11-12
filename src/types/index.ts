export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  userType: 'customer' | 'merchant' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  merchantId: number;
  merchant?: User;
  createdAt: string;
  updatedAt: string;
  productsCount?: number;
  rating?: number;
  reviewsCount?: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  barcode?: string;
  stockQuantity: number;
  minStockLevel?: number;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  images?: string[];
  categoryId?: number;
  category?: Category;
  storeId: number;
  store?: Store;
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviewsCount?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  parent?: Category;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customer?: User;
  storeId: number;
  store?: Store;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
  trackingNumber?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  id?: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
}

export interface Review {
  id: number;
  productId: number;
  product?: Product;
  customerId: number;
  customer?: User;
  rating: number;
  title?: string;
  comment?: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  storeId: number;
  storeName: string;
}

export interface Wishlist {
  id: number;
  customerId: number;
  productId: number;
  product?: Product;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface SearchFilters {
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  storeId?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalUsers?: number;
  totalStores?: number;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  pendingOrders?: number;
  recentOrders?: Order[];
  topProducts?: Product[];
  salesData?: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}