import { User, Order, Product, Promotion, Coupon } from './types';

const MOCK_USER: User = {
  id: '1',
  phone: '+34612345678',
  name: 'María García',
  email: 'maria@example.com',
  preferredPharmacy: 'Farmacia Central'
};

const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    title: '20% en Vitaminas',
    description: 'Descuento en toda la línea de vitaminas y suplementos',
    discount: 20,
    image: 'https://images.pexels.com/photos/3737582/pexels-photo-3737582.jpeg?auto=compress&cs=tinysrgb&w=800',
    validUntil: '2025-12-31'
  },
  {
    id: '2',
    title: '2x1 en Protectores Solares',
    description: 'Lleva dos protectores solares al precio de uno',
    discount: 50,
    image: 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=800',
    validUntil: '2025-11-30'
  },
  {
    id: '3',
    title: '15% en Dermocosmética',
    description: 'Descuento especial en productos de cuidado facial',
    discount: 15,
    image: 'https://images.pexels.com/photos/3762877/pexels-photo-3762877.jpeg?auto=compress&cs=tinysrgb&w=800',
    validUntil: '2025-12-15'
  }
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Analgésico y antipirético',
    price: 4.50,
    image: 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Medicamentos'
  },
  {
    id: '2',
    name: 'Vitamina C 1000mg',
    description: 'Suplemento vitamínico',
    price: 12.90,
    image: 'https://images.pexels.com/photos/3683095/pexels-photo-3683095.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Vitaminas'
  },
  {
    id: '3',
    name: 'Crema Hidratante Facial',
    description: 'Hidratación profunda 24h',
    price: 18.50,
    image: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Cosmética'
  },
  {
    id: '4',
    name: 'Termómetro Digital',
    description: 'Lectura rápida y precisa',
    price: 8.90,
    image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Dispositivos'
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: '001',
    userId: '1',
    pharmacyId: '1',
    pharmacyName: 'Farmacia Central',
    items: [
      { productId: '1', productName: 'Paracetamol 500mg', quantity: 2, price: 4.50 },
      { productId: '2', productName: 'Vitamina C 1000mg', quantity: 1, price: 12.90 }
    ],
    total: 21.90,
    status: 'preparing',
    createdAt: '2025-11-16T10:30:00',
    estimatedTime: 15
  },
  {
    id: '002',
    userId: '1',
    pharmacyId: '1',
    pharmacyName: 'Farmacia Central',
    items: [
      { productId: '3', productName: 'Crema Hidratante Facial', quantity: 1, price: 18.50 }
    ],
    total: 18.50,
    status: 'completed',
    createdAt: '2025-11-10T15:20:00'
  },
  {
    id: '003',
    userId: '1',
    pharmacyId: '1',
    pharmacyName: 'Farmacia Central',
    items: [
      { productId: '1', productName: 'Paracetamol 500mg', quantity: 1, price: 4.50 },
      { productId: '4', productName: 'Termómetro Digital', quantity: 1, price: 8.90 }
    ],
    total: 13.40,
    status: 'completed',
    createdAt: '2025-11-05T09:15:00'
  }
];

const MOCK_COUPONS: Coupon[] = [
  {
    id: '1',
    code: 'BIENVENIDA10',
    title: '10% de descuento',
    description: 'Para tu próxima compra',
    discount: 10,
    isActive: true,
    expiresAt: '2025-12-31',
    isNew: true
  },
  {
    id: '2',
    code: 'VERANO2025',
    title: '15% en protectores solares',
    description: 'Válido hasta fin de verano',
    discount: 15,
    isActive: true,
    expiresAt: '2025-09-30'
  },
  {
    id: '3',
    code: 'VITAPLUS',
    title: '20% en vitaminas',
    description: 'Cuida tu salud',
    discount: 20,
    isActive: true,
    expiresAt: '2025-12-15'
  },
  {
    id: '4',
    code: 'MARZO2025',
    title: '5% de descuento',
    description: 'Cupón usado',
    discount: 5,
    isActive: false,
    expiresAt: '2025-03-31'
  }
];

export const mockApi = {
  async sendOTP(phone: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  async verifyOTP(phone: string, code: string): Promise<{ success: boolean; user?: User }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (code === '123456') {
      return { success: true, user: MOCK_USER };
    }
    return { success: false };
  },

  async getUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_USER;
  },

  async getPromotions(): Promise<Promotion[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROMOTIONS;
  },

  async getRecommendedProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PRODUCTS;
  },

  async getOrders(): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_ORDERS;
  },

  async getOrderById(id: string): Promise<Order | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_ORDERS.find(order => order.id === id);
  },

  async getCoupons(): Promise<Coupon[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_COUPONS;
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};
