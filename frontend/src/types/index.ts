export type UserRole = 'ADMIN' | 'PRODUCT_MANAGER' | 'CUSTOMER';

export type OrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  role_display: string;
  store: number | null;
  store_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
  products_count: number;
  created_at: string;
}

export interface Product {
  id: number;
  category: number;
  category_name: string;
  name: string;
  article: string;
  description: string;
  image: string | null;
  price: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_article: string;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  customer: number;
  customer_name: string;
  store: number;
  store_name: string;
  status: OrderStatus;
  status_display: string;
  total_amount: string;
  comment: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  owner: number | null;
  owner_username: string | null;
  customers_count: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AdminDashboard {
  cards: {
    orders_count: number;
    customers_count: number;
    products_count: number;
    total_revenue: number;
  };
  charts: {
    sales_by_day: { date: string; amount: number; count: number }[];
    orders_by_month: { month: string; count: number }[];
    popular_products: { product_id: number; name: string; quantity: number }[];
    new_customers: { date: string; count: number }[];
  };
  recent_orders: Order[];
}

export interface CustomerDashboard {
  cards: {
    orders_count: number;
    active_orders: number;
    total_spent: number;
  };
  recent_orders: {
    id: number;
    status: OrderStatus;
    total_amount: string;
    created_at: string;
    store__name: string;
  }[];
}
