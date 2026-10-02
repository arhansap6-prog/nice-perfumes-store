import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const { setCurrentPage, settings } = useStore();

  const isComboOfferVisible =
    settings.comboOfferEnabled !== false &&
    (settings.comboOfferEnabled as any) !== 'false' &&
    (settings.comboOfferEnabled as any) !== 0 &&
    (settings.comboOfferEnabled as any) !== 'inactive' &&
    (typeof window !== 'undefined' ? localStorage.getItem('aaf_combo_offer_enabled') !== 'false' : true);

  const collections = [
    ...(isComboOfferVisible
      ? [
          {
            title: 'Gentleman Value Combos',
            subtitle: `LIMITED TIME OFFER • ANY ${settings.comboBottleCount || 5} FOR ₹${settings.comboOfferPrice || 1499}`,
            description: `Choose any ${settings.comboBottleCount || 5} Eau De Parfum fragrances (50ml each) with premium gift packaging, complimentary atomisers, and free pan-India express delivery.`,
            category: 'Deals & Combos',
            image: '/category_deals_combos.jpg',
            badge: 'POPULAR OFFER',
          },
        ]
      : []),
    {
      title: 'Gentleman Perfumes (Eau De Parfum)',
      subtitle: 'HIGH PROJECTION & SILLAGE',
      description: 'French extraits compounded at 25%-30% perfume concentration. Includes Tuscan Leather, Sauvage Noir, Bleu Gentleman, and Tobacco Vanille.',
      category: 'Perfumes',
      image: '/category_gentleman_perfumes.jpg',
      badge: 'TOP RATED',
    },
    {
      title: 'Traditional Non-Alcoholic Attar Oils',
      subtitle: '100% PURE ROLL-ON CONCENTRATES',
      description: 'Hand-distilled botanicals, white musk, Shamama, and rose nectars created without any alcohol for long-lasting intimate skin scent.',
      category: 'Attar Oils',
      image: '/category_pure_attars.jpg',
      badge: 'AUTHENTIC',
    },
    {
      title: 'The Royal Oud & Ambergris Reserve',
      subtitle: 'RARE CAMBODIAN & ASSAM OUD EXTRAITS',
      description: 'Distilled from matured agarwood resin. Deep, dark, smoky, and majestic fragrances created for celebratory occasions.',
      category: 'Perfumes',
      image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=80',
      badge: 'LUXURY RESERVE',
    },
  ];

  return (
    <div className="bg-[#F7F4EB] text-neutral-900 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 border-b border-neutral-200 pb-10">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-amber-900 block">
          CURATED OLFACTORY FAMILIES
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-neutral-950 tracking-tight uppercase font-bold">
          Fragrance Collections
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          Explore signature collections from {settings.brandName || "NICE Perfumes"}. Hand-compounded for discerning scent lovers who value distinct presence, projection, and unforgettable compliments.
        </p>
      </div>

      {/* Collections Showcase Grid */}
      <div className="space-y-10 sm:space-y-12">
        {collections.map((item, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              className="bg-white border border-neutral-200/90 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center shadow-xs hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className={`lg:col-span-6 relative aspect-[16/10] lg:aspect-[4/3] overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-neutral-900/90 text-white font-mono text-[10px] uppercase tracking-wider rounded-full shadow-xs">
                  {item.badge}
                </span>
              </div>

              {/* Text Content */}
              <div className={`lg:col-span-6 p-6 sm:p-10 space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <span className="text-[10px] sm:text-xs text-amber-800 uppercase tracking-[0.2em] font-bold block">
                  {item.subtitle}
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-bold tracking-tight">
                  {item.title}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentPage('shop', { category: item.category })}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold tracking-[0.16em] uppercase rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
                  >
                    <span>EXPLORE COLLECTION</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
