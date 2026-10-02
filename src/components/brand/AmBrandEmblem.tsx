import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

interface AmBrandEmblemProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSubtitle?: boolean;
  interactive?: boolean;
}

export const AmBrandEmblem: React.FC<AmBrandEmblemProps> = ({
  className = '',
  size = 'hero',
  showSubtitle = false,
  interactive = false,
}) => {
  let settingsLogo = '';
  try {
    const { settings } = useStore();
    settingsLogo = settings.logoUrl || '';
  } catch (e) {}

  const logoSources = [
    '/nice_logo.png?v=3.0',
    '/logo.jpg',
    '/khushboo_logo.jpg',
  ];

  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const dimensionMap = {
    xs: 'w-9 h-9 sm:w-10 sm:h-10',
    sm: 'w-12 h-12 sm:w-14 sm:h-14',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36',
    xl: 'w-40 h-40 sm:w-44 sm:h-44',
    hero: 'w-32 h-32 sm:w-38 sm:h-38',
  };

  const dim = dimensionMap[size];

  const handleImageError = () => {
    if (currentSourceIndex < logoSources.length - 1) {
      setCurrentSourceIndex((prev) => prev + 1);
    } else {
      setImageFailed(true);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Clean Luxury Emblem Frame - Transparent, Zero Black Border, Zero Cropping */}
      <div
        className={`relative ${dim} flex items-center justify-center bg-transparent transition-all duration-300 ${
          interactive ? 'hover:scale-105' : ''
        }`}
      >
        {!imageFailed ? (
          <img
            src={logoSources[currentSourceIndex]}
            alt="NICE Perfumes Logo"
            className="w-full h-full object-contain filter drop-shadow-xs"
            onError={handleImageError}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-amber-900 text-amber-200 flex items-center justify-center font-serif font-black tracking-tighter text-xs sm:text-base shadow-sm">
            NP
          </div>
        )}
      </div>

      {showSubtitle && size !== 'xs' && size !== 'sm' && (
        <div className="mt-3 text-center space-y-1">
          <p className="text-[10px] font-sans tracking-[0.25em] text-neutral-800 uppercase font-semibold">
            NICE PERFUMES · PALANPUR
          </p>
          <p className="text-[9px] tracking-widest text-neutral-500 uppercase">
            6, Diamond Square, Gathaman Road, Palanpur - 385001
          </p>
        </div>
      )}
    </div>
  );
};

export const IqbalAzmiBrandTree = AmBrandEmblem;

