import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Send, CheckCircle2, Sparkles, Building2, Phone, Mail, User, MapPin } from 'lucide-react';

interface WholesaleEnquiryFormProps {
  onSuccess?: () => void;
  standalone?: boolean;
}

export const WholesaleEnquiryForm: React.FC<WholesaleEnquiryFormProps> = ({
  onSuccess,
  standalone = false,
}) => {
  const { showToast, settings } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    city: '',
    itemsInterested: 'Pure Attar & Perfumes',
    quantity: '50-100 pcs',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate or save to Firebase
      await new Promise((res) => setTimeout(res, 800));
      setIsSubmitted(true);
      showToast('Thank you! Your wholesale enquiry has been submitted. Our team will contact you shortly.');
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast('Failed to submit enquiry. Please call or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNum = settings.whatsappNumber?.replace('+', '') || '918140251978';

  return (
    <div className={`bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden ${standalone ? 'p-6 sm:p-10' : 'p-6 sm:p-8'}`}>
      <div className="space-y-3 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>B2B &amp; BULK ORDERS</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
          Wholesale &amp; Custom Gifting Enquiry
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Get direct manufacturer &amp; distributor wholesale rates on pure concentrated attars, luxury designer EDP perfumes, premium wedding gifting packs, custom corporate scent bottles, car fresheners &amp; premium islamic accessories.
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center py-10 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-xl font-bold text-neutral-900">Enquiry Received!</h4>
          <p className="text-xs text-neutral-600 max-w-sm mx-auto">
            Our wholesale manager will call you back within 2-4 hours with catalog pricing.
          </p>
          <a
            href={`https://wa.me/${whatsappNum}?text=Hello%20RB%20SAMBHALS,%20I%20just%20submitted%20a%20wholesale%20enquiry.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            <span>Chat on WhatsApp Now</span>
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>Your Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mohd Tariq"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>Shop / Business Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Al-Madina Fragrance Store"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>Mobile / WhatsApp Number *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9756223201"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>City &amp; State *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sambhal, UP"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold uppercase tracking-wider text-[10px]">
                Products Interested In
              </label>
              <select
                value={formData.itemsInterested}
                onChange={(e) => setFormData({ ...formData, itemsInterested: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="Pure Attar & Perfumes">Pure Attar &amp; Perfumes</option>
                <option value="Wedding Bridal Dupattas">Dulhan Wedding Dupattas</option>
                <option value="Printed Gift Pens & Mugs">Printed Gift Pens &amp; Mugs</option>
                <option value="Kashmiri Rumaal & Afghani Pagdi">Kashmiri Rumaal &amp; Afghani Pagdi</option>
                <option value="Complete Gift Pack Combos">Complete Gift Pack Combos</option>
                <option value="All Items / General Stock">All Items / General Stock</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold uppercase tracking-wider text-[10px]">
                Estimated Order Quantity
              </label>
              <select
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="25-50 pcs">25 - 50 pcs (Sample bulk)</option>
                <option value="50-100 pcs">50 - 100 pcs</option>
                <option value="100-500 pcs">100 - 500 pcs</option>
                <option value="500+ pcs">500+ pcs (Wholesale rate)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-700 font-semibold uppercase tracking-wider text-[10px]">
              Specific Requirements or Notes
            </label>
            <textarea
              rows={3}
              placeholder="Mention your requirements, preferred notes or custom branding requests..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-neutral-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>{isSubmitting ? 'SUBMITTING ENQUIRY...' : 'SUBMIT WHOLESALE ENQUIRY'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
