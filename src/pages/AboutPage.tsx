import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { Award, ShieldCheck, MapPin, Phone, MessageSquare, Sparkles, Truck, Compass, CheckCircle2 } from 'lucide-react';
import { AmBrandEmblem } from '../components/brand/AmBrandEmblem';

export const AboutPage: React.FC = () => {
  const { setCurrentPage, settings } = useStore();

  const brandTitle = settings.brandName || "NICE Perfumes";
  const tagline = settings.brandTagline || "Pure Perfumes & Luxury Fragrances";
  const locationText = "Palanpur, Gujarat";
  const landmarkText = "6, Diamond Square, Gathaman Road, Near SOS School, Opp. Kingston Valley, Palanpur - 385001";
  const supportNum = settings.contactPhone || "8140251978";
  const whatsappNum = settings.whatsappNumber?.replace(/[^0-9]/g, '') || "8140251978";

  return (
    <div className="bg-[#F7F4EB] text-neutral-900 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      
      {/* Hero Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 border-b border-neutral-200/80 pb-12"
      >
        <div className="pt-2">
          <AmBrandEmblem size="md" showSubtitle={false} interactive={false} />
        </div>

        <span className="text-xs tracking-[0.25em] uppercase font-bold text-amber-900 block">
          OUR STORY &amp; HERITAGE
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-neutral-950 tracking-tight uppercase font-bold">
          {brandTitle}
        </h1>

        <p className="text-xs sm:text-base text-neutral-600 tracking-[0.25em] uppercase font-medium">
          {tagline}
        </p>

        <p className="font-serif italic text-base sm:text-xl text-neutral-700 max-w-2xl mx-auto">
          "Where every scent tells your story — bringing refined traditional luxury and blessed essentials within reach."
        </p>
      </motion.div>

      {/* Brand Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        
        {/* Visual Showcase Card */}
        <div className="relative rounded-3xl overflow-hidden border border-neutral-200/90 shadow-xl aspect-[3/4] sm:aspect-[4/5] group bg-neutral-950">
          <img
            src="/IMG-20261001-WA0013.jpg?v=3.0"
            alt="NICE Perfumes Showroom & Artistry"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full border border-neutral-200">
              {locationText.toUpperCase()} SHOWROOM
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
            <span className="text-[11px] uppercase text-amber-300 tracking-widest block font-mono font-medium">
              ESTABLISHED IN PALANPUR, GUJARAT
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              {settings.brandName || "NICE Perfumes"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
              {settings.contactAddress || "6, Diamond Square, Gathaman Road, Near SOS School, Opp. Kingston Valley, Palanpur - 385001"}
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="space-y-6 text-neutral-700 text-sm sm:text-base leading-relaxed">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-[0.2em] text-amber-800 font-semibold block">
              OUR BELIEF &amp; ESSENCE
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-neutral-950 font-bold tracking-tight">
              Pure Perfumes &amp; Luxury Fragrances
            </h2>
          </div>

          <p className="text-neutral-700 leading-relaxed font-normal">
            <strong className="text-neutral-900">{settings.brandName || "NICE Perfumes"}</strong>, curated by <strong>Saidbhai</strong>, is Palanpur’s premier scent destination creating masterpieces in non-alcoholic pure attars, long-lasting luxury perfumes, fragrant agarbatti, and authentic Arabian bakhoor.
          </p>

          <p className="text-neutral-600 leading-relaxed">
            {settings.aboutText || "NICE Perfumes by Saidbhai brings you 100% pure alcohol-free attars, French-grade luxury perfumes, agarbatti, and bakhoor with express delivery across India."}
          </p>

          <p className="text-neutral-600 leading-relaxed">
            From classic oriental blends to custom-crafted sprays and wedding bridal essentials, we pay microscopic attention to quality, authentic ingredients, and exquisite presentation for our valued customers.
          </p>

          {/* Quick Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage('shop')}
              className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Explore Scent Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* Founders Section */}
      <div className="space-y-8">
        <div className="border-b border-neutral-200/80 pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-amber-800">
              <Award className="w-4 h-4" />
              <span>THE VISIONARIES</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-bold">
              Meet our Curators &amp; Founders
            </h2>
          </div>

          <div className="text-xs text-neutral-500 font-mono tracking-wider uppercase">
            {brandTitle}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-900 font-serif font-bold text-lg">
              KG
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-neutral-950">{settings.ownerName || "Saidbhai"}</h3>
              <p className="text-xs text-amber-800 font-medium tracking-wider uppercase">Proprietor &amp; Master Curator</p>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Leading fragrance formulation, pure attar curation, and bespoke scent creations at {settings.brandName || "NICE Perfumes"}. Dedicated to crafting pure traditional itrs and premium long-lasting perfumes with unmatched sillage.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-900 font-serif font-bold text-lg">
              NP
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-neutral-950">Palanpur Showroom &amp; Dispatch</h3>
              <p className="text-xs text-amber-800 font-medium tracking-wider uppercase">6, Diamond Square, Gathaman Road, Palanpur</p>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Serving customers in-store and shipping orders nationwide with shockproof bubble packaging. Connect on WhatsApp ({whatsappNum}) or Call ({supportNum}) for instant orders and inquiries.
            </p>
          </div>

        </div>
      </div>

      {/* Pan-India Delivery & Assurance Banner */}
      <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-700 text-amber-300 rounded-full text-[11px] font-mono uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>PAN-INDIA DISPATCH 🇮🇳</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              We Deliver Across Every Corner of India
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              {settings.deliveryDetails || "Orders are securely packed in protective bubble wrap and dispatched within 24-48 hours. Live online tracking links will be shared with you on WhatsApp."}
            </p>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent("Hello NICE Perfumes, I would like to place an order.")}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct Order ({whatsappNum})</span>
            </a>
            <p className="text-[10px] text-neutral-400 text-center font-mono">
              Call Support: +91 {supportNum}
            </p>
          </div>
        </div>
      </div>

      {/* Boutique Visit Guide */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-semibold block">
              PHYSICAL STORE VISIT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-bold">
              Visit Our Showroom in {locationText}
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono">
            <MapPin className="w-4 h-4 text-amber-800" />
            <span>Petla Burj Bus Stop</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
              <span className="text-xs uppercase font-bold text-amber-900 tracking-wider block">Showroom Address:</span>
              <p className="font-medium text-neutral-900 text-base">
                {settings.contactAddress || "Near agenty Choraha station Road Sambhal UP"}
              </p>
              <p className="text-xs text-neutral-600">
                Near agenty Choraha station Road Sambhal UP
              </p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Walk-in fragrance testing &amp; personal attar sampling</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Luxury perfumes, pure alcohol-free attars, agarbatti &amp; bakhoor</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Accepting UPI, Google Pay, PhonePe, Cards &amp; Cash</span>
              </div>
            </div>

            <div className="pt-2 text-xs font-mono space-y-1">
              <div>
                <span className="text-neutral-400 block text-[10px]">PHONE CALLS:</span>
                <span className="text-neutral-900 font-semibold text-sm">+91 {supportNum}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">WHATSAPP:</span>
                <span className="text-emerald-700 font-semibold text-sm">+91 {whatsappNum}</span>
              </div>

            </div>
          </div>

          <div className="aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200 shadow-sm relative group">
            <iframe
              title={`${settings.brandName || "NICE Perfumes"} Showroom Location`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.contactAddress || "Petla Burj Bus Stop, Sambhal 500064")}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full border-0 pointer-events-none opacity-85"
              loading="lazy"
            />
            <a
              href={settings.googleMapsUrl || "https://maps.app.goo.gl/jVFZDxEbUCpcMgYi7"}
              target="_blank"
              rel="noreferrer"
              className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer z-10"
            >
              <div className="px-4 py-2 bg-neutral-950/95 hover:bg-black text-amber-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl border border-amber-400/50 shadow-md backdrop-blur-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>OPEN DIRECTLY IN GOOGLE MAPS</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Core Quality Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-200/80">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg text-neutral-950 font-semibold">Artisanal Mastery</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            High oil concentration ensuring long-lasting performance and projection tailored for maximum compliments.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg text-neutral-950 font-semibold">Pure &amp; Non-Alcoholic Itrs</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Our traditional attar (itr) concentrates are 100% alcohol-free, completely skin-safe, and highly concentrated.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg text-neutral-950 font-semibold">Pan-India Delivery</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Every shipment is double bubble-wrapped in shockproof packaging to arrive in flawless condition at your doorstep.
          </p>
        </div>
      </div>

    </div>
  );
};
