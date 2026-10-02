import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, MessageCircle, ArrowLeft, Loader2, Sparkles, CheckCircle2, Truck } from 'lucide-react';
import { AmBrandEmblem } from '../components/brand/AmBrandEmblem';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    currentUser,
    settings,
    setCurrentPage,
    createOrder,
    clearCart,
    showToast,
    isAdminLoggedIn,
  } = useStore();

  const isAdminOrOwner = isAdminLoggedIn || currentUser?.email?.toLowerCase() === (settings.adminEmail || 'niceperfumes@gmail.com').toLowerCase();

  // Form State - Address fields are ALWAYS blank/empty so customers enter fresh addresses
  const [formData, setFormData] = useState({
    name: isAdminOrOwner ? '' : (currentUser?.fullName || ''),
    mobile: isAdminOrOwner ? '' : (currentUser?.mobile || ''),
    email: isAdminOrOwner ? '' : (currentUser?.email || ''),
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

  if (cart.length === 0) {
    return (
      <div className="bg-[#faf9f6] text-neutral-900 min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-700">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold">Your cart is empty</h2>
        <p className="text-xs text-neutral-500 max-w-sm text-center">
          Add your favourite pure attars or luxury perfumes to place a direct WhatsApp order.
        </p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-3 bg-neutral-950 text-white font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all cursor-pointer shadow-md"
        >
          Browse Fragrances
        </button>
      </div>
    );
  }

  const handleWhatsAppOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.mobile.trim() || !formData.address.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      showToast('Please fill out all required shipping fields (*)');
      return;
    }

    setIsPlacingOrder(true);
    showToast('Opening WhatsApp with your order details...');

    const orderId = 'KG-' + Math.floor(10000 + Math.random() * 90000);

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.salePrice || item.product.price,
      quantity: item.quantity,
      volume: item.selectedVolume || item.product.volume,
      image: item.product.images[0] || '',
    }));

    // 1. Prepare WhatsApp message immediately
    const brand = settings.brandName || "NICE Perfumes";
    const itemsList = orderItems
      .map((it, idx) => `${idx + 1}. *${it.name}* (${it.volume}) x ${it.quantity} = ₹${(it.price * it.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const waMessage = `🛍️ *${brand.toUpperCase()} — NEW ORDER* ✨
━━━━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* #${orderId}
👤 *Name:* ${formData.name.trim()}
📞 *Phone:* ${formData.mobile.trim()}
${formData.email.trim() ? `📧 *Email:* ${formData.email.trim()}\n` : ''}📍 *Delivery Address:*
${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}
${formData.notes.trim() ? `📝 *Note:* ${formData.notes.trim()}\n` : ''}
📦 *ITEMS ORDERED:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* ₹${cartSubtotal.toLocaleString('en-IN')}
${cartDiscount > 0 ? `🏷️ *Discount:* -₹${cartDiscount.toLocaleString('en-IN')}\n` : ''}🚚 *Shipping:* FREE Express Delivery 🇮🇳
💵 *TOTAL AMOUNT:* ₹${cartTotal.toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━━
💬 *Message:* Hello ${brand}, I have placed an order on your website. Please confirm my order and share dispatch details!`;

    const rawNum = settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978';
    const whatsappTarget = rawNum.length === 10 ? `91${rawNum}` : rawNum;
    const waUrl = `https://wa.me/${whatsappTarget}?text=${encodeURIComponent(waMessage)}`;

    // 2. Save to Firestore in background (non-blocking)
    createOrder({
      customerId: currentUser?.uid || 'guest_' + Date.now(),
      customerName: formData.name.trim(),
      customerEmail: formData.email.trim() || `${formData.mobile.trim()}@customer.niceperfumes.com`,
      customerMobile: formData.mobile.trim(),
      deliveryAddress: {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      },
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      discountAmount: cartDiscount,
      totalAmount: cartTotal,
      paymentMethod: 'WhatsApp Direct Order',
      paymentStatus: 'Pending',
      razorpayPaymentId: 'wa_order_' + orderId,
      status: 'Confirmed',
    }).catch((err) => {
      console.warn("Background order sync warning:", err);
    });

    // 3. Clear cart & redirect to WhatsApp INSTANTLY
    clearCart();
    setIsPlacingOrder(false);

    // Open WhatsApp directly
    window.open(waUrl, '_blank');

    // 4. Navigate to success page
    setCurrentPage('order-success', { 
      orderId: orderId, 
      whatsappUrl: waUrl 
    });
  };

  return (
    <div className="bg-[#faf9f6] text-neutral-900 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      
      {/* Back button */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <button
          onClick={() => setCurrentPage('cart')}
          className="hover:text-neutral-900 transition-colors flex items-center gap-1 uppercase tracking-wider font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </button>
      </div>

      <div className="border-b border-neutral-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-xs text-amber-800 uppercase tracking-[0.25em] font-semibold block mb-1">
            {settings.brandName || "NICE Perfumes"} • PALANPUR
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-neutral-950 font-bold tracking-tight uppercase">
            WhatsApp Quick Checkout
          </h1>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-full">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Direct 1-Click WhatsApp Order</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Delivery Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <form id="checkout-shipping-form" onSubmit={handleWhatsAppOrderSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl text-neutral-950 uppercase tracking-tight font-bold">
                1. Customer &amp; Delivery Details
              </h2>
              <span className="text-[11px] text-emerald-700 font-sans tracking-wider uppercase font-semibold">
                Express Delivery 🇮🇳
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-neutral-700 uppercase tracking-wider font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Apna Naam (Full Name)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-amber-600 text-neutral-900 rounded-xl p-3 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 uppercase tracking-wider font-semibold">WhatsApp / Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 7669131234"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-amber-600 text-neutral-900 rounded-xl p-3 focus:outline-none focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-700 uppercase tracking-wider font-semibold">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="name@example.com (optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 focus:border-amber-600 text-neutral-900 rounded-xl p-3 focus:outline-none focus:bg-white"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-700 uppercase tracking-wider font-semibold">Full Flat / House / Street Address *</label>
              <textarea
                rows={3}
                required
                placeholder="Makaan no., building, rasta, landmark"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 focus:border-amber-600 text-neutral-900 rounded-xl p-3 focus:outline-none focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-neutral-700 uppercase tracking-wider font-semibold">City / Town *</label>
                <input
                  type="text"
                  required
                  placeholder="Sambhal"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-amber-600 text-neutral-900 rounded-xl p-3 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 uppercase tracking-wider font-semibold">State *</label>
                <input
                  type="text"
                  required
                  placeholder="Madhya Pradesh"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-amber-600 text-neutral-900 rounded-xl p-3 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 uppercase tracking-wider font-semibold">PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="457226"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-amber-600 text-neutral-900 font-mono rounded-xl p-3 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-700 uppercase tracking-wider font-semibold">Order Note / Special Instructions (Optional)</label>
              <input
                type="text"
                placeholder="Koi specific delivery instructions ya custom request"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 focus:border-amber-600 text-neutral-900 rounded-xl p-3 focus:outline-none focus:bg-white"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wider uppercase rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-75"
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>GENERATING WHATSAPP ORDER...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>PLACE ORDER ON WHATSAPP • ₹{cartTotal.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-neutral-500">
                ⚡ Button click karte hi aapki sari details WhatsApp par auto-send ho jayengi aur showroom se confirm ho jayega.
              </p>
            </div>

          </form>

        </div>

        {/* Order Review Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-6 sticky top-28">
            <h2 className="font-serif text-xl text-neutral-950 uppercase tracking-tight font-bold border-b border-neutral-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-mono font-normal text-neutral-500">
                {cart.reduce((t, i) => t + i.quantity, 0)} Items
              </span>
            </h2>

            {/* Items Summary */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-neutral-100">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center text-xs pt-3 first:pt-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-14 object-cover rounded-lg bg-neutral-100 border border-neutral-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-semibold text-neutral-900 truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-neutral-500 font-mono">{item.selectedVolume || item.product.volume} x {item.quantity}</span>
                  </div>
                  <span className="font-serif font-bold text-neutral-950">
                    ₹{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2 text-xs border-t border-neutral-100 pt-4 text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-neutral-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-₹{cartDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span>{cartDeliveryFee === 0 ? <strong className="text-emerald-700 font-semibold uppercase">FREE</strong> : `₹${cartDeliveryFee}`}</span>
              </div>
              <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline text-sm">
                <span className="font-serif text-neutral-950 font-bold">Total Amount</span>
                <span className="font-serif text-2xl text-neutral-950 font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Store contact highlight */}
            <div className="p-4 bg-[#faf9f6] rounded-2xl border border-neutral-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <Truck className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Sambhal Showroom Pan-India Dispatch</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                📍 {settings.contactAddress || "Near agenty Choraha station Road Sambhal"}
              </p>
              <p className="text-[11px] text-neutral-600">
                📞 WhatsApp: <strong className="text-neutral-900 font-mono">8140251978</strong>
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
