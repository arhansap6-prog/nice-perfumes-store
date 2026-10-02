import React, { useState } from 'react';
import { Product, ProductVolumeVariant } from '../../types';
import { useStore } from '../../context/StoreContext';
import { getProductVolumeVariants } from '../../utils/productUtils';
import { ShoppingBag, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { setCurrentPage, addToCart } = useStore();
  const variants = getProductVolumeVariants(product);

  // Track selected volume reactively so any price or variant update is immediately reflected
  const [selectedVolume, setSelectedVolume] = useState<string>(
    () => variants[0]?.volume || product.volume || '100ml'
  );

  const selectedVariant =
    variants.find((v) => v.volume === selectedVolume) ||
    variants[0] || {
      volume: product.volume || '100ml',
      price: product.price,
      salePrice: product.salePrice,
    };

  const price = selectedVariant.price;
  const salePrice = selectedVariant.salePrice;
  const isDiscounted = !!(salePrice && salePrice < price);
  const discountPercent = isDiscounted
    ? Math.round(((price - salePrice!) / price) * 100)
    : 0;
  const finalPrice = salePrice || price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.status === 'out_of_stock') return;
    addToCart(product, 1, selectedVariant.volume, selectedVariant.price, selectedVariant.salePrice);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.status === 'out_of_stock') return;
    addToCart(product, 1, selectedVariant.volume, selectedVariant.price, selectedVariant.salePrice);
    setCurrentPage('checkout');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.2 }}
      className="group bg-white border border-neutral-200 hover:border-black rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-xl shadow-xs transform-gpu"
    >
      {/* Image Container */}
      <div
        onClick={() => setCurrentPage('product-detail', { productId: product.id })}
        className="relative aspect-[4/5] bg-white p-2 sm:p-2.5 overflow-hidden cursor-pointer flex items-center justify-center rounded-t-2xl border-b border-neutral-100"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-20 group-hover:opacity-5 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.status === 'out_of_stock' ? (
            <span className="bg-red-600 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold shadow-xs">
              OUT OF STOCK
            </span>
          ) : isDiscounted ? (
            <span className="bg-amber-600 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-xs">
              SAVE {discountPercent}%
            </span>
          ) : null}
          {product.bestSeller && (
            <span className="bg-neutral-900 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-medium shadow-xs">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Selected Volume Floating Tag */}
        <div className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-neutral-900 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-neutral-300 font-mono shadow-xs font-bold transition-all">
          {selectedVariant.volume}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-amber-800 font-semibold truncate">
              {product.category}
            </span>
          </div>

          <h3
            onClick={() => setCurrentPage('product-detail', { productId: product.id })}
            className="font-serif text-base sm:text-lg text-neutral-950 group-hover:text-amber-900 transition-colors cursor-pointer line-clamp-1 font-bold tracking-tight"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-600 line-clamp-2 mt-1 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* KEY FEATURE: INTERACTIVE VOLUME SELECTOR (12ml / 50ml / 100ml with Live Price Switch) */}
        {variants.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-neutral-100">
            <div className="flex items-center justify-between text-[10px] text-neutral-500">
              <span className="font-semibold uppercase tracking-wider text-neutral-700">Select Bottle Size:</span>
              <span className="font-mono text-amber-800 font-semibold">{selectedVariant.volume}</span>
            </div>

            <div className={`grid gap-1.5 ${variants.length === 2 ? 'grid-cols-2' : variants.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {variants.map((v, i) => {
                const isSelected = selectedVariant.volume === v.volume;
                const vDisplayPrice = v.salePrice || v.price;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVolume(v.volume);
                    }}
                    className={`py-1.5 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-950 text-white font-bold ring-2 ring-amber-400 shadow-sm'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200'
                    }`}
                  >
                    <span className="text-[11px] leading-tight font-extrabold uppercase">{v.volume}</span>
                    <span className={`text-[9px] font-mono leading-tight mt-0.5 ${isSelected ? 'text-amber-300' : 'text-neutral-500'}`}>
                      ₹{vDisplayPrice}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-neutral-200 flex flex-col space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg font-bold text-neutral-950">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              {isDiscounted && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[9px] text-emerald-700 font-medium">
              Pan-India Free Shipping 🚚
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              disabled={product.status === 'out_of_stock'}
              onClick={handleAddToCart}
              className="py-2 px-2 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1 border border-amber-500 disabled:opacity-40"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>+ CART</span>
            </button>
            <button
              disabled={product.status === 'out_of_stock'}
              onClick={handleBuyNow}
              className="py-2 px-2 bg-neutral-950 hover:bg-black text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1 disabled:opacity-40"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>BUY NOW</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
