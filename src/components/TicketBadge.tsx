import React from 'react';
import { motion } from 'motion/react';
import { CountryKit, JerseyCustomization } from '../types';
import { Check, Shield, Award, Calendar, ChevronRight } from 'lucide-react';

interface TicketBadgeProps {
  country: CountryKit;
  customization: JerseyCustomization;
  fullName: string;
  entryCode: string;
  spinReward?: string;
  ticketId: string;
  hasYoutubeBoost?: boolean;
}

export const TicketBadge: React.FC<TicketBadgeProps> = ({
  country,
  customization,
  fullName,
  entryCode,
  spinReward = 'Standard Entry Ticket Approved',
  ticketId,
  hasYoutubeBoost = false
}) => {
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative max-w-md w-full bg-[#101626] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col glow-gold"
    >
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-nike/5 rounded-full blur-3xl pointer-events-none" />

      {/* Ticket Header Banner */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-navy border-b border-white/5 p-4 flex justify-between items-center relative">
        <div className="flex items-center gap-1.5">
          <ChevronRight className="w-4 h-4 text-nike animate-pulse" />
          <span className="font-bebas text-lg tracking-wider text-white">NIKE VERIFIED ENTRY PASS</span>
        </div>
        <div className="bg-gold px-2 py-0.5 rounded text-[9px] font-condensed font-extrabold text-navy tracking-widest uppercase">
          SECURE
        </div>
      </div>

      {/* Primary Pass Elements styled elegantly */}
      <div className="p-5 flex flex-col gap-4">
        {/* User identification info */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col">
            <span className="text-3xs text-gray-500 font-bold font-condensed tracking-wider uppercase">TICKET HOLDER</span>
            <span className="text-white font-bebas text-lg tracking-wide">{fullName.toUpperCase()}</span>
            <span className="text-2xs text-gray-400 font-condensed font-medium mt-0.5">Verified Online Registrant</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xs text-gray-500 font-bold font-condensed tracking-wider uppercase">SQUAD SELECTION</span>
            <span className="text-gold font-bebas text-lg flex items-center gap-1 tracking-wide">
              {country.flag} {country.name.toUpperCase()}
            </span>
            <span className="text-2xs text-gray-400 font-condensed font-medium mt-0.5">Custom Knit Specification</span>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-white/10 relative my-1">
          {/* Visual ticket punch holes on sides representing custom passes */}
          <div className="absolute -left-7 -top-2 w-4 h-4 bg-[#0a0e1a] rounded-full" />
          <div className="absolute -right-7 -top-2 w-4 h-4 bg-[#0a0e1a] rounded-full" />
        </div>

        {/* Custom Specifications of the Custom Jersey */}
        <div className="grid grid-cols-2 xs:grid-cols-4 gap-3 bg-navy/60 p-3 rounded-xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-3xs text-gray-400 font-bold font-condensed tracking-wider uppercase">NAME PRNT</span>
            <span className="text-white font-bebas text-md tracking-wider">{customization.playerName ? customization.playerName.toUpperCase() : 'NONE'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xs text-gray-400 font-bold font-condensed tracking-wider uppercase">NUMBER</span>
            <span className="text-gold font-bebas text-md tracking-wider">#{customization.playerNumber || '00'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xs text-gray-400 font-bold font-condensed tracking-wider uppercase">FIT SIZE</span>
            <span className="text-white font-bebas text-md tracking-wider">{customization.size} ({customization.gender.toUpperCase()})</span>
          </div>
          <div className="flex flex-col col-span-1">
            <span className="text-3xs text-gray-400 font-bold font-condensed tracking-wider uppercase font-black uppercase">BADGE LEVEL</span>
            <span className="text-nike font-bebas text-xs tracking-wider uppercase leading-none mt-1">{customization.badgeStyle}</span>
          </div>
        </div>

        {/* Reward Wedge won in spin wheel */}
        <div className="flex items-center gap-3 bg-gold/10 border border-gold/25 p-3 rounded-xl">
          <Award className="w-5 h-5 text-gold flex-shrink-0 animate-bounce" />
          <div className="flex flex-col">
            <span className="text-[8px] text-gold font-bold font-condensed tracking-wider uppercase">SPIN WHEEL REWARD EARNED</span>
            <span className="text-white font-semibold font-condensed text-xs uppercase tracking-wide">
              {spinReward}
            </span>
          </div>
        </div>

        {/* YouTube Booster Indicator if active */}
        {hasYoutubeBoost && (
          <div className="flex items-center gap-3 bg-red-600/10 border border-red-500/30 p-3 rounded-xl animate-pulse">
            <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center font-bold text-white text-[10px]">
              ▶
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-red-400 font-bold font-condensed tracking-wider uppercase">📺 YOUTUBE BOOST ACTIVATED</span>
              <span className="text-white font-bold font-condensed text-2xs uppercase tracking-wide">
                +3x Entry Weight Accredited via @tripurasujanbd
              </span>
            </div>
          </div>
        )}

        {/* Entry voucher details */}
        <div className="flex justify-between items-center text-xs mt-1 text-gray-400 font-condensed font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-nike" /> DRAW ONJULY 15, 2026
          </span>
          <span className="flex items-center gap-1 uppercase">
            <Shield className="w-3.5 h-3.5 text-gold" /> PRO KIT GUARANTEE
          </span>
        </div>
      </div>

      {/* Ticket Footer section with mock barcode */}
      <div className="bg-[#0b0f1b] border-t border-white/5 p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-3xs text-gray-500 font-bold font-condensed tracking-widest uppercase">REGISTRATION CODE</span>
          <span className="text-gold font-mono font-bold text-sm tracking-wider">{entryCode}</span>
          <span className="text-[8px] text-gray-400 font-condensed tracking-wide font-medium mt-0.5">SPONSORED BY @TRIPURASUJANBD</span>
        </div>

        {/* Artistic CSS-rendered barcode structure */}
        <div className="flex flex-col items-center">
          <div className="flex gap-[1.5px] items-stretch h-8 opacity-80 mt-1">
            <div className="w-[1.5px] bg-white h-full" />
            <div className="w-[3px] bg-white h-full" />
            <div className="w-[1px] bg-transparent h-full" />
            <div className="w-[1.5px] bg-white h-full" />
            <div className="w-[1px] bg-transparent h-full" />
            <div className="w-[1.5px] bg-white h-full" />
            <div className="w-[4px] bg-white h-full" />
            <div className="w-[1.5px] bg-transparent h-full" />
            <div className="w-[2px] bg-white h-full" />
            <div className="w-[1.5px] bg-white h-full" />
            <div className="w-[1px] bg-transparent h-full" />
            <div className="w-[3.5px] bg-white h-full" />
            <div className="w-[1.5px] bg-white h-full" />
            <div className="w-[2px] bg-transparent h-full" />
            <div className="w-[1.5px] bg-white h-full" />
          </div>
          <span className="text-[8px] text-gray-500 font-mono tracking-widest mt-1">
            #{ticketId.slice(0, 12).toUpperCase()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
