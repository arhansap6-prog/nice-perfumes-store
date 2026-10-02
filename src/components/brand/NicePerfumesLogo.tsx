import React from 'react';

interface NicePerfumesLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  textColor?: string;
}

export const NicePerfumesLogo: React.FC<NicePerfumesLogoProps> = ({
  className = '',
  size = 'hero',
  textColor = 'text-neutral-950',
}) => {
  const sizeClasses = {
    sm: 'max-w-[120px] sm:max-w-[150px]',
    md: 'max-w-[160px] sm:max-w-[220px]',
    lg: 'max-w-[220px] sm:max-w-[280px]',
    hero: 'max-w-[260px] xs:max-w-[300px] sm:max-w-[360px] md:max-w-[420px]',
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${sizeClasses[size]} ${className}`}>
      {/* Transparent Luxury Vector Logo for Hero Banner */}
      <svg
        viewBox="0 0 420 160"
        fill="currentColor"
        className={`w-full h-auto drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] ${textColor}`}
      >
        {/* Crown Emblem */}
        <g transform="translate(210, 20)" opacity="0.9">
          <path d="M -12 -2 L 0 -10 L 12 -2 L 8 4 L -8 4 Z" fill="currentColor" />
          <circle cx="0" cy="-12" r="2.5" fill="currentColor" />
          <circle cx="-12" cy="-4" r="1.5" fill="currentColor" />
          <circle cx="12" cy="-4" r="1.5" fill="currentColor" />
        </g>

        {/* 'N I C E' */}
        <text
          x="210"
          y="85"
          textAnchor="middle"
          fontFamily="'Cinzel', 'Playfair Display', 'Bodoni MT', 'Didot', 'Georgia', serif"
          fontSize="72"
          fontWeight="900"
          letterSpacing="12"
        >
          NICE
        </text>

        {/* Separator Lines */}
        <line x1="80" y1="106" x2="180" y2="106" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        <polygon points="210,102 214,106 210,110 206,106" fill="currentColor" opacity="0.8" />
        <line x1="240" y1="106" x2="340" y2="106" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />

        {/* 'P E R F U M E S' */}
        <text
          x="210"
          y="144"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', 'Playfair Display', 'Georgia', serif"
          fontSize="38"
          fontWeight="700"
          fontStyle="italic"
          letterSpacing="6"
        >
          Perfumes
        </text>
      </svg>
    </div>
  );
};
