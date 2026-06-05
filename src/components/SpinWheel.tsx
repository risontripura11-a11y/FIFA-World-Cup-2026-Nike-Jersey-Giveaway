import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, RotateCw, Trophy, ShieldAlert, CheckCircle } from 'lucide-react';

interface SpinWheelProps {
  onSpinComplete: (prize: string, code: string) => void;
  isRegistered: boolean;
}

const PRIZES = [
  'Custom Nike Vapor Jersey Ticket (Main Draw)',
  'Official Signature Match Ball Entry',
  'Nike Vapor Flight Socks & Sleeve Pack',
  '3x VIP Golden Shield Draw Booster',
  'Sleeve Gold Champion Patch Upgrade'
];

export const SpinWheel: React.FC<SpinWheelProps> = ({ onSpinComplete, isRegistered }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [entryCode, setEntryCode] = useState('');

  const handleSpin = () => {
    if (isSpinning || hasSpun || !isRegistered) return;

    setIsSpinning(true);
    // Base 6 rotations (2160 deg) + random angle corresponding to one of the 5 segments
    const randomSegmentIndex = Math.floor(Math.random() * PRIZES.length);
    const segmentAngle = 360 / PRIZES.length;
    // Calculate final target angle to land exactly in the middle of chosen segment
    const targetAngle = 2160 + (randomSegmentIndex * segmentAngle) + (segmentAngle / 2);

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      const prize = PRIZES[randomSegmentIndex];
      const randomCode = 'WC26-NIKE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setWonPrize(prize);
      setEntryCode(randomCode);
      onSpinComplete(prize, randomCode);
    }, 4000); // 4 seconds spin duration
  };

  return (
    <div className="bg-navy-light border border-white/5 p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
      {/* Background glow and decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-nike/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center text-center max-w-sm">
        <span className="text-nike font-condensed font-bold tracking-widest text-xs flex items-center gap-1">
          <Gift className="w-3.5 h-3.5" /> LUCKY DRAW REWARD WHEEL
        </span>
        <h3 className="text-white text-2xl font-bebas tracking-wide mt-1">
          SPIN FOR AN ENTRY BOOSTER
        </h3>
        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
          Unlock your exclusive entry ticket, rare team upgrades, and official giveaway codes instantly after registering!
        </p>
      </div>

      {/* Interactive visual Wheel Container */}
      <div className="relative my-8 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Ticker Selector Arrow pointing down from absolute top */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-nike z-30 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] animate-bounce" />

        {/* Outer glowing steel ring */}
        <div className="absolute inset-0 bg-gradient-to-tr from-navy via-white/10 to-navy rounded-full p-1.5 shadow-[0_0_30px_rgba(0,0,0,0.8)] glow-gold">
          {/* Inner dark rotating wheel */}
          <div
            className="w-full h-full rounded-full bg-[#0d1326] relative overflow-hidden border border-white/10 transition-transform duration-[4000ms] "
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transitionTimingFunction: 'cubic-bezier(0.1, 0.8, 0.1, 1)'
            }}
          >
            {/* Render 5 custom colorful segments */}
            {PRIZES.map((prize, index) => {
              const startAngle = index * 72;
              const angleRotation = startAngle + 36;
              const isEven = index % 2 === 0;
              const fillHex = isEven ? '#11182c' : '#19223e';
              const textCol = isEven ? '#F5C518' : '#ffffff';
              
              return (
                <div
                  key={index}
                  className="absolute inset-0 origin-center"
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                    clipPath: 'polygon(50% 50%, 50% 0, 100% 15.5%, 100% 50%)',
                    backgroundColor: fillHex,
                  }}
                >
                  {/* Outer label for the segment */}
                  <div
                    className="absolute w-24 left-1/2 top-3 -translate-x-1/2 origin-bottom text-center pointer-events-none"
                    style={{
                      transform: `rotate(${36}deg)`,
                    }}
                  >
                    <p
                      className="font-condensed font-black text-[9px] uppercase tracking-wider leading-tight"
                      style={{ color: textCol }}
                    >
                      {prize.split(' ')[0]} {prize.split(' ')[1]}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Inner aesthetic circles and grid lines */}
            <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
          </div>
        </div>

        {/* Outer Golden hubcap button inside center */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || hasSpun || !isRegistered}
          className={`absolute w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-gold font-bebas tracking-wider z-20 transition-all duration-300 ${
            isRegistered && !hasSpun && !isSpinning
              ? 'bg-gradient-to-b from-gold2 to-gold text-navy cursor-pointer hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(245,197,24,0.4)]'
              : 'bg-navy-light text-gray-500 cursor-not-allowed border-gray-800'
          }`}
        >
          {isSpinning ? (
            <RotateCw className="w-6 h-6 animate-spin text-navy" />
          ) : (
            <>
              <span className="text-sm font-black leading-none uppercase">SPIN</span>
              <span className="text-[7px] font-condensed font-bold tracking-widest leading-none mt-0.5">NOW</span>
            </>
          )}
        </button>
      </div>

      {/* Unlock instructions and Winner alerts */}
      <div className="w-full">
        {!isRegistered ? (
          <div className="flex items-center gap-2 bg-red/10 border border-red/20 px-4 py-3 rounded-xl text-center justify-center">
            <ShieldAlert className="w-4 h-4 text-red flex-shrink-0 animate-pulse" />
            <span className="text-2xs font-condensed font-bold uppercase tracking-wider text-red">
              LOCKER LOCKED: COMPLETE REGISTRATION TO SPIN CODES
            </span>
          </div>
        ) : isSpinning ? (
          <div className="text-center py-2 animate-pulse">
            <p className="text-gold font-condensed font-bold tracking-wider text-xs">
              ⚡ COMMENCING CODES SEEDING GENERATION... HOLD ON! ⚡
            </p>
          </div>
        ) : wonPrize ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-grass/15 border border-grass/30 p-4 rounded-xl flex flex-col items-center text-center"
          >
            <div className="flex items-center gap-1.5 text-green-400 font-bold font-condensed text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" /> REWARD VERIFIED & SAVED
            </div>
            <p className="text-white font-bebas text-lg mt-1 tracking-wide">{wonPrize.toUpperCase()}</p>

            <div className="mt-3 flex items-center justify-center gap-2 bg-navy p-2 px-4 rounded-lg border border-white/5 w-full">
              <div className="flex flex-col items-start">
                <span className="text-[8px] text-gray-400 font-bold font-condensed tracking-wider">CLAIM CODE</span>
                <span className="font-mono text-xs text-gold font-bold tracking-widest">{entryCode}</span>
              </div>
              <Trophy className="w-4 h-4 text-gold" />
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-1">
            <p className="text-gray-400 font-condensed font-semibold tracking-wider text-2xs uppercase">
              Follow @tripurasujanbd on Instagram to claim extra rare multipliers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
