import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Droplets, Wind, Flame, Compass, Check, ArrowRight, X, RefreshCw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PerfumeFeatures: React.FC = () => {
  const { products, setCurrentPage, settings } = useStore();
  const [activeNoteTab, setActiveNoteTab] = useState<'top' | 'middle' | 'base'>('middle');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({ gender: 'unisex', intensity: 'intense', mood: 'royal' });

  const quizQuestions = [
    {
      title: 'Who is this perfume for?',
      key: 'gender',
      options: [
        { label: 'Masculine & Bold', value: 'Men' },
        { label: 'Feminine & Velvet Floral', value: 'Women' },
        { label: 'Universal & Pure Attar', value: 'Unisex' },
      ],
    },
    {
      title: 'What fragrance intensity do you prefer?',
      key: 'intensity',
      options: [
        { label: 'Fresh, Crisp Citrus & Spicy', value: 'fresh' },
        { label: 'Smoky, Oud & Intense Amber', value: 'intense' },
        { label: 'Soft Floral Nectar & Musk', value: 'soft' },
      ],
    },
    {
      title: 'What vibe or occasion best matches your aura?',
      key: 'mood',
      options: [
        { label: 'Evening Royal Dinners & Weddings', value: 'royal' },
        { label: 'Daily Signature Office Scent', value: 'daily' },
        { label: 'Special Intimate Nights', value: 'romantic' },
      ],
    },
  ];

  const handleQuizOption = (key: string, value: string) => {
    setQuizAnswers((prev) => ({ ...prev, [key]: value }));
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizStep(quizQuestions.length); // Results step
    }
  };

  const getRecommendedProduct = () => {
    const matchCategory = quizAnswers.gender === 'Men' ? 'Men' : quizAnswers.gender === 'Women' ? 'Women' : 'Unisex';
    const found = products.find((p) => p.category === matchCategory) || products[0];
    return found;
  };

  return (
    <div className="space-y-12 sm:space-y-24 py-8 sm:py-16">
      
      {/* 2. SAMBHAL FINDER QUIZ CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-amber-50 via-white to-amber-50/60 border border-amber-200/80 rounded-3xl p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          
          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-900 font-bold block">
              SAMBHAL CONSULTATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 tracking-wide leading-tight font-bold">
              Unsure Which Fragrance Defines You?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
              Answer 3 quick questions to discover your personalized signature scent based on your occasion and note preference.
            </p>
          </div>

          <div className="z-10 w-full md:w-auto">
            <button
              onClick={() => {
                setQuizStep(0);
                setIsQuizOpen(true);
              }}
              className="w-full md:w-auto px-8 py-4 bg-neutral-900 hover:bg-black text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>FIND MY SIGNATURE SCENT</span>
            </button>
          </div>
        </div>
      </section>

      {/* SAMBHAL QUIZ MODAL */}
      <AnimatePresence>
        {isQuizOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-3xl max-w-lg w-full relative space-y-6 shadow-2xl"
            >
              <button
                onClick={() => setIsQuizOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>

              {quizStep < quizQuestions.length ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-semibold">
                      STEP 0{quizStep + 1} OF 03
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      {settings.brandName ? `${settings.brandName} Matcher` : "AL Fragrance Matcher"}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-neutral-900">
                    {quizQuestions[quizStep].title}
                  </h3>

                  <div className="space-y-3">
                    {quizQuestions[quizStep].options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleQuizOption(quizQuestions[quizStep].key, opt.value)}
                        className="w-full text-left p-4 bg-neutral-50 hover:bg-amber-50/60 border border-neutral-200 hover:border-amber-400 rounded-xl text-xs text-neutral-800 hover:text-neutral-950 font-medium transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>{opt.label}</span>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-800 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* QUIZ RESULT */
                <div className="space-y-6 text-center">
                  <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                    <Sparkles className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                      YOUR PERFECT OLFACTORY MATCH
                    </span>
                    <h3 className="font-serif text-3xl text-neutral-900">
                      {getRecommendedProduct().name}
                    </h3>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 flex items-center gap-4 text-left">
                    <img
                      src={getRecommendedProduct().images[0]}
                      alt={getRecommendedProduct().name}
                      className="w-20 h-20 object-cover rounded-xl border border-neutral-200"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] text-amber-800 font-semibold uppercase font-mono">{getRecommendedProduct().category} • {getRecommendedProduct().volume}</span>
                      <p className="text-xs text-neutral-600 line-clamp-2">{getRecommendedProduct().description}</p>
                      <div className="font-serif font-semibold text-neutral-900 text-sm">
                        ₹{(getRecommendedProduct().salePrice || getRecommendedProduct().price).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setQuizStep(0)}
                      className="p-3 bg-neutral-100 text-neutral-600 rounded-xl hover:text-neutral-900 hover:bg-neutral-200 border border-neutral-200"
                      title="Restart Quiz"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsQuizOpen(false);
                        setCurrentPage('product-detail', { productId: getRecommendedProduct().id });
                      }}
                      className="flex-1 py-3 bg-neutral-900 hover:bg-black text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      VIEW RECOMMENDED PERFUME
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
