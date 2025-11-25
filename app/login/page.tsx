'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stethoscope, Loader2 } from 'lucide-react';
import { mockApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) return;

    setLoading(true);
    try {
      await mockApi.sendOTP(phone);
      localStorage.setItem('temp_phone', phone);
      router.push('/codigo');
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#47c7c0]/10 via-white to-[#47c7c0]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#47c7c0] to-[#3db5af] rounded-2xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">FarmaFácil</h1>
              <p className="text-sm text-gray-500 mt-2">Ingresa tu número de teléfono</p>
            </div>
          </div>

          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Número de teléfono
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+34 612 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 text-lg border-2 border-gray-200 focus:border-[#47c7c0] transition-colors"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || phone.length < 9}
              className="w-full h-12 bg-gradient-to-r from-[#47c7c0] to-[#3db5af] hover:from-[#3db5af] hover:to-[#2fa39d] text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enviando código...
                </>
              ) : (
                'Enviar código'
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-gray-500">
            Al continuar, aceptas recibir un código de verificación por SMS
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Primera vez? El código de prueba es <span className="font-mono font-semibold text-[#47c7c0]">123456</span>
        </p>
      </div>
    </div>
  );
}
