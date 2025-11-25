'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { mockApi } from '@/lib/api';
import type { Order } from '@/lib/types';

export default function OrderDetailClient() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderId = params.id as string;
        const data = await mockApi.getOrderById(orderId);
        setOrder(data || null);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendiente',
      preparing: 'Preparando tu pedido',
      ready: 'Listo para recoger',
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

  const handleWhatsApp = () => {
    const phone = '34612345678';
    const message = `Hola, tengo una consulta sobre mi pedido #${order?.id}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#47c7c0] mx-auto mb-3 animate-spin" />
          <p className="text-gray-600">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pedido no encontrado</h2>
          <Button onClick={() => router.push('/historial')} className="mt-4">
            Volver al historial
          </Button>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: 'pending', label: 'Recibido', icon: CheckCircle2 },
    { key: 'preparing', label: 'Preparando', icon: Package },
    { key: 'ready', label: 'Listo', icon: CheckCircle2 },
    { key: 'completed', label: 'Entregado', icon: CheckCircle2 }
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-[#47c7c0] to-[#3db5af] px-6 py-8 rounded-b-[2rem] shadow-lg">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold text-white">Pedido #{order.id}</h1>
        <p className="text-white/90 text-sm mt-1">{formatDate(order.createdAt)}</p>
      </div>

      <div className="px-6 mt-6 space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Estado del pedido</h2>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gray-200" />
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="relative flex items-center gap-4 mb-6 last:mb-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                      isCompleted
                        ? 'bg-[#47c7c0] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${
                        isCurrent ? 'text-[#47c7c0]' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {order.estimatedTime && order.status === 'preparing' && (
            <div className="mt-6 p-4 bg-[#47c7c0]/10 rounded-xl flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#47c7c0]" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Tiempo estimado</p>
                <p className="text-sm text-gray-600">{order.estimatedTime} minutos</p>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Productos</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-gray-200 flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">Total</p>
            <p className="text-2xl font-bold text-[#47c7c0]">€{order.total.toFixed(2)}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Farmacia</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#47c7c0] mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{order.pharmacyName}</p>
                <p className="text-sm text-gray-600">Calle Mayor 123, Madrid</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#47c7c0] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">+34 912 345 678</p>
              </div>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleWhatsApp}
          className="w-full h-12 bg-gradient-to-r from-[#47c7c0] to-[#3db5af] hover:from-[#3db5af] hover:to-[#2fa39d] text-white font-semibold rounded-xl shadow-lg"
        >
          <Phone className="w-5 h-5 mr-2" />
          Contactar por WhatsApp
        </Button>
      </div>
    </div>
  );
}
