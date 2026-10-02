import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    setCurrentPage,
    settings,
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const result = applyCoupon(couponCodeInput.trim());
    setCouponMessage({ text: result.message, success: result.success });
    if (result.success) {
      setCouponCodeInput('');
    }
  };

  const rawNum = settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978';
  const whatsappNum = rawNum.length === 10 ? `91${rawNum}` : rawNum;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-neutral-900">Your Shopping Bag is Empty</h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            Discover our exquisite line of pure attars, luxury perfumes, handcrafted agarbatti, and royal bakhoor.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('shop')}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
        >
          <span>EXPLORE MASTERPIECES</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">
            {settings.brandName || "NICE Perfumes"}
          </span>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">
            Shopping Cart ({cart.reduce((t, i) => t + i.quantity, 0)} Items)
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-medium underline uppercase tracking-wider self-start sm:self-auto cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const effectivePrice = item.product.salePrice || item.product.price;
            return (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-2xs hover:shadow-xs transition-shadow"
              >
                {/* Image */}
                <div
                  onClick={() => setCurrentPage('product-detail', { productId: item.product.id })}
                  className="w-20 h-24 sm:w-24 sm:h-28 bg-neutral-100 rounded-xl overflow-hidden shrink-0 cursor-pointer"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left space-y-1 w-full">
                  <span className="text-[10px] text-amber-800 uppercase tracking-widest font-semibold">
                    {item.product.category}
                  </span>
                  <h3
                    onClick={() => setCurrentPage('product-detail', { productId: item.product.id })}
                    className="font-serif text-lg font-bold text-neutral-900 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    {item.selectedVolume || item.product.volume}
                  </p>
                  <div className="text-sm font-semibold text-neutral-900 pt-1">
                    ₹{effectivePrice.toLocaleString('en-IN')}
                    {item.product.salePrice && (
                      <span className="text-xs text-neutral-400 line-through ml-2">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 p-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-white rounded-lg text-neutral-700 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-white rounded-lg text-neutral-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="font-serif text-base font-bold text-neutral-950 block">
                      ₹{(effectivePrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs uppercase tracking-wider font-semibold text-neutral-700 hover:text-black flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 space-y-6 shadow-sm sticky top-24">
          <h2 className="font-serif text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-3">
            Order Summary
          </h2>

          {/* Coupon Input */}
          <div className="space-y-2">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code (e.g. WELCOME10)"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs uppercase font-mono text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {couponMessage && (
              <p
                className={`text-[11px] ${
                  couponMessage.success ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {couponMessage.text}
              </p>
            )}

            {appliedCoupon && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-800">
                <span className="font-semibold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Code: {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-red-600 hover:underline text-[11px] font-bold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-mono text-neutral-900 font-semibold">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount Applied</span>
                <span className="font-mono">- ₹{cartDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <span>Pan-India Shipping</span>
                <span className="text-[10px] text-neutral-400">(Dispatched from Sambhal)</span>
              </span>
              <span className="font-mono text-neutral-900 font-semibold">
                {cartDeliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase">FREE</span>
                ) : (
                  `₹${cartDeliveryFee}`
                )}
              </span>
            </div>

            <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline text-base font-bold text-neutral-950">
              <span className="font-serif">Total Payable</span>
              <span className="font-serif text-2xl text-neutral-950">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="space-y-3">
            <button
              onClick={() => setCurrentPage('checkout')}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>PROCEED TO WHATSAPP CHECKOUT</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            {/* Direct WhatsApp Ordering */}
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                `Hello ${settings.brandName || "NICE Perfumes"}, I have ${cart.length} item(s) in my cart totaling ₹${cartTotal.toLocaleString('en-IN')}. Please confirm my order.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Quick WhatsApp Enquiry</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="space-y-2 pt-2 text-[11px] text-neutral-500 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Authentic &amp; Pure Alcohol-Free Fragrances</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Express Dispatch with Live Courier Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
