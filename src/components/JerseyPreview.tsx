import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CountryKit, JerseyCustomization } from '../types';

interface JerseyPreviewProps {
  country: CountryKit;
  customization: JerseyCustomization;
  className?: string;
  is3dEffect?: boolean;
  onViewModeChange?: (viewMode: 'front' | 'back') => void;
}

export const JerseyPreview: React.FC<JerseyPreviewProps> = ({
  country,
  customization,
  className = '',
  is3dEffect = true,
  onViewModeChange
}) => {
  const { viewMode, playerName, playerNumber, badgeStyle } = customization;

  // Render Gold/Silver Stars
  const renderStars = (count: number, y: number) => {
    if (count <= 0) return null;
    const size = 10;
    const spacing = 12;
    const startX = 150 - ((count - 1) * spacing) / 2;

    return (
      <g>
        {Array.from({ length: count }).map((_, i) => {
          const x = startX + i * spacing;
          return (
            <polygon
              key={i}
              points={`${x},${y - 5} ${x + 3},${y + 1} ${x + 9},${y + 1} ${x + 4},${y + 5} ${x + 6},${y + 11} ${x},${y + 7} ${x - 6},${y + 11} ${x - 4},${y + 5} ${x - 9},${y + 1} ${x - 3},${y + 1}`}
              fill="#F5C518"
              stroke="#FFE27A"
              strokeWidth="0.5"
            />
          );
        })}
      </g>
    );
  };

  // Base Jersey Outline Path (fully optimized and symmetric)
  // Inside a 300x350 canvas:
  // Center is x=150.
  const jerseyPath = `
    M 95,50 
    L 45,85 
    L 65,130 
    L 100,115 
    L 100,310 
    L 200,310 
    L 200,115 
    L 235,130 
    L 255,85 
    L 205,50 
    Q 150,75 95,50 
    Z
  `;

  // Collar inside trim
  const collarPath = `M 95,50 Q 150,75 205,50 Q 150,85 95,50 Z`;

  // Dynamic Patterns elements
  const renderSelectedPattern = () => {
    switch (country.patternType) {
      case 'stripes':
        return (
          <g opacity="0.85">
            <rect x="112" y="50" width="16" height="260" fill={country.secondaryColor} />
            <rect x="142" y="50" width="16" height="260" fill={country.secondaryColor} />
            <rect x="172" y="50" width="16" height="260" fill={country.secondaryColor} />
            <rect x="75" y="75" width="12" height="180" fill={country.secondaryColor} transform="rotate(-38 75 75)" />
            <rect x="213" y="75" width="12" height="180" fill={country.secondaryColor} transform="rotate(38 213 75)" />
          </g>
        );
      case 'halves':
        return (
          <g>
            <rect x="150" y="40" width="110" height="280" fill={country.secondaryColor} />
          </g>
        );
      case 'shoulders':
        return (
          <g>
            {/* Left sleeve overlay */}
            <path d="M 95,50 L 45,85 L 65,130 L 100,115 Z" fill={country.secondaryColor} />
            {/* Right sleeve overlay */}
            <path d="M 205,50 L 255,85 L 235,130 L 200,115 Z" fill={country.secondaryColor} />
            {/* V collar yoke */}
            <path d="M 95,50 L 150,110 L 205,50 Q 150,75 95,50 Z" fill={country.secondaryColor} opacity="0.3" />
          </g>
        );
      case 'waves':
        return (
          <g opacity="0.7">
            {/* Wave paths across torso */}
            <path d="M 90,130 Q 120,110 150,130 T 210,130 L 210,160 Q 180,140 150,160 T 90,160 Z" fill={country.secondaryColor} />
            <path d="M 90,190 Q 120,170 150,190 T 210,190 L 210,220 Q 180,200 150,220 T 90,220 Z" fill={country.secondaryColor} />
            <path d="M 90,250 Q 120,230 150,250 T 210,250 L 210,280 Q 180,260 150,280 T 90,280 Z" fill={country.secondaryColor} />
          </g>
        );
      default:
        return null;
    }
  };

  // Badge Shield Graphic
  const renderBadge = (x: number, y: number) => {
    const isGold = badgeStyle === 'Gold Edition';
    const isRetro = badgeStyle === 'Retro';

    const bgBadge = isGold ? 'url(#goldGradient)' : isRetro ? '#FFFFFF' : country.secondaryColor;
    const strokeBadge = isGold ? '#D4AF37' : isRetro ? country.primaryColor : country.accentColor;
    const strokeW = isGold ? 2.5 : 1.5;

    return (
      <g>
        {/* Stars above badge */}
        {renderStars(country.stars, y - 10)}

        {isRetro ? (
          // Retro Circle style badge
          <circle cx={x} cy={y} r="15" fill={bgBadge} stroke={strokeBadge} strokeWidth={strokeW} className="drop-shadow-sm" />
        ) : (
          // Shield badge
          <path
            d={`M ${x - 12},${y - 12} L ${x + 12},${y - 12} L ${x + 12},${y + 4} Q ${x},${y + 16} ${x - 12},${y + 4} Z`}
            fill={bgBadge}
            stroke={strokeBadge}
            strokeWidth={strokeW}
            className="drop-shadow-sm"
          />
        )}

        {/* Emoji Flag in small center */}
        <text x={x} y={y + 4} fontSize="11" textAnchor="middle" style={{ userSelect: 'none' }}>
          {country.flag}
        </text>

        {/* Outer shiny border if Gold */}
        {isGold && (
          <path
            d={`M ${x - 14},${y - 14} L ${x + 14},${y - 14} L ${x + 14},${y + 5} Q ${x},${y + 19} ${x - 14},${y + 5} Z`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.75"
            opacity="0.8"
          />
        )}
      </g>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* 3D shadow depth underneath */}
      {is3dEffect && (
        <div className="absolute inset-x-8 -bottom-3 h-6 bg-black/40 rounded-full blur-xl transform scale-y-50" />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ rotateY: viewMode === 'front' ? -90 : 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: viewMode === 'front' ? 90 : -90, opacity: 0 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          className="w-full h-full transform-gpu"
          style={{ perspective: 1000 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 350"
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
          >
            <defs>
              {/* Premium Gold Gradient */}
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF099" />
                <stop offset="50%" stopColor="#F5C518" />
                <stop offset="100%" stopColor="#9E7800" />
              </linearGradient>

              {/* Shading Radial Overlay for 3D Volumetric Reality */}
              <radialGradient id="meshShade" cx="50%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
                <stop offset="60%" stopColor="#000000" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
              </radialGradient>

              {/* High-fidelity athletic knit fabric mesh pattern */}
              <pattern id="knitPattern" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="2" height="2" fill="#FFFFFF" opacity="0.04" />
                <rect x="2" y="2" width="2" height="2" fill="#FFFFFF" opacity="0.07" />
              </pattern>

              {/* Clip mask utilizing exact jersey silhouette */}
              <clipPath id="jerseyClip">
                <path d={jerseyPath} />
              </clipPath>
            </defs>

            {/* Ambient Shadow glow border */}
            <path
              d={jerseyPath}
              fill="none"
              stroke="#000000"
              strokeWidth="5"
              strokeLinejoin="round"
              opacity="0.12"
              transform="translate(0, 3)"
            />

            {/* Master Clipped Jersey Container */}
            <g clipPath="url(#jerseyClip)">
              {/* 1. Base Fabric Color fill */}
              <rect x="0" y="0" width="300" height="350" fill={country.primaryColor} />

              {/* 2. Style Pattern Overlay */}
              {renderSelectedPattern()}

              {/* 3. Collar Lining (with customizable accent color) */}
              <path d={collarPath} fill={country.accentColor} opacity="0.75" />
              {/* Thin inner neck strip */}
              <path d="M 115,58 Q 150,78 185,58" fill="none" stroke={country.primaryColor} strokeWidth="1.5" />

              {/* 4. Fabric Knit Overlay to provide pristine realism */}
              <rect x="0" y="0" width="300" height="350" fill="url(#knitPattern)" />

              {/* 5. Left/Right Sleeve cuff highlights */}
              <path d="M 45,85 L 65,130" stroke={country.accentColor} strokeWidth="4" />
              <path d="M 255,85 L 235,130" stroke={country.accentColor} strokeWidth="4" />

              {/* FRONT VIEW ELEMENTS */}
              {viewMode === 'front' && (
                <g>
                  {/* National Crest Badge (Left Chest) */}
                  {renderBadge(118, 115)}

                  {/* Nike Swoosh Logo (Right Chest) */}
                  <g transform="translate(170, 105) scale(0.4)" fill={customization.badgeStyle === 'Gold Edition' ? 'url(#goldGradient)' : country.textColor} opacity="0.95">
                    <path d="M 32,8 Q 50,2 62,-2 Q 52,14 36,25 Q 24,32 12,30 Q 8,29 11,24 Q 13,20 20,16 Q 26,11 32,8 Z" />
                  </g>

                  {/* Authentic 2026 tag badge on lower left hem */}
                  <rect x="108" y="285" width="22" height="15" rx="1.5" fill="#111" stroke="#333" strokeWidth="0.5" />
                  <text x="119" y="291" fontSize="5" fill="#888" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">NIKE</text>
                  <text x="119" y="297" fontSize="5" fill="#6dff8a" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">2026</text>

                  {/* Custom Player Squad Number (Centered Tiny Front Chest Style) */}
                  {playerNumber && (
                    <text
                      x="150"
                      y="175"
                      fontFamily="'Barlow Condensed', sans-serif"
                      fontWeight="800"
                      fontSize="52"
                      fill={country.numberColor}
                      textAnchor="middle"
                      style={{ letterSpacing: '1px', userSelect: 'none' }}
                      className="drop-shadow-sm font-black"
                    >
                      {playerNumber}
                    </text>
                  )}
                </g>
              )}

              {/* BACK VIEW ELEMENTS */}
              {viewMode === 'back' && (
                <g>
                  {/* Subtle national flag/accent detail on outer neck nape */}
                  <rect x="144" y="80" width="12" height="8" rx="1" fill={country.accentColor} stroke="#fff" strokeWidth="0.75" />

                  {/* Player Customize Name (Arched perfectly across back plate) */}
                  {playerName && (
                    <text
                      x="150"
                      y="114"
                      fontFamily="'Barlow Condensed', sans-serif"
                      fontWeight="800"
                      fontSize="20"
                      fill={country.textColor}
                      textAnchor="middle"
                      style={{ letterSpacing: '2.5px', textTransform: 'uppercase', userSelect: 'none' }}
                      className="tracking-widest font-black"
                    >
                      {playerName.slice(0, 12).toUpperCase()}
                    </text>
                  )}

                  {/* Player Custom Number (Massive Centerpiece Back Plate) */}
                  {playerNumber && (
                    <text
                      x="150"
                      y="218"
                      fontFamily="'Barlow Condensed', sans-serif"
                      fontWeight="900"
                      fontSize="96"
                      fill={country.numberColor}
                      textAnchor="middle"
                      style={{ letterSpacing: '2px', userSelect: 'none' }}
                      className="drop-shadow-md font-black"
                    >
                      {playerNumber}
                    </text>
                  )}

                  {/* Authentic Golden Nike Dri-FIT ADV Printing on Hem bottom */}
                  <text
                    x="150"
                    y="298"
                    fontFamily="'Barlow Condensed', sans-serif"
                    fontWeight="600"
                    fontSize="10"
                    fill={country.accentColor}
                    opacity="0.35"
                    textAnchor="middle"
                    style={{ letterSpacing: '3px', userSelect: 'none' }}
                  >
                    DRI-FIT ADV
                  </text>
                </g>
              )}

              {/* 6. Dynamic volumetric shading gradient overlay */}
              <rect x="0" y="0" width="300" height="350" fill="url(#meshShade)" pointerEvents="none" />
            </g>

            {/* Distinctive Stitching and realistic outer seam lines */}
            <path
              d="M 100,115 L 100,310 M 200,115 L 200,310"
              stroke="#000000"
              strokeWidth="0.75"
              strokeDasharray="2,3"
              opacity="0.22"
            />
          </svg>
        </motion.div>
      </AnimatePresence>

      {/* Quick Toggle View Mode floating pills */}
      <div className="absolute -top-3 right-4 flex items-center gap-1 bg-navy/95 border border-white/10 p-0.5 rounded-full shadow-lg z-20">
        <button
          onClick={() => onViewModeChange?.('front')}
          type="button"
          className={`px-3 py-1 text-2xs font-condensed font-bold tracking-wider rounded-full transition-all duration-300 ${
            viewMode === 'front'
              ? 'bg-nike text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          FRONT
        </button>
        <button
          onClick={() => onViewModeChange?.('back')}
          type="button"
          className={`px-3 py-1 text-2xs font-condensed font-bold tracking-wider rounded-full transition-all duration-300 ${
            viewMode === 'back'
              ? 'bg-nike text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          BACK
        </button>
      </div>

      {/* Flag icon pill floating label */}
      <div className="absolute -bottom-3 left-4 flex items-center gap-1.5 bg-navy/95 border border-white/10 px-3 py-1 rounded-full shadow-lg z-20">
        <span className="text-sm">{country.flag}</span>
        <span className="text-2xs font-condensed font-bold tracking-widest text-gold">{country.name.toUpperCase()}</span>
      </div>
    </div>
  );
};
