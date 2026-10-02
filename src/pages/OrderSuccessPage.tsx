import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, ShoppingBag, MessageCircle } from 'lucide-react';
import { AmBrandEmblem } from '../components/brand/AmBrandEmblem';

export const OrderSuccessPage: React.FC = () => {
  const { pageParams, setCurrentPage, orders, settings } = useStore();

  const orderId = pageParams?.orderId;
  const order = orders.find((o) => o.id === orderId || o.orderId === orderId) || pageParams?.order;
  const whatsappUrl = pageParams?.whatsappUrl;

  // Auto-redirect effect (some browsers might block, so we also show a big button)
  React.useEffect(() => {
    if (whatsappUrl) {
      const timer = setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [whatsappUrl]);

  return (
    <div className="bg-[#faf9f6] text-neutral-900 min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Confirmation Card */}
      <div className="bg-white border border-neutral-200 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-md relative overflow-hidden">
        
        {whatsappUrl && (
          <div className="absolute top-0 left-0 w-full bg-emerald-600 text-white py-2 text-[10px] font-black tracking-[0.2em] uppercase animate-pulse">
            Waiting for WhatsApp Confirmation...
          </div>
        )}

        <div className="pt-2">
          <AmBrandEmblem size="sm" showSubtitle={false} interactive={false} />
        </div>

        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-amber-800 uppercase tracking-[0.25em] font-bold block">
            ORDER PLACED SUCCESSFULLY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-950 font-bold uppercase tracking-tight">
            Order Received!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 uppercase tracking-widest max-w-md mx-auto">
            Aapka order receive ho gaya hai. Ab ise WhatsApp par confirm karna baaki hai.
          </p>
        </div>

        {order && (
          <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-2xl max-w-lg mx-auto text-left space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Order ID:</span>
              <span className="font-mono font-bold text-neutral-950 text-sm">{order.orderId || order.id}</span>
            </div>

            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Total Amount:</span>
              <span className="font-serif font-bold text-neutral-950 text-base">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Payment Method:</span>
              <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full uppercase text-[10px]">
                WhatsApp Direct Order
              </span>
            </div>

            <div className="space-y-1 border-b border-neutral-200 pb-3">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] block font-semibold">Delivery To:</span>
              <p className="text-neutral-800 leading-relaxed">
                {order.deliveryAddress.name} ({order.deliveryAddress.mobile})<br />
                {order.deliveryAddress.address}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </p>
            </div>

            <div className="flex items-center gap-2 text-neutral-700 font-mono text-[11px]">
              <Truck className="w-4 h-4 text-amber-800" />
              <span>Showroom se dispatch updates WhatsApp par milenge.</span>
            </div>
          </div>
        )}

        {/* Action Button - WhatsApp Confirmation */}
        <div className="pt-4 flex flex-col items-center justify-center gap-4 max-w-lg mx-auto">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full px-8 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-widest uppercase rounded-2xl shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer animate-bounce mt-4"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 fill-current" />
                <span>CONFIRM ORDER ON WHATSAPP</span>
              </div>
              <span className="text-[10px] opacity-80 normal-case font-medium">Click here if WhatsApp doesn't open automatically</span>
            </a>
          ) : (
            <a
              href={`https://wa.me/${(settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978').length === 10 ? '91' + (settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978') : (settings.whatsappNumber?.replace(/[^0-9]/g, '') || '918140251978')}?text=${encodeURIComponent(
                `Hello ${settings.brandName || "NICE Perfumes"}, I placed Order #${order?.orderId || order?.id || ""}. Please share tracking update!`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>💬 CHAT ON WHATSAPP</span>
            </a>
          )}

          <button
            id="view-my-orders-btn"
            onClick={() => setCurrentPage('customer-dashboard', { tab: 'orders' })}
            className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            VIEW MY ORDERS
          </button>
          
          <button
            id="continue-shopping-btn"
            onClick={() => setCurrentPage('shop')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 text-xs tracking-wider uppercase rounded-xl font-semibold transition-all cursor-pointer shadow-xs"
          >
            CONTINUE SHOPPING
          </button>
        </div>

      </div>

    </div>
  );
};
