'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Clock,
  Package,
  Ticket,
  MessageCircle,
  Pill,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { mockApi } from '@/lib/api';
import type { User as UserType, Promotion, Product, Order } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const [promos, prods, orders] = await Promise.all([
          mockApi.getPromotions(),
          mockApi.getRecommendedProducts(),
          mockApi.getOrders()
        ]);

        setPromotions(promos);
        setProducts(prods);
        setActiveOrders(orders.filter(o => o.status === 'preparing' || o.status === 'pending'));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendiente',
      preparing: 'Preparando',
      ready: 'Listo',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#47c7c0] to-[#3db5af] rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 animate-pulse">
            <Package className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-[#47c7c0] to-[#3db5af] px-6 py-8 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">¡Hola, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-white/90 text-sm mt-1">{user?.preferredPharmacy}</p>
          </div>
          <button
            onClick={() => router.push('/perfil')}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <User className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Promociones activas</h2>
            <Sparkles className="w-5 h-5 text-[#47c7c0]" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {promotions.map((promo) => (
              <Card key={promo.id} className="flex-shrink-0 w-72 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-[#47c7c0] hover:bg-[#3db5af] text-white border-0">
                    -{promo.discount}%
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{promo.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {activeOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pedidos en curso</h2>
            {activeOrders.map((order) => (
              <Card
                key={order.id}
                onClick={() => router.push(`/pedidos/${order.id}`)}
                className="p-4 mb-3 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-[#47c7c0]" />
                      <span className="font-semibold text-gray-900">Pedido #{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.items.length} producto{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                {order.estimatedTime && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Listo en {order.estimatedTime} minutos</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Productos recomendados</h2>
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                  <p className="text-lg font-bold text-[#47c7c0] mt-2">€{product.price.toFixed(2)}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/historial')}
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-[#47c7c0] hover:bg-[#47c7c0]/5 transition-colors"
            >
              <Clock className="w-6 h-6 text-[#47c7c0]" />
              <span className="text-sm font-semibold text-gray-700">Historial</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/cupones')}
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-[#47c7c0] hover:bg-[#47c7c0]/5 transition-colors"
            >
              <Ticket className="w-6 h-6 text-[#47c7c0]" />
              <span className="text-sm font-semibold text-gray-700">Cupones</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-[#47c7c0] hover:bg-[#47c7c0]/5 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-[#47c7c0]" />
              <span className="text-sm font-semibold text-gray-700">Chat</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-[#47c7c0] hover:bg-[#47c7c0]/5 transition-colors"
            >
              <Pill className="w-6 h-6 text-[#47c7c0]" />
              <span className="text-sm font-semibold text-gray-700">Tratamientos</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
