import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, ShieldCheck, Sparkles, ChevronRight, Check, Minus, Plus, MessageSquare, ArrowLeft, Star, Heart, ShoppingBag, Zap } from 'lucide-react';
import { ProductVolumeVariant } from '../types';
import { getProductVolumeVariants } from '../utils/productUtils';

export const ProductDetailPage: React.FC = () => {
  const { products, pageParams, setCurrentPage, addToCart, settings } = useStore();

  const productId = pageParams?.productId;
  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const variants = product ? getProductVolumeVariants(product) : [];
  const [selectedVolume, setSelectedVolume] = useState<string>(() => variants[0]?.volume || product?.volume || '100ml');

  useEffect(() => {
    if (product) {
      const v = getProductVolumeVariants(product);
      if (v.length > 0 && !v.some((item) => item.volume === selectedVolume)) {
        setSelectedVolume(v[0].volume);
      }
    }
  }, [product?.id]);

  const selectedVariant =
    variants.find((v) => v.volume === selectedVolume) ||
    variants[0] || {
      volume: product?.volume || '100ml',
      price: product?.price || 1500,
      salePrice: product?.salePrice,
    };

  if (!product) {
    return (
      <div className="bg-[#faf9f6] text-neutral-900 min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <h2 className="font-serif text-2xl font-bold">Perfume Not Found</h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 bg-neutral-900 text-white font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-black cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const price = selectedVariant.price;
  const salePrice = selectedVariant.salePrice;
  const isDiscounted = !!(salePrice && salePrice < price);
  const discountPercent = isDiscounted
    ? Math.round(((price - salePrice!) / price) * 100)
    : 0;
  const currentPrice = salePrice || price;

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant.volume, selectedVariant.price, selectedVariant.salePrice);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant.volume, selectedVariant.price, selectedVariant.salePrice);
    setCurrentPage('checkout');
  };

  return (
    <div className="bg-[#F7F4EB] text-neutral-900 min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-16">
      
      {/* Back to Shop Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <button
          onClick={() => setCurrentPage('shop')}
          className="hover:text-neutral-950 transition-colors flex items-center gap-1 uppercase tracking-wider font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Shop</span>
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        <span className="text-amber-800 uppercase tracking-wider font-semibold">{product.category}</span>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        <span className="text-neutral-700 font-serif font-medium truncate">{product.name}</span>
      </div>

      {/* Main Product Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Gallery Section (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Large Display Image */}
          <div className="relative aspect-[4/5] bg-white p-3 rounded-3xl overflow-hidden border border-neutral-200 shadow-sm flex items-center justify-center">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-md"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.status === 'out_of_stock' ? (
                <span className="bg-red-600 text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg font-bold shadow-xs">
                  OUT OF STOCK
                </span>
              ) : isDiscounted ? (
                <span className="bg-amber-600 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-lg shadow-xs">
                  SAVE {discountPercent}%
                </span>
              ) : null}
              {product.bestSeller && (
                <span className="bg-neutral-900 text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg font-medium shadow-xs">
                  BEST SELLER
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4 text-xs font-mono uppercase tracking-wider text-neutral-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-200 shadow-xs">
              SKU: {product.sku}
            </div>
          </div>

          {/* Thumbnails (Multiple Product Images support) */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-neutral-900 ring-2 ring-neutral-300'
                      : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Product Info Section (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-800 font-semibold mb-2">
              <span>{product.category}</span>
              <span>•</span>
              <span className="font-mono">🌿 CRAFTED FOR GENTLEMEN</span>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-4xl text-neutral-950 tracking-tight font-bold">
              {product.name}
            </h1>

          </div>

          {/* Pricing */}
          <div className="py-4 border-y border-neutral-200 flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-serif text-neutral-950 font-bold">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {isDiscounted && (
              <span className="text-base text-neutral-400 line-through">
                ₹{selectedVariant.price.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-neutral-500 tracking-wider uppercase ml-auto font-medium">
              (Inclusive of all taxes &amp; shipping)
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            {product.description}
          </p>

          {/* Volume / Size Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-700 uppercase tracking-wider font-semibold">
                Select Bottle Volume / Size:
              </span>
              <span className="font-mono text-amber-800 font-bold">{selectedVariant.volume}</span>
            </div>
            <div className={`grid gap-2.5 ${variants.length === 2 ? 'grid-cols-2' : variants.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {variants.map((v, i) => {
                const isSelected = selectedVariant.volume === v.volume;
                const vDisplayPrice = v.salePrice || v.price;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedVolume(v.volume)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-neutral-950 text-white border-neutral-950 font-bold ring-2 ring-amber-400 shadow-md'
                        : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="text-sm font-extrabold uppercase">{v.volume}</span>
                    <span className={`text-xs font-mono font-bold mt-1 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`}>
                      ₹{vDisplayPrice.toLocaleString('en-IN')}
                    </span>
                    {v.salePrice && v.salePrice < v.price && (
                      <span className={`text-[10px] line-through ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                        ₹{v.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fragrance Notes Pyramid */}
          {product.notes && (
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold uppercase tracking-[0.18em] border-b border-neutral-100 pb-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Fragrance Notes Structure</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                {product.notes.top && (
                  <div>
                    <span className="text-amber-900 font-semibold uppercase text-[10px] tracking-wider block">
                      TOP NOTES (First Impression)
                    </span>
                    <p className="text-neutral-700 mt-0.5">
                      {product.notes.top.join(' • ')}
                    </p>
                  </div>
                )}
                {product.notes.middle && (
                  <div>
                    <span className="text-amber-900 font-semibold uppercase text-[10px] tracking-wider block">
                      HEART / MIDDLE NOTES (Signature Body)
                    </span>
                    <p className="text-neutral-700 mt-0.5">
                      {product.notes.middle.join(' • ')}
                    </p>
                  </div>
                )}
                {product.notes.base && (
                  <div>
                    <span className="text-amber-900 font-semibold uppercase text-[10px] tracking-wider block">
                      BASE NOTES (Lasting Drydown)
                    </span>
                    <p className="text-neutral-700 mt-0.5">
                      {product.notes.base.join(' • ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantity & Buy Buttons */}
          <div className="space-y-4 pt-1">
            
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-700 uppercase tracking-wider font-semibold">Quantity:</span>
              <div className="flex items-center bg-white border border-neutral-200 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-neutral-600 hover:text-neutral-950 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-mono font-bold text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-neutral-600 hover:text-neutral-950 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-neutral-600">
                Availability: {' '}
                <span className={product.status === 'available' ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'}>
                  {product.status === 'available' ? 'In Stock (Ready for Dispatch)' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Flipkart-Style Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="add-to-cart-product-detail-btn"
                disabled={product.status === 'out_of_stock'}
                onClick={handleAddToCart}
                className="py-4 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-extrabold text-xs tracking-[0.16em] uppercase rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-md flex items-center justify-center gap-2 border border-amber-500"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
              <button
                id="buy-now-product-detail-btn"
                disabled={product.status === 'out_of_stock'}
                onClick={handleBuyNow}
                className="py-4 bg-neutral-950 hover:bg-black text-white font-extrabold text-xs tracking-[0.16em] uppercase rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>BUY NOW</span>
              </button>
            </div>
          </div>

          {/* Delivery & Security Badges */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-2.5 text-xs text-neutral-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-amber-800 flex-shrink-0" />
              <span>Fast Pan-India Express Delivery (3-5 Business Days)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-800 flex-shrink-0" />
              <span>Direct WhatsApp Orders &amp; Pan-India Express Delivery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Authentic Formulation • {settings.contactAddress?.split(',')[0].trim() || "Sambhal"} Showroom</span>
            </div>
          </div>

          {/* Direct WhatsApp Inquiry */}
          <div className="pt-2 text-center">
            <a
              href={`https://wa.me/${(settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978').length === 10 ? '91' + (settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978') : (settings.whatsappNumber?.replace(/[^0-9]/g, '') || '918140251978')}?text=${encodeURIComponent(`Hello ${settings.brandName || "NICE Perfumes"}, I have a query about ${product.name} (${product.volume}).`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-emerald-700 hover:underline uppercase tracking-wider font-semibold"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Have questions about this item? WhatsApp Us (+91 {settings.whatsappNumber?.replace(/[^0-9]/g, '') || "8140251978"})</span>
            </a>
          </div>

        </div>

      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-neutral-200 space-y-6">
          <div>
            <span className="text-xs text-amber-800 uppercase tracking-[0.25em] font-semibold block mb-1">
              OLFACTORY MATCHES
            </span>
            <h2 className="font-serif text-2xl text-neutral-950 font-bold tracking-tight">
              You May Also Appreciate
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => setCurrentPage('product-detail', { productId: rel.id })}
                className="bg-white border border-neutral-200 hover:border-neutral-400 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-lg"
              >
                <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative">
                  <img
                    src={rel.images[0]}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-2 right-2 text-[9px] uppercase tracking-wider text-neutral-800 bg-white/90 px-2 py-0.5 rounded-full border border-neutral-200 font-mono shadow-xs">
                    {rel.volume}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] uppercase font-semibold text-amber-800 block">{rel.category}</span>
                  <h4 className="font-serif text-sm sm:text-base font-semibold text-neutral-950 group-hover:text-amber-900 line-clamp-1">
                    {rel.name}
                  </h4>
                  <div className="text-sm font-serif font-bold text-neutral-950">
                    ₹{(rel.salePrice || rel.price).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
