import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface WhatsAppButtonProps {
  message?: string;
  floating?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  floating = true,
}) => {
  const { settings } = useStore();
  
  const brand = settings.brandName || "NICE Perfumes";
  const rawNum = settings.whatsappNumber?.replace(/[^0-9]/g, '') || '8140251978';
  const cleanNum = rawNum.length === 10 ? `91${rawNum}` : rawNum;
  const defaultMsg = message || `Hello ${brand}, I would like to enquire about your perfumes, attars, agarbatti and bakhoor.`;
  const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(defaultMsg)}`;

  if (!floating) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl uppercase tracking-widest transition-all shadow-md cursor-pointer"
      >
        <MessageCircle className="w-4 h-4 text-white" />
        <span>WhatsApp Order &amp; Enquiry</span>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with ${brand} on WhatsApp`}
      className="fixed bottom-20 lg:bottom-8 right-5 z-40 w-14 h-14 bg-emerald-600 hover:bg-emerald-500 hover:scale-110 text-white rounded-full flex items-center justify-center shadow-2xl transition-all border-2 border-white/90 group cursor-pointer"
      title={`Chat with ${brand} on WhatsApp`}
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
      <span className="absolute right-16 bg-neutral-950 text-neutral-100 text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-neutral-800 font-medium tracking-wide">
        Chat on WhatsApp ({cleanNum.replace(/^91/, '')})
      </span>
    </a>
  );
};
