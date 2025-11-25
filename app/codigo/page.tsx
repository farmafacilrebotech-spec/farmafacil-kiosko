'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stethoscope, Loader2, ArrowLeft } from 'lucide-react';
import { mockApi } from '@/lib/api';

export default function CodigoPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const savedPhone = localStorage.getItem('temp_phone');
    if (!savedPhone) {
      router.push('/login');
    } else {
      setPhone(savedPhone);
    }
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      const result = await mockApi.verifyOTP(phone, code);
      if (result.success && result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.removeItem('temp_phone');
        router.push('/dashboard');
      } else {
        setError('Código incorrecto. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await mockApi.sendOTP(phone);
      alert('Código reenviado');
    } catch (err) {
      setError('Error al reenviar el código');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#47c7c0]/10 via-white to-[#47c7c0]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => router.push('/login')}
          className="mb-4 text-gray-600 hover:text-[#47c7c0]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#47c7c0] to-[#3db5af] rounded-2xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Verificación</h1>
              <p className="text-sm text-gray-500 mt-2">
                Ingresa el código enviado a<br />
                <span className="font-semibold text-gray-700">{phone}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-gray-700">
                Código de verificación
              </label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="h-14 text-center text-2xl tracking-widest font-semibold border-2 border-gray-200 focus:border-[#47c7c0] transition-colors"
                disabled={loading}
              />
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full h-12 bg-gradient-to-r from-[#47c7c0] to-[#3db5af] hover:from-[#3db5af] hover:to-[#2fa39d] text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Acceder'
              )}
            </Button>

            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="w-full text-sm text-[#47c7c0] hover:text-[#3db5af] font-medium transition-colors disabled:opacity-50"
            >
              Reenviar código
            </button>
          </form>

          <p className="text-xs text-center text-gray-500">
            El código expira en 5 minutos
          </p>
        </div>
      </div>
    </div>
  );
}
