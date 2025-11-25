'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ChevronRight, Calendar } from 'lucide-react';
import { mockApi } from '@/lib/api';
import type { Order } from '@/lib/types';

export default function HistorialPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await mockApi.getOrders();
        setOrders(data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

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
          <Package className="w-12 h-12 text-[#47c7c0] mx-auto mb-3 animate-pulse" />
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-[#47c7c0] to-[#3db5af] px-6 py-8 rounded-b-[2rem] shadow-lg">
        <h1 className="text-2xl font-bold text-white">Historial de pedidos</h1>
        <p className="text-white/90 text-sm mt-1">{orders.length} pedido{orders.length !== 1 ? 's' : ''} en total</p>
      </div>

      <div className="px-6 mt-6 space-y-3">
        {orders.map((order) => (
          <Card
            key={order.id}
            onClick={() => router.push(`/pedidos/${order.id}`)}
            className="p-4 hover:shadow-lg transition-all cursor-pointer"
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
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {order.items.length} producto{order.items.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">€{order.total.toFixed(2)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-700 font-medium">{order.pharmacyName}</p>
            </div>
          </Card>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes pedidos aún</p>
          </div>
        )}
      </div>
    </div>
  );
}
