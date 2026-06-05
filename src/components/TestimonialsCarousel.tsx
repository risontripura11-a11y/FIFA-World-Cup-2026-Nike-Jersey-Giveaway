import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, MessageSquare, CheckCircle2, Award } from 'lucide-react';

interface Testimonial {
  id: number;
  fullName: string;
  instagramHandle: string;
  prizeWon: string;
  avatarFlag: string;
  rating: number;
  date: string;
  comment: string;
  avatarColor: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    fullName: "Rayan Chowdhury",
    instagramHandle: "@rayan_ch",
    prizeWon: "Nike Brazil Copa America Vapor Knit",
    avatarFlag: "🇧🇷",
    rating: 5,
    date: "May 2026",
    comment: "This is 100% legit! I registered last month and won the premium yellow Brazil kit. @tripurasujanbd shipped it directly to my home with courier tracking. The Dri-FIT fabric is incredibly breathable. Thanks Growzify and Sujan!",
    avatarColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
  },
  {
    id: 2,
    fullName: "Vanessa Mcknight",
    instagramHandle: "@vanessa_mck",
    prizeWon: "Nike USA Special Away Edition",
    avatarFlag: "🇺🇸",
    rating: 5,
    date: "April 2026",
    comment: "Unbelievable luck! I correctly answered the host trivia quiz, joined the YouTube live broadcast, and got selected in slot 3! Super happy with the quality, even the official sleeve champion patch is gold and metallic. Highly recommend subscribing to @tripurasujanbd!",
    avatarColor: "bg-blue-500/20 text-blue-300 border-blue-500/40"
  },
  {
    id: 3,
    fullName: "Takahiro Sato",
    instagramHandle: "@taka_sato",
    prizeWon: "Nike Japan Samurai Custom Jersey",
    avatarFlag: "🇯🇵",
    rating: 5,
    date: "March 2026",
    comment: "I entered the lucky draw wheel after customizing my jersey and won the Vapor Socks pack + standard entry upgrade. Excellent communication from the sponsor, fully transparent draw procedure. Eagerly waiting for the 2026 Grand Giveaway!",
    avatarColor: "bg-red-500/20 text-red-300 border-red-500/40"
  },
  {
    id: 4,
    fullName: "Mateo Rodriguez",
    instagramHandle: "@mateo_rod26",
    prizeWon: "Nike Argentina Blue Gold Captain Kit",
    avatarFlag: "🇦🇷",
    rating: 5,
    date: "February 2026",
    comment: "Hands down the best giveaway on YouTube! The team customized my name SUJAN #10 on the back plate. The details, fonts, and labels are pristine. Big thumbs up to @tripurasujanbd and Growzify!",
    avatarColor: "bg-sky-500/20 text-sky-300 border-sky-500/40"
  },
  {
    id: 5,
    fullName: "Sarah Griezmann",
    instagramHandle: "@sarah_griz",
    prizeWon: "Nike France Blue Gold Edition",
    avatarFlag: "🇫🇷",
    rating: 5,
    date: "January 2026",
    comment: "I got the custom France home jersey with Retro Badge style. The gold stars shine beautifully. It fits perfectly true to size. Don't skip the Q&A live broadcast step, it really verifies you!",
    avatarColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
  }
];

export const TestimonialsCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [index]);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[index];

  // Variants for transition slide animation
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full bg-navy-light/95 border border-white/5 rounded-2xl p-4 sm:p-8 shadow-2xl overflow-hidden mt-6">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-nike/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6 relative z-10">
        <div className="text-left">
          <span className="text-[9px] sm:text-3xs font-extrabold font-condensed tracking-widest text-gold uppercase flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nike animate-pulse" /> VERIFIED WINNER TESTIMONIALS
          </span>
          <h3 className="font-bebas text-lg sm:text-2xl text-white tracking-widest uppercase mt-1">
            WHAT OUR PREVIOUS WINNERS SAY
          </h3>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handlePrev}
            type="button"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-navy/60 hover:bg-gold hover:text-navy border border-white/10 flex items-center justify-center transition duration-300 text-gray-300 cursor-pointer"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            type="button"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-navy/60 hover:bg-gold hover:text-navy border border-white/10 flex items-center justify-center transition duration-300 text-gray-300 cursor-pointer"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Panel */}
      <div className="relative min-h-[220px] xs:min-h-[180px] sm:min-h-[140px] z-10 flex flex-col justify-between">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex flex-col gap-4"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {/* User Avatar Initial circle */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center text-xs sm:text-md font-bebas shrink-0 ${current.avatarColor}`}>
                  {current.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="flex flex-col text-left min-w-0">
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                    <span className="font-bebas text-white text-xs sm:text-md tracking-wider whitespace-nowrap">{current.fullName.toUpperCase()}</span>
                    <span className="hidden xs:inline text-[9px] text-gray-500">•</span>
                    <span className="text-[9px] sm:text-3xs text-nike font-mono font-bold whitespace-nowrap">{current.instagramHandle}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 min-w-0">
                    <span className="text-[10px] sm:text-2xs text-gray-400 font-condensed font-medium shrink-0">Won:</span>
                    <span className="text-[10px] sm:text-2xs text-gold font-condensed font-bold uppercase truncate">
                      {current.avatarFlag} {current.prizeWon}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating stars & Date */}
              <div className="flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                <div className="flex items-center gap-0.5 text-gold">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-gold" />
                  ))}
                </div>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                  Delivered • {current.date}
                </span>
              </div>
            </div>

            {/* Comment Section */}
            <p className="text-gray-300 font-sans text-xs sm:text-sm italic leading-relaxed text-left border-l-2 border-nike/40 pl-3 sm:pl-4 py-0.5">
              "{current.comment}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-6 border-t border-white/5 pt-4">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                setDirection(idx > index ? 1 : -1);
                setIndex(idx);
              }}
              type="button"
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === index ? 'w-6 bg-gold' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
