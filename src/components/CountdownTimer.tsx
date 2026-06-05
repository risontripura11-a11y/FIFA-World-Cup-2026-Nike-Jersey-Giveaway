import React, { useState, useEffect } from 'react';

export const CountdownTimer: React.FC = () => {
  const targetDate = new Date('2026-06-11T23:00:00Z').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days.toString().padStart(2, '0') },
    { label: 'HOURS', value: timeLeft.hours.toString().padStart(2, '0') },
    { label: 'MINUTES', value: timeLeft.minutes.toString().padStart(2, '0') },
    { label: 'SECONDS', value: timeLeft.seconds.toString().padStart(2, '0') },
  ];

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 my-4">
      {timeBlocks.map((block, index) => (
        <React.Fragment key={block.label}>
          <div className="flex flex-col items-center">
            {/* Visual Digit Window with glowing borders */}
            <div className="relative w-16 h-20 sm:w-20 sm:h-24 bg-navy-light/95 border border-white/10 rounded-xl flex items-center justify-center font-bebas text-4xl sm:text-5xl text-gold overflow-hidden glow-gold">
              {/* Subtle grid background inside digits */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:8px_8px]" />
              {/* Digit Divider line */}
              <div className="absolute top-1/2 inset-x-0 h-[1px] bg-white/5" />
              <span className="relative z-10 leading-none">{block.value}</span>
            </div>
            <span className="mt-2 text-3xs sm:text-2xs font-condensed font-bold tracking-widest text-gray-400">
              {block.label}
            </span>
          </div>

          {/* Semicolon separators between blocks */}
          {index < timeBlocks.length - 1 && (
            <div className="text-gold font-bebas text-2xl sm:text-3xl self-center pb-5 animate-pulse">
              :
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
