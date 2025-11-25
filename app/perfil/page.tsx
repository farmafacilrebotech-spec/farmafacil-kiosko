'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { mockApi } from '@/lib/api';
import type { User as UserType } from '@/lib/types';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await mockApi.logout();
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-[#47c7c0] mx-auto mb-3 animate-pulse" />
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-[#47c7c0] to-[#3db5af] px-6 py-12 rounded-b-[2rem] shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-white/90 text-sm mt-1">{user.phone}</p>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Información personal</h2>
          <Card className="divide-y divide-gray-100">
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#47c7c0]/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#47c7c0]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Nombre completo</p>
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#47c7c0]/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#47c7c0]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Teléfono</p>
                <p className="text-sm font-semibold text-gray-900">{user.phone}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            {user.email && (
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#47c7c0]/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#47c7c0]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#47c7c0]/10 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#47c7c0]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Farmacia preferida</p>
                <p className="text-sm font-semibold text-gray-900">{user.preferredPharmacy}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Preferencias</h2>
          <Card className="divide-y divide-gray-100">
            <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-[#47c7c0]/10 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#47c7c0]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">Notificaciones</p>
                <p className="text-xs text-gray-500">Gestiona tus notificaciones</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-[#47c7c0]/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#47c7c0]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">Privacidad y seguridad</p>
                <p className="text-xs text-gray-500">Controla tus datos</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Ayuda y soporte</h2>
          <Card className="divide-y divide-gray-100">
            <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-[#47c7c0]/10 rounded-full flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#47c7c0]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">Centro de ayuda</p>
                <p className="text-xs text-gray-500">Preguntas frecuentes</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-[#47c7c0]/10 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#47c7c0]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">Términos y condiciones</p>
                <p className="text-xs text-gray-500">Lee nuestras políticas</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Card>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-semibold rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar sesión
        </Button>

        <p className="text-center text-xs text-gray-500 pt-4">
          FarmaFácil v1.0.0
        </p>
      </div>
    </div>
  );
}
