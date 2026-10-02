// Khushboo Ghar Sambhal - Professional Fragrance Store
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Award, CheckCircle2, ChevronRight, MessageSquare, Star, Phone, MapPin, MessageCircle, ShoppingBag, Eye, RefreshCw, Crown, Compass, Zap, Percent, Flame, X } from 'lucide-react';
import { Product } from '../types';
import { AmBrandEmblem } from '../components/brand/AmBrandEmblem';
import { NicePerfumesLogo } from '../components/brand/NicePerfumesLogo';
import { PerfumeFeatures } from '../components/home/PerfumeFeatures';
import { ProductCard } from '../components/product/ProductCard';

export const HomePage: React.FC = () => {
  const { products, setCurrentPage, settings, addToCart, showToast, isLoadingData } = useStore();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [activeBudgetFilter, setActiveBudgetFilter] = useState<number | null>(null);
  const [isMapInteractive, setIsMapInteractive] = useState<boolean>(false);

  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const comboCount = settings.comboBottleCount || 5;
  const comboPrice = settings.comboOfferPrice || 1499;
  const isComboOfferVisible =
    settings.comboOfferEnabled !== false &&
    (settings.comboOfferEnabled as any) !== 'false' &&
    (settings.comboOfferEnabled as any) !== 0 &&
    (settings.comboOfferEnabled as any) !== 'inactive' &&
    (typeof window !== 'undefined' ? localStorage.getItem('aaf_combo_offer_enabled') !== 'false' : true);

  const [selectedComboPerfumes, setSelectedComboPerfumes] = useState<string[]>([]);

  const availableComboProducts = products.filter((p) => {
    if (settings.comboProductIds && settings.comboProductIds.length > 0) {
      return settings.comboProductIds.includes(p.id);
    }
    return true;
  });

  const handleOpenComboModal = () => {
    const defaultSelection = [];
    for (let i = 0; i < comboCount; i++) {
      const prod = availableComboProducts[i % (availableComboProducts.length || 1)];
      if (prod) defaultSelection.push(prod.id);
    }
    setSelectedComboPerfumes(defaultSelection);
    setIsComboModalOpen(true);
  };

  const handleAddCustomComboToCart = () => {
    const selectedNames = selectedComboPerfumes
      .map((id) => products.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const customComboProduct: Product = {
      id: `custom-combo-${Date.now()}`,
      name: `Custom ${comboCount}-Bottle Perfume Combo (${selectedComboPerfumes.length} Fragrances)`,
      price: settings.comboOfferOriginalPrice || 2499,
      salePrice: comboPrice,
      category: 'Deals & Combos',
      volume: `${comboCount} x 50ml EDP Set`,
      sku: 'AL-COMBO-CUST',
      stock: 100,
      featured: true,
      bestSeller: true,
      newArrival: false,
      status: 'available',
      description: `Selected Fragrances: ${selectedNames}`,
      notes: { top: ['Custom Selection'], middle: ['Selected Fragrances'], base: ['NICE Perfumes'] },
      images: [
        'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=80',
      ],
      createdAt: new Date().toISOString(),
    };

    addToCart(customComboProduct);
    setIsComboModalOpen(false);
    showToast(`Custom ${comboCount}-Perfume Set (₹${comboPrice}) added to Cart!`);
  };



  // Filter products dynamically by budget limits and category tabs
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const finalPrice = p.salePrice || p.price;
      if (activeBudgetFilter !== null) {
        if (activeBudgetFilter === 1499) {
          return p.category === 'Deals & Combos' || p.name.toLowerCase().includes('combo') || p.name.toLowerCase().includes('deal') || finalPrice === 1499;
        }
        if (finalPrice > activeBudgetFilter) return false;
      }

      if (selectedCategoryTab === 'all') return true;
      if (selectedCategoryTab === 'fresh') return p.category.includes('Aquatic') || p.name.includes('Blue') || p.name.includes('Ice');
      if (selectedCategoryTab === 'oud') return p.category.includes('Oud') || p.name.includes('Oud') || p.name.includes('Alpha');
      if (selectedCategoryTab === 'gourmand') return p.name.includes('Vanilla') || p.name.includes('Dessert');
      if (selectedCategoryTab === 'french') return p.name.includes('Burberry') || p.name.includes('Gucci') || p.category.includes('Women') || p.category.includes('Floral');
      return true;
    });
  }, [products, activeBudgetFilter, selectedCategoryTab]);

  const comboDeals = React.useMemo(() => {
    return products.filter((p) => p.category === 'Deals & Combos' || p.name.toLowerCase().includes('combo') || p.name.toLowerCase().includes('deal'));
  }, [products]);

  const renderProductCard = React.useCallback((product: Product, index: number) => (
    <ProductCard key={product.id} product={product} index={index} />
  ), []);

  return (
    <div className="bg-[#F7F4EB] text-neutral-900 min-h-screen">
      
      {/* FULL SCREEN HERO BANNER WITH USER'S UPLOADED PERFUME IMAGE */}
      <section className="transform-gpu relative overflow-hidden w-full h-screen min-h-[600px] flex flex-col justify-between px-4 sm:px-6 pt-28 sm:pt-36 pb-8 sm:pb-12">
        
        {/* High Quality Full Screen Original Background Image */}
        <div className="absolute inset-0 z-0 bg-neutral-950 transform-gpu will-change-transform">
          <img
            src="/home_bg.png?v=2.0"
            alt="NICE Perfumes Hero"
            className="w-full h-full object-cover object-center"
            // @ts-ignore
            fetchPriority="high"
            decoding="sync"
            loading="eager"
          />
        </div>

        {/* Top spacer for layout balance */}
        <div className="h-6 sm:h-10" />

        {/* Centered Brand Logo Section - NICE Perfumes (Exact Reference Image Design) */}
        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-2.5 my-auto translate-y-1 sm:translate-y-3 select-none flex flex-col items-center">
          
          {/* Subtle Heritage Kicker */}
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-900 font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            PALANPUR · PURE PERFUMES &amp; LUXURY FRAGRANCES
          </div>

          {/* EXACT LOGO EMBLEM MATCHING USER'S REFERENCE IMAGE - Perfectly Proportioned */}
          <div className="py-1 flex justify-center w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] md:max-w-[420px] mx-auto">
            <NicePerfumesLogo size="hero" textColor="text-neutral-950" />
          </div>

          {/* Tagline "Pure Perfumes & Luxury Fragrances" */}
          <p 
            style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
            className="text-sm sm:text-lg md:text-xl font-semibold italic tracking-wider text-amber-950 drop-shadow-[0_1px_3px_rgba(255,255,255,0.85)]"
          >
            {settings.brandTagline || "Pure Perfumes & Luxury Fragrances"}
          </p>

          {/* Specialty Categories */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 text-[10px] sm:text-xs font-bold text-neutral-900 tracking-[0.18em] uppercase pt-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
            <span>PERFUMES</span>
            <span className="text-amber-800 font-light">-</span>
            <span>ATTAR</span>
            <span className="text-amber-800 font-light">-</span>
            <span>AGARBATTI</span>
            <span className="text-amber-800 font-light">-</span>
            <span>BAKHOOR</span>
          </div>
        </div>

        {/* Bottom CTA Buttons & Quick Links */}
        <div className="relative z-10 text-center pb-2 sm:pb-6 max-w-2xl mx-auto w-full space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto w-full">
            <button
              id="hero-shop-collection-cta"
              onClick={() => setCurrentPage('shop')}
              className="w-full sm:w-auto px-8 py-3.5 bg-neutral-950 hover:bg-black text-white font-semibold text-xs tracking-[0.2em] uppercase rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
            <button
              id="hero-discover-attars-cta"
              onClick={() => setCurrentPage('collections')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/90 hover:bg-white text-neutral-900 font-semibold text-xs tracking-[0.2em] uppercase rounded-xl transition-all shadow-md border border-neutral-300/80 backdrop-blur-md flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>SIGNATURE ATTARS</span>
              <Crown className="w-4 h-4 text-amber-700" />
            </button>
          </div>

          {/* Genuine store highlight */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-white font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              6, Diamond Square, Palanpur
            </span>
            <span className="text-neutral-300">|</span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              Pan-India Express Dispatch
            </span>
          </div>
        </div>
      </section>

      

      {/* SPECIAL COMBO OFFER BANNER */}
      {/* VIRAL 5-PERFUME COMBO OFFER BANNER */}
      {isComboOfferVisible && (
        <section className="transform-gpu max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative rounded-3xl p-6 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-amber-400/80 overflow-hidden group">
          {/* Background Image using user's uploaded perfume photo - Bright & Clear */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 transform-gpu group-hover:scale-105 brightness-125 contrast-110 saturate-110 transform-gpu will-change-transform"
            style={{ backgroundImage: `url('/am_user_perfume_hero.webp?v=2.0')` }}
          />
          {/* Subtle Dark Gradient Overlay for optimal text contrast while keeping background picture bright */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
          <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          
            <div className="space-y-3 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono tracking-widest uppercase border border-amber-400/40 font-bold shadow-xs">
                ⭐ LIMITED GENTLEMAN OFFER
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {settings.comboOfferTitle || "ANY 5 PERFUMES AT JUST ₹1499"}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 max-w-xl font-medium leading-relaxed">
                {settings.comboOfferDescription || "Choose any 5 bottles from our entire catalog. Includes luxury gift box and Pan-India delivery!"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
              <button
                onClick={handleOpenComboModal}
                className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 border border-amber-500 transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 text-neutral-950" />
                <span>BUILD & BUY COMBO (₹{settings.comboOfferPrice || 1499})</span>
              </button>

              <button
                onClick={handleOpenComboModal}
                className="w-full sm:w-auto px-5 py-3.5 bg-neutral-950/90 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md border border-amber-400/50 backdrop-blur-sm transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>SELECT YOUR 5 BOTTLES</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CUSTOMIZABLE COMBO BUILDER MODAL */}
      {isComboModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-amber-500/40 p-6 sm:p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-200 text-white">
            
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold block mb-0.5">
                  EXCLUSIVE DEAL BUNDLE
                </span>
                <h3 className="font-serif text-2xl text-white font-bold uppercase tracking-wider">
                  Pick Your {comboCount} Perfume Set
                </h3>
              </div>
              <button onClick={() => setIsComboModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              Select your favorite {comboCount} fragrances for <span className="text-amber-300 font-bold font-mono">₹{comboPrice}</span> (Total MRP ₹{settings.comboOfferOriginalPrice || 2499}). Free Pan-India dispatch included!
            </p>

            <div className="space-y-3">
              {[...Array(comboCount)].map((_, idx) => (
                <div key={idx} className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                      Bottle Slot {idx + 1}
                    </span>
                  </div>

                  <select
                    value={selectedComboPerfumes[idx] || ''}
                    onChange={(e) => {
                      const updated = [...selectedComboPerfumes];
                      updated[idx] = e.target.value;
                      setSelectedComboPerfumes(updated);
                    }}
                    className="bg-black border border-neutral-700 text-amber-300 font-bold text-xs p-3 rounded-xl focus:outline-none focus:border-amber-400 flex-1"
                  >
                    {availableComboProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Bundle Special Price</span>
                <span className="text-2xl font-serif font-black text-amber-300 font-mono">₹{comboPrice}</span>
                <span className="text-xs text-neutral-500 line-through ml-2">₹{settings.comboOfferOriginalPrice || 2499}</span>
              </div>

              <button
                onClick={handleAddCustomComboToCart}
                className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>ADD {comboCount}-BOTTLE SET TO CART (₹{comboPrice})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* THE 9 CORE REQUESTED PERFUMES SHOWCASE */}
      <section id="core-perfumes-section" className="transform-gpu py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-amber-900 font-bold block mb-1">
              CURATED COLLECTION
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-neutral-950 font-bold tracking-tight">
              Crafted for the Modern Gentleman
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Explore our signature long-lasting fragrances, concentrated attars, and luxury scents.
            </p>
          </div>

          {/* Category Tabs Switcher */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {[
              { id: 'all', label: 'All 9 Perfumes' },
              { id: 'fresh', label: 'Fresh & Aquatic' },
              { id: 'oud', label: 'Oud & Signature' },
              { id: 'gourmand', label: 'Sweet & Vanilla' },
              { id: 'french', label: 'Floral & French' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategoryTab(tab.id);
                  setActiveBudgetFilter(null);
                }}
                className={`px-3.5 py-1.5 rounded-full uppercase tracking-wider text-[11px] transition-all cursor-pointer ${
                  selectedCategoryTab === tab.id && activeBudgetFilter === null
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Budget Filter Banner */}
        {activeBudgetFilter !== null && (
          <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 mb-8 text-xs sm:text-sm text-amber-900 font-bold shadow-xs animate-fade-in w-full">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Showing products in <span className="underline font-black text-amber-700">{activeBudgetFilter === 1499 ? '₹1499 Combo Store' : `₹${activeBudgetFilter} Sale Store`}</span></span>
            </span>
            <button 
              onClick={() => setActiveBudgetFilter(null)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Show All Store
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {isLoadingData && products.length === 0 ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-xs animate-pulse space-y-4">
                <div className="w-full h-64 bg-neutral-100 rounded-2xl" />
                <div className="h-4 bg-neutral-100 rounded w-3/4" />
                <div className="h-3 bg-neutral-100 rounded w-1/2" />
                <div className="h-10 bg-neutral-100 rounded-xl" />
              </div>
            ))
          ) : (
            activeBudgetFilter !== null 
              ? filteredProducts.map(renderProductCard)
              : filteredProducts.slice(0, 9).map(renderProductCard)
          )}
        </div>

        {activeBudgetFilter !== null && filteredProducts.length === 0 && (
          <div className="text-center py-10 bg-white rounded-3xl border border-neutral-100 p-6">
            <Percent className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-neutral-500">No products found under this budget right now.</p>
            <button 
              onClick={() => setActiveBudgetFilter(null)}
              className="mt-4 px-6 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              View Full Collection
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => setCurrentPage('shop')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 font-semibold text-xs uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all shadow-xs"
          >
            <span>View Complete Collection ({products.length} Fragrances)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Interactive Scent Matcher Quiz Section */}
      <PerfumeFeatures />



      {/* THREE SPECIAL CATEGORIES */}
      <section className="transform-gpu py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs text-amber-800 uppercase tracking-[0.25em] font-semibold">
            EXPLORE BY CATEGORY
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-neutral-950 font-bold">
            Signature Formulations
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            From concentrated oil extraits to French spray fragrances.
          </p>
        </div>

        <div className={`grid grid-cols-1 ${isComboOfferVisible ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          {/* Perfumes */}
          <div
            onClick={() => setCurrentPage('shop', { category: 'Perfumes' })}
            className="group relative h-[550px] transform-gpu will-change-transform rounded-2xl overflow-hidden cursor-pointer border border-neutral-200 hover:border-neutral-400 transition-all shadow-md hover:shadow-xl bg-neutral-950"
          >
            <img
              src="/grok_1790860603608.jpg?v=3.0"
              alt="Eau De Parfum Collection"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 transform-gpu"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
              <span className="text-[10px] text-amber-300 uppercase tracking-[0.25em] font-medium">
                EAU DE PARFUM
              </span>
              <h3 className="font-serif text-2xl text-white font-semibold">
                Gentleman Perfumes
              </h3>
              <p className="text-xs text-neutral-200 font-light">
                High-projection French extraits including AM Alpha, Secret Blue, and Ice Gold.
              </p>
              <div className="pt-1 flex items-center text-xs text-amber-300 font-medium tracking-wider uppercase gap-1 group-hover:translate-x-1 transition-transform">
                <span>SHOP PERFUMES</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Attar Oils */}
          <div
            onClick={() => setCurrentPage('shop', { category: 'Attar Oils' })}
            className="group relative h-[550px] transform-gpu will-change-transform rounded-2xl overflow-hidden cursor-pointer border border-neutral-200 hover:border-neutral-400 transition-all shadow-md hover:shadow-xl bg-neutral-950"
          >
            <img
              src="/IMG-20261001-WA0008.jpg?v=3.0"
              alt="Pure Attar Oils"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 transform-gpu"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
              <span className="text-[10px] text-amber-300 uppercase tracking-[0.25em] font-medium">
                100% NON-ALCOHOLIC
              </span>
              <h3 className="font-serif text-2xl text-white font-semibold">
                Pure Attar Concentrates
              </h3>
              <p className="text-xs text-neutral-200 font-light">
                Muaab Oud, AM Dessert &amp; concentrated oils hand-distilled without alcohol.
              </p>
              <div className="pt-1 flex items-center text-xs text-amber-300 font-medium tracking-wider uppercase gap-1 group-hover:translate-x-1 transition-transform">
                <span>SHOP ATTARS</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Combos & Deals */}
          {isComboOfferVisible && (
            <div
              onClick={() => setCurrentPage('collections')}
              className="group relative h-[550px] transform-gpu will-change-transform rounded-2xl overflow-hidden cursor-pointer border border-neutral-200 hover:border-neutral-400 transition-all shadow-md hover:shadow-xl bg-neutral-950"
            >
              <img
                src="/grok_1790860613675.jpg?v=3.0"
                alt="Gentleman Deals & Combos"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 transform-gpu"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
                <span className="text-[10px] text-amber-300 uppercase tracking-[0.25em] font-medium">
                  POPULAR VALUE PACKS
                </span>
                <h3 className="font-serif text-2xl text-white font-semibold">
                  Deals &amp; Combos
                </h3>
                <p className="text-xs text-neutral-200 font-light">
                  Curated gift boxes and 5-perfume sets starting at ₹1499 with free Pan-India dispatch.
                </p>
                <div className="pt-1 flex items-center text-xs text-amber-300 font-medium tracking-wider uppercase gap-1 group-hover:translate-x-1 transition-transform">
                  <span>EXPLORE COMBOS</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE NICE Perfumes */}
      <section className="transform-gpu py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs text-amber-800 uppercase tracking-[0.25em] font-semibold">
            THE NICE SCENT PROMISE
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-neutral-950 font-bold">
            Why Choose {settings.brandName || "NICE Perfumes"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Pure Perfumes &amp; Luxury Fragrances — By Saidbhai
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-neutral-200 p-6 rounded-2xl text-center space-y-3 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-800">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-semibold text-neutral-900">100% Pure Attars</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Non-alcoholic pure concentrated oils formulated for 12+ hours sillage &amp; compliments.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-6 rounded-2xl text-center space-y-3 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-800">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-semibold text-neutral-900">Bakhoor &amp; Agarbatti</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Handcrafted aromatic incense sticks and royal Arabian oud bakhoor for home &amp; garments.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-6 rounded-2xl text-center space-y-3 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-800">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-semibold text-neutral-900">Pan-India Express Dispatch 🇮🇳</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Dispatched with shockproof bubble packaging directly from our Palanpur showroom.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-6 rounded-2xl text-center space-y-3 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-800">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-semibold text-neutral-900">Direct WhatsApp Orders</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Instant responses &amp; bespoke fragrance consultation at +91 81402 51978.
            </p>
          </div>
        </div>
      </section>

      {/* BOUTIQUE HERITAGE & CONTACT BANNER */}
      <section className="transform-gpu py-14 sm:py-20 bg-[#f5f2eb] border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-2xl p-8 text-center space-y-4 text-white min-h-[380px] flex flex-col justify-between">
            {/* Background Image matching user's uploaded screenshot */}
            <div 
              className="absolute inset-0 bg-cover bg-center brightness-110 contrast-110 saturate-110 transform-gpu"
              style={{ backgroundImage: `url('/showroom_bg.png?v=2.0')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/50" />

            <div className="relative z-10 flex flex-col items-center">
              <span className="inline-block px-3 py-1 rounded-full bg-neutral-900/90 border border-amber-400/50 text-amber-300 font-mono text-[10px] tracking-widest uppercase font-bold shadow-md">
                PALANPUR, GUJARAT SHOWROOM
              </span>
            </div>

            <div className="relative z-10 space-y-2">
              <p className="text-[10px] tracking-[0.25em] text-amber-300 font-semibold uppercase">
                ESTABLISHED IN PALANPUR, GUJARAT
              </p>
              <h4 className="font-serif text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {settings.brandName || "NICE Perfumes"}
              </h4>
              <p className="text-xs text-neutral-200 max-w-sm mx-auto leading-relaxed font-medium">
                {settings.contactAddress || "6, Diamond Square, Gathaman Road, Near SOS School, Opp. Kingston Valley, Palanpur - 385001"}. Walk in for attar sampling, perfumes, agarbatti &amp; bakhoor.
              </p>
            </div>

            <div className="relative z-10 pt-2 border-t border-amber-400/30 text-[11px] text-neutral-300 space-y-1 font-medium">
              <p>Proprietor: <strong className="text-white">{settings.ownerName || "Saidbhai"}</strong></p>
              <p className="text-amber-300 font-bold font-mono">Timing: 10:00 AM to 11:00 PM</p>
              <p className="text-neutral-300 font-mono">Call &amp; WhatsApp: +91 {settings.whatsappNumber?.replace(/[^0-9]/g, '') || "8140251978"}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-300">
              <span>⭐ Expert Fragrance Craftsmanship by Saidbhai</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-neutral-950 font-bold">
              Pure Perfumes &amp; Luxury Fragrances
            </h2>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {settings.aboutText || "NICE Perfumes by Saidbhai is Palanpur’s premier scent destination creating masterpieces in perfumes, pure non-alcoholic attars, handcrafted agarbatti, and royal bakhoor."}
            </p>

            <div className="space-y-2.5 text-xs text-neutral-700 pt-2 border-t border-neutral-200">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
                <span>{settings.contactAddress || "6, Diamond Square, Gathaman Road, Near SOS School, Opp. Kingston Valley, Palanpur - 385001"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-800 flex-shrink-0" />
                <span>Call: <strong className="text-neutral-900 font-mono">+91 {settings.contactPhone || "8140251978"}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>WhatsApp: <strong className="text-emerald-800 font-mono">+91 {settings.whatsappNumber?.replace(/[^0-9]/g, '') || "8140251978"}</strong></span>
              </div>
            </div>

             <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentPage('about')}
                className="px-6 py-3 bg-neutral-950 hover:bg-black text-white text-xs tracking-wider uppercase rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Our Story &amp; Heritage
              </button>
              
              <a
                href={`https://wa.me/${(settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978').length === 10 ? '91' + (settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978') : (settings.whatsappNumber?.replace(/[^0-9]/g, '') || '918140251978')}?text=${encodeURIComponent(
                  `Hello ${settings.brandName || "NICE Perfumes"}, I want to know more about your fragrances.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs tracking-wider uppercase rounded-xl font-semibold transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Order (+91 92650 64213)</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* SHOP LOCATION & GOOGLE MAP SECTION ON HOME PAGE */}
      <section className="transform-gpu py-12 bg-neutral-900 text-white border-y border-neutral-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono tracking-widest uppercase border border-amber-400/30">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>VISIT OUR PALANPUR SHOWROOM</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                Experience {settings.brandName || "NICE Perfumes"} In Person
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl">
                Walk in for personalized fragrance sampling, pure attar oils, luxury perfumes, agarbatti, and bakhoor at 6, Diamond Square, Gathaman Road, Palanpur.
              </p>
            </div>

            <a
              href={settings.googleMapsUrl || "https://maps.app.goo.gl/Palanpur"}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-amber-500 shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>GET DIRECTIONS ON GOOGLE MAPS</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Store Information Card */}
            <div className="bg-neutral-950/90 p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">Palanpur Showroom</h3>
                    <p className="text-xs text-amber-400 font-medium">6, Diamond Square</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Address:</span>
                    <p className="font-medium text-neutral-200">
                      {settings.contactAddress || "6, Diamond Square, Gathaman Road, Near SOS School, Opp. Kingston Valley, Palanpur - 385001"}
                    </p>
                  </div>

                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Contact Numbers:</span>
                    <p className="font-mono text-amber-300 font-semibold">Call &amp; WhatsApp: +91 {settings.whatsappNumber?.replace(/[^0-9]/g, '') || "8140251978"}</p>
                    <p className="font-mono text-neutral-300">Alt Phone: +91 {settings.contactPhone2 || "8140251978"}</p>
                  </div>

                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Specialties:</span>
                    <p className="font-medium text-neutral-300 text-[11px]">
                      Pure Attar • Luxury Perfumes • Handcrafted Agarbatti • Royal Bakhoor • Pan-India Delivery
                    </p>
                  </div>

                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Store Timings:</span>
                    <p className="font-medium text-neutral-200">Monday - Sunday: 10:00 AM to 10:30 PM</p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${(settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978').length === 10 ? '91' + (settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978') : (settings.whatsappNumber?.replace(/[^0-9]/g, '') || '918140251978')}?text=${encodeURIComponent(
                  `Hello ${settings.brandName || "NICE Perfumes"}, I want to place an order.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ORDER ON WHATSAPP</span>
              </a>
            </div>

            {/* Embedded Interactive Google Map */}
            <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl h-[340px] sm:h-[400px] lg:h-auto min-h-[340px] relative bg-neutral-950 gpu-accelerated">
              <iframe
                title="NICE Perfumes Showroom Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.contactAddress || "6, Diamond Square, Gathaman Road, Palanpur 385001")}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={`w-full h-full min-h-[340px] transition-all ${
                  isMapInteractive ? 'pointer-events-auto' : 'pointer-events-none opacity-90'
                }`}
              />

              <a
                href={settings.googleMapsUrl || "https://maps.app.goo.gl/jVFZDxEbUCpcMgYi7"}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-black/25 hover:bg-black/15 transition-colors flex items-center justify-center cursor-pointer group z-10"
              >
                <div className="px-5 py-2.5 bg-neutral-950/90 hover:bg-black text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-amber-400/50 shadow-xl backdrop-blur-md flex items-center gap-2 group-hover:scale-105 transition-transform">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>OPEN DIRECTLY IN GOOGLE MAPS</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHATSAPP ORDER & COMMUNITY BANNER */}
      <section className="transform-gpu py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <div>
          <span className="text-xs text-emerald-800 uppercase tracking-[0.25em] font-semibold block mb-1">
            DIRECT WHATSAPP ORDER &amp; SUPPORT
          </span>
          <a
            href={`https://wa.me/${settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978'}?text=${encodeURIComponent("Hello NICE Perfumes, I want to explore your perfumes and order directly.")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 font-serif text-xl sm:text-2xl text-neutral-900 font-semibold hover:text-emerald-700 transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-emerald-600 fill-emerald-600" />
            <span className="text-neutral-950 font-bold">{settings.whatsappNumber || "+91 81402 51978"}</span>
          </a>
          <p className="text-xs text-neutral-500 mt-1">
            Connect with us directly on WhatsApp for custom orders, fast pan-India delivery, attar recommendations, and bulk orders.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "/grok_1790860617495.jpg?v=3.0",
            "/grok_1790860620229.jpg?v=3.0",
            "/grok_1790860603608.jpg?v=3.0",
            "/IMG-20261001-WA0005.jpg?v=3.0"
          ].map((imgUrl, i) => (
            <a
              key={i}
              href={`https://wa.me/${settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978'}?text=${encodeURIComponent("Hello NICE Perfumes, I am interested in your luxury perfume collection.")}`}
              target="_blank"
              rel="noreferrer"
              className="aspect-square rounded-2xl overflow-hidden border border-neutral-200 bg-white p-1 group relative shadow-sm block cursor-pointer flex items-center justify-center"
            >
              <img src={imgUrl} alt={`Fragrance ${i + 1}`} className="w-full h-full object-contain group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-emerald-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 rounded-2xl">
                <MessageCircle className="w-7 h-7 text-white fill-white" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Order on WhatsApp</span>
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
};
