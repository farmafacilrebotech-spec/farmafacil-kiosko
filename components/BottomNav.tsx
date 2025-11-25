'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Home, MessageCircle, Ticket, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ============================
  // 1) Ocultar barra en modo KIOSKO
  // ============================
  // Si la URL tiene ?kiosk=1 → oculta la barra completamente
  if (searchParams.get("kiosk") === "1") return null;

  // ============================
  // 2) Ocultar barra en pantallas restringidas
  // ============================
  const hideNavPaths = ['/login', '/codigo'];
  if (hideNavPaths.includes(pathname)) return null;

  // ============================
  // 3) Contenido normal de navegación
  // ============================
  const navItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard' },
    { icon: MessageCircle, label: 'Asistente', path: '/asistente' },
    { icon: Ticket, label: 'Cupones', path: '/cupones' },
    { icon: User, label: 'Perfil', path: '/perfil' }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? 'text-[#47c7c0]' : 'text-gray-500'
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-all ${
                  active ? 'scale-110' : 'scale-100'
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-xs font-medium ${
                  active ? 'font-semibold' : 'font-normal'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
