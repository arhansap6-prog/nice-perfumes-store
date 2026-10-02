import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, MessageSquare, ExternalLink, Send, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { AmBrandEmblem } from '../components/brand/AmBrandEmblem';

export const ContactPage: React.FC = () => {
  const { showToast, settings } = useStore();

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const brand = settings.brandName || "NICE Perfumes";
  const tagline = settings.brandTagline || "Pure Perfumes & Luxury Fragrances";
  const address = settings.contactAddress || "6, Diamond Square, Gathaman Road, Near SOS School, Opp. Kingston Valley, Palanpur - 385001";
  const phone = settings.contactPhone || "8140251978";
  const rawNum = settings.whatsappNumber?.replace(/[^0-9]/g, '') || "8140251978";
  const num = rawNum.length === 10 ? `91${rawNum}` : rawNum;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(`Thank you! Your inquiry has been sent to ${brand} concierge.`);
  };

  const googleMapsUrl = settings.googleMapsUrl || "https://maps.app.goo.gl/jVFZDxEbUCpcMgYi7";

  return (
    <div className="bg-[#F7F4EB] text-neutral-900 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 border-b border-neutral-200/80 pb-10">
        <div className="pt-2">
          <AmBrandEmblem size="sm" showSubtitle={false} interactive={false} />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-amber-900 block">
          VISIT OR CONTACT US
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-neutral-950 tracking-tight uppercase font-bold">
          Showroom &amp; Concierge
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto">
          We welcome you to visit our beautiful showroom or reach out directly for custom itrs, perfume choices, and bulk orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Contact Info Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border border-[#E5DDD0] shadow-sm space-y-6">
            
            <div>
              <h2 className="font-serif text-2xl text-neutral-950 uppercase tracking-tight font-bold leading-tight">
                {brand}
              </h2>
              <span className="text-xs tracking-wider uppercase text-amber-800 font-semibold block mt-1">
                {tagline}
              </span>
            </div>

            {/* Address */}
            <div className="space-y-2 text-xs text-neutral-700 border-t border-neutral-100 pt-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block mb-1 text-sm">Showroom Address:</strong>
                  <p className="text-neutral-600 leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>
            </div>

            {/* Phones & Hours */}
            <div className="space-y-3.5 border-t border-neutral-100 pt-4 text-xs">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-800 mt-0.5" />
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Phone / WhatsApp:</span>
                  <div className="space-y-1">
                    {phone.split(',').map((p, i) => (
                      <a key={i} href={`tel:${p.trim()}`} className="text-neutral-900 font-mono font-bold block hover:underline">
                        +91 {p.trim()} {i === 0 ? "(Primary)" : "(Secondary)"}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-800" />
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Showroom Hours:</span>
                  <span className="text-neutral-800 font-medium">10:30 AM – 9:30 PM (Open 7 Days)</span>
                </div>
              </div>

              <div className="text-xs text-neutral-600 pt-2 border-t border-neutral-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Trusted quality fragrance showroom</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/${num}?text=Hello%20${encodeURIComponent(brand)},%20I%20have%20an%20inquiry%20about%20perfumes.`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Directions</span>
              </a>
            </div>

          </div>

          {/* Embedded Dynamic Map */}
          <div className="aspect-video rounded-3xl overflow-hidden border border-neutral-200 shadow-sm relative group">
            <iframe
              title={`${brand} Map Location`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full border-0 pointer-events-none opacity-85"
              loading="lazy"
            />
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer z-10"
            >
              <div className="px-4 py-2 bg-neutral-950/95 hover:bg-black text-amber-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl border border-amber-400/50 shadow-md backdrop-blur-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>OPEN DIRECTLY IN GOOGLE MAPS</span>
              </div>
            </a>
          </div>

        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
            
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-serif text-2xl text-neutral-950 font-bold tracking-tight">
                Send a Message to Our Showroom
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Whether you need assistance choosing a perfume or want to place a custom bulk order, we are delighted to assist.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-xl text-neutral-900 font-bold">Inquiry Sent Successfully</h4>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Thank you! Our concierge will review your message and reach out via phone or WhatsApp shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', mobile: '', email: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="mt-3 px-5 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider rounded-xl font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-neutral-700 font-semibold uppercase tracking-wider block">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Kumar"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-700 font-semibold uppercase tracking-wider block">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 8795229201"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-neutral-700 font-semibold uppercase tracking-wider block">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-700 font-semibold uppercase tracking-wider block">Topic / Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-500 transition-colors font-medium cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Combo Deals">Combo / Discount Offers</option>
                      <option value="Fragrance Recommendation">Fragrance Recommendation</option>
                      <option value="Bulk / Wedding Gifting">Bulk / Wedding Gifting</option>
                      <option value="Order Tracking">Existing Order Tracking</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-semibold uppercase tracking-wider block">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what scents you enjoy, or how we can assist you..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-neutral-900 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MESSAGE</span>
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
