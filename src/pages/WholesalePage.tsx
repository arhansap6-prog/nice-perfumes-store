import React from 'react';
import { useStore } from '../context/StoreContext';
import { WholesaleEnquiryForm } from '../components/forms/WholesaleEnquiryForm';
import { Sparkles, Package, Truck, ShieldCheck, Phone, MessageSquare, Crown, Gift, Award } from 'lucide-react';

export const WholesalePage: React.FC = () => {
  const { settings } = useStore();
  const whatsappNum = settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978';
  const primaryPhone = settings.contactPhone || '8140251978';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-amber-900 block">
          DIRECT WHOLESALE &amp; BULK SUPPLY
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-950 tracking-tight">
          Wholesale Supply &amp; Bulk Orders
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          {settings.brandName || "NICE Perfumes"} supplies perfume boutiques, retailers, wedding planners, and corporate organizations across India with premium alcohol-free attars, long-lasting luxury perfumes, handcrafted agarbatti, and royal bakhoor.
        </p>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
          <Package className="w-6 h-6 text-amber-600" />
          <h3 className="font-serif font-bold text-neutral-900 text-base">Bulk Tolas &amp; Litres</h3>
          <p className="text-xs text-neutral-500">
            Pure concentrated perfume oils available in 50g, 100g, 500g and 1kg aluminium bottles.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
          <Sparkles className="w-6 h-6 text-amber-600" />
          <h3 className="font-serif font-bold text-neutral-900 text-base">Bakhoor &amp; Agarbatti</h3>
          <p className="text-xs text-neutral-500">
            Direct wholesale rates for handcrafted agarbatti sticks, oud bakhoor chips and incense burners.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
          <Truck className="w-6 h-6 text-amber-600" />
          <h3 className="font-serif font-bold text-neutral-900 text-base">Express Pan-India Logistics</h3>
          <p className="text-xs text-neutral-500">
            Secure insured shipping to all states across India with door-step courier delivery.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
          <Award className="w-6 h-6 text-amber-600" />
          <h3 className="font-serif font-bold text-neutral-900 text-base">Unmatched Wholesale Pricing</h3>
          <p className="text-xs text-neutral-500">
            Direct pricing from {settings.brandName || "NICE Perfumes"} Palanpur showroom.
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Direct Contact Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transform-gpu">
        <div className="lg:col-span-7">
          <WholesaleEnquiryForm standalone={true} />
        </div>

        <div className="lg:col-span-5 space-y-6 transform-gpu">
          <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-neutral-800 shadow-xl">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              TALK DIRECTLY TO US
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              Instant Wholesale Help
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Need immediate rate cards, customized samples, or large perfume orders? Reach out directly via WhatsApp or phone.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
                <span className="text-neutral-400 font-bold uppercase text-[10px]">Direct Contact</span>
                <p className="font-serif text-base font-bold text-white">{settings.brandName || "NICE Perfumes"}</p>
                <p className="font-mono text-amber-400 text-sm font-semibold">+91 {settings.whatsappNumber?.replace(/[^0-9]/g, '') || "9265064213"}</p>
                <p className="font-mono text-neutral-400">{settings.supportEmail || "contact@niceperfumes.com"}</p>
              </div>

              <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
                <span className="text-neutral-400 font-bold uppercase text-[10px]">Palanpur Dispatch Hub</span>
                <p className="text-neutral-200">
                  {settings.contactAddress || "6, Diamond Square, Gathaman Road, Near SOS School, Opp. Kingston Valley, Palanpur - 385001"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/${(settings.whatsappNumber?.replace(/[^0-9]/g, '') || '9265064213').length === 10 ? '91' + (settings.whatsappNumber?.replace(/[^0-9]/g, '') || '9265064213') : (settings.whatsappNumber?.replace(/[^0-9]/g, '') || '919265064213')}?text=${encodeURIComponent(`Hello ${settings.brandName || "NICE Perfumes"}, I want to place a wholesale order.`)}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${primaryPhone}`}
                className="py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Directly</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
