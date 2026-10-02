import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Compass, ShoppingBag, User, MessageCircle, ShieldCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, cart, settings, isAdminLoggedIn } = useStore();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const rawNum = settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978';
  const whatsappNum = rawNum.length === 10 ? `91${rawNum}` : rawNum;

  const navButtons = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: Compass },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'dashboard', label: 'Account', icon: User },
    ...(isAdminLoggedIn ? [{ id: 'admin-dashboard', label: 'Admin', icon: ShieldCheck }] : []),
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-40 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = currentPage === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setCurrentPage(btn.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-neutral-950 font-bold scale-105' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {btn.badge !== undefined && btn.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-neutral-950 font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {btn.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-wider uppercase mt-1">
                {btn.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-amber-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}

        {/* WhatsApp Quick Direct Link */}
        <a
          href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hello ${settings.brandName || "NICE Perfumes"}, I want to place an order.`)}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center py-1 px-3 text-emerald-600 hover:text-emerald-700 transition-all"
        >
          <MessageCircle className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-wider uppercase mt-1 font-semibold">
            Chat
          </span>
        </a>
      </div>
    </div>
  );
};
