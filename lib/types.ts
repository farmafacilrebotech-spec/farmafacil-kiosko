export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  preferredPharmacy: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  pharmacyId: string;
  pharmacyName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedTime?: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  image: string;
  validUntil: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  isActive: boolean;
  expiresAt: string;
  isNew?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  products?: Product[];
}

export interface AssistantRequest {
  mensaje: string;
  farmaciaId: string;
  clienteId: string;
}

export interface AssistantResponse {
  texto: string;
  productos?: Product[];
}
