'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { mockApi } from '@/lib/api';
import type { Coupon } from '@/lib/types';

export default function CuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const data = await mockApi.getCoupons();
        setCoupons(data);
      } catch (error) {
        console.error('Error loading coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const activeCoupons = coupons.filter(c => c.isActive);
  const expiredCoupons = coupons.filter(c => !c.isActive);
  const newCoupons = activeCoupons.filter(c => c.isNew);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Ticket className="w-12 h-12 text-[#47c7c0] mx-auto mb-3 animate-pulse" />
          <p className="text-gray-600">Cargando cupones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-[#47c7c0] to-[#3db5af] px-6 py-8 rounded-b-[2rem] shadow-lg">
        <h1 className="text-2xl font-bold text-white">Mis cupones</h1>
        <p className="text-white/90 text-sm mt-1">{activeCoupons.length} cupón{activeCoupons.length !== 1 ? 'es' : ''} activo{activeCoupons.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {newCoupons.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#47c7c0]" />
              <h2 className="text-lg font-bold text-gray-900">Nuevos cupones</h2>
            </div>
            <div className="space-y-3">
              {newCoupons.map((coupon) => (
                <Card key={coupon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-br from-[#47c7c0] to-[#3db5af] p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Badge className="bg-white/20 text-white border-0 mb-2">Nuevo</Badge>
                        <h3 className="text-xl font-bold text-white">{coupon.title}</h3>
                        <p className="text-white/90 text-sm mt-1">{coupon.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">-{coupon.discount}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Código del cupón</p>
                        <p className="text-lg font-mono font-bold text-gray-900">{coupon.code}</p>
                        <p className="text-xs text-gray-500 mt-2">Válido hasta {formatDate(coupon.expiresAt)}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCopy(coupon.code)}
                        className="bg-[#47c7c0] hover:bg-[#3db5af]"
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copiar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeCoupons.filter(c => !c.isNew).length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cupones activos</h2>
            <div className="space-y-3">
              {activeCoupons.filter(c => !c.isNew).map((coupon) => (
                <Card key={coupon.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Ticket className="w-5 h-5 text-[#47c7c0]" />
                        <h3 className="text-lg font-bold text-gray-900">{coupon.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{coupon.description}</p>
                    </div>
                    <Badge className="bg-[#47c7c0]/10 text-[#47c7c0] border-0 text-lg font-bold px-3">
                      -{coupon.discount}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Código</p>
                      <p className="text-base font-mono font-bold text-gray-900">{coupon.code}</p>
                      <p className="text-xs text-gray-500 mt-1">Válido hasta {formatDate(coupon.expiresAt)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(coupon.code)}
                      className="border-[#47c7c0] text-[#47c7c0] hover:bg-[#47c7c0] hover:text-white"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {expiredCoupons.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-400 mb-4">Cupones expirados</h2>
            <div className="space-y-3">
              {expiredCoupons.map((coupon) => (
                <Card key={coupon.id} className="p-4 opacity-60">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Ticket className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-bold text-gray-600">{coupon.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{coupon.description}</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-600 border-0">
                      Expirado
                    </Badge>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Código: <span className="font-mono font-semibold">{coupon.code}</span></p>
                    <p className="text-xs text-gray-500 mt-1">Expiró el {formatDate(coupon.expiresAt)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {coupons.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes cupones disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}
