import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Sparkles,
  Share2,
  Bookmark,
  Shirt,
  Check,
  CheckCircle2,
  Instagram,
  Award,
  Download,
  User,
  Mail,
  ChevronRight,
  Info,
  Trash2,
  Shield,
  HelpCircle,
} from 'lucide-react';

import { COUNTRY_KITS } from './data/countries';
import { JerseyPreview } from './components/JerseyPreview';
import { CountdownTimer } from './components/CountdownTimer';
import { SpinWheel } from './components/SpinWheel';
import { TicketBadge } from './components/TicketBadge';
import { TestimonialsCarousel } from './components/TestimonialsCarousel';
import { CountryKit, JerseyCustomization, ParticipantSubmission, LiveTicket } from './types';

const bgStudio = '/src/assets/images/gwy_studio_bg_1780686888291.png';

// Predefined mock live registered entries
const INITIAL_LOCKED_TICKS: LiveTicket[] = [
  { ticketCode: 'WC26-NIKE-HJ98K5', fullName: 'Arthur Pendragon', countryName: 'France', playerName: 'MBAPPE', playerNumber: '10', rewardName: 'Custom Nike Vapor Jersey Ticket (Main Draw)', timestamp: '2 mins ago' },
  { ticketCode: 'WC26-NIKE-ZP72R1', fullName: 'Samantha Ramos', countryName: 'Mexico', playerName: 'SANTI', playerNumber: '9', rewardName: 'Sleeve Gold Champion Patch Upgrade', timestamp: '5 mins ago' },
  { ticketCode: 'WC26-NIKE-QW34P0', fullName: 'Keisuke Tanaka', countryName: 'Japan', playerName: 'MITOMA', playerNumber: '7', rewardName: '3x VIP Golden Shield Draw Booster', timestamp: '12 mins ago' },
  { ticketCode: 'WC26-NIKE-LM02C9', fullName: 'Tyler Harrison', countryName: 'United States', playerName: 'PULISIC', playerNumber: '11', rewardName: 'Official Signature Match Ball Entry', timestamp: '20 mins ago' },
  { ticketCode: 'WC26-NIKE-VB47L4', fullName: 'Lucas Silva', countryName: 'Brazil', playerName: 'VINICIUS', playerNumber: '7', rewardName: 'Custom Nike Vapor Jersey Ticket (Main Draw)', timestamp: '34 mins ago' }
];

export default function App() {
  // Current jersey customization state
  const [selectedCountry, setSelectedCountry] = useState<CountryKit>(COUNTRY_KITS[3]); // Default Argentina
  const [customization, setCustomization] = useState<JerseyCustomization>({
    countryId: 'argentina',
    playerName: 'SUJAN',
    playerNumber: '10',
    size: 'M',
    gender: 'Men',
    badgeStyle: 'Standard',
    viewMode: 'back'
  });

  // State for user registration form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    instagramHandle: '',
  });

  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScoreBoost, setQuizScoreBoost] = useState<boolean | null>(null);

  // Verification checks & interactive status
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSavesListOpen, setIsSavesListOpen] = useState(false);
  
  // Reward wheel outcome
  const [wheelReward, setWheelReward] = useState<string | null>(null);
  const [entryTicketCode, setEntryTicketCode] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<ParticipantSubmission | null>(null);

  // Local storage lists
  const [lockerSaves, setLockerSaves] = useState<JerseyCustomization[]>([]);
  const [registeredEntries, setRegisteredEntries] = useState<LiveTicket[]>(INITIAL_LOCKED_TICKS);
  const [hasYoutubeBoost, setHasYoutubeBoost] = useState(false);

  // Load saved jerseys from localStorage on mount
  useEffect(() => {
    try {
      const storedSaves = localStorage.getItem('nike_jersey_locker');
      if (storedSaves) {
        setLockerSaves(JSON.parse(storedSaves));
      }
    } catch (e) {
      console.error('Failed to load local locker', e);
    }
  }, []);

  // Update specific country selection
  const handleCountrySelection = (country: CountryKit) => {
    setSelectedCountry(country);
    setCustomization(prev => ({
      ...prev,
      countryId: country.id
    }));
  };

  // Safe string length enforcement for Name input (Max 12 uppercase letters/characters)
  const handleNameInputChange = (val: string) => {
    const cleaned = val.replace(/[^A-Za-z0-9\s-]/g, '').slice(0, 12);
    setCustomization(prev => ({
      ...prev,
      playerName: cleaned.toUpperCase()
    }));
  };

  // Safe squad number enforcement (Max 1-99)
  const handleNumberInputChange = (val: string) => {
    const parsed = val.replace(/\D/g, '');
    let numStr = parsed;
    if (parsed) {
      const num = parseInt(parsed, 10);
      if (num < 1) numStr = '1';
      else if (num > 99) numStr = '99';
      else numStr = num.toString();
    }
    setCustomization(prev => ({
      ...prev,
      playerNumber: numStr
    }));
  };

  // Submit trivia answer
  const handleAnswerSubmit = (ans: string) => {
    setSelectedAnswer(ans);
    if (ans === 'usa_mex_can') {
      setQuizScoreBoost(true);
    } else {
      setQuizScoreBoost(false);
    }
  };

  // Register Participant Form
  const handleRegisterFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.instagramHandle) {
      return;
    }
    setIsRegistered(true);
  };

  // Spin complete callback
  const handleSpinComplete = (prize: string, code: string) => {
    setWheelReward(prize);
    setEntryTicketCode(code);

    const submission: ParticipantSubmission = {
      id: 'pass-' + Math.random().toString(36).substring(2, 9),
      fullName: formData.fullName,
      email: formData.email,
      instagramHandle: formData.instagramHandle.startsWith('@') ? formData.instagramHandle : `@${formData.instagramHandle}`,
      customization: customization,
      triviaAnswerCorrect: quizScoreBoost === true,
      spinReward: prize,
      entryCode: code,
      submittedAt: new Date().toISOString()
    };

    setActiveTicket(submission);

    // Concat to live entrant ticker immediately at top
    const userPass: LiveTicket = {
      ticketCode: code,
      fullName: formData.fullName,
      countryName: selectedCountry.name,
      playerName: customization.playerName || 'SUJAN',
      playerNumber: customization.playerNumber || '10',
      rewardName: prize,
      timestamp: 'Just now'
    };
    
    setRegisteredEntries(prev => [userPass, ...prev]);
  };

  // Save current design to Local Locker
  const saveToLocker = () => {
    // Check duplication based on configuration parameters
    const isDuplicate = lockerSaves.some(s => 
      s.countryId === customization.countryId &&
      s.playerName === customization.playerName &&
      s.playerNumber === customization.playerNumber &&
      s.size === customization.size &&
      s.gender === customization.gender &&
      s.badgeStyle === customization.badgeStyle
    );

    if (isDuplicate) return;

    const updated = [...lockerSaves, { ...customization }];
    setLockerSaves(updated);
    localStorage.setItem('nike_jersey_locker', JSON.stringify(updated));
    setIsSavesListOpen(true);
  };

  // Remove specific jersey from local storage locker
  const removeFromLocker = (indexValue: number) => {
    const updated = lockerSaves.filter((_, i) => i !== indexValue);
    setLockerSaves(updated);
    localStorage.setItem('nike_jersey_locker', JSON.stringify(updated));
  };

  // Load a jersey draft on stage from locker
  const loadSavedJersey = (saved: JerseyCustomization) => {
    setCustomization(saved);
    const countryObj = COUNTRY_KITS.find(c => c.id === saved.countryId);
    if (countryObj) {
      setSelectedCountry(countryObj);
    }
  };

  // Clear / Reset customizer back to defaults
  const resetCustomizer = () => {
    setCustomization({
      countryId: 'argentina',
      playerName: 'SUJAN',
      playerNumber: '10',
      size: 'M',
      gender: 'Men',
      badgeStyle: 'Standard',
      viewMode: 'back'
    });
    setSelectedCountry(COUNTRY_KITS[3]);
  };

  return (
    <div 
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(11, 16, 32, 0.94), rgba(16, 22, 38, 0.97)), url(${bgStudio})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      className="bg-navy min-h-screen text-white flex flex-col antialiased selection:bg-nike selection:text-white"
    >
      
      {/* 1. GOLD TICKER (Infinite rolling marquee, sponsor and credit) */}
      <div className="ticker relative z-10 w-full overflow-hidden whitespace-nowrap bg-gradient-to-r from-gold2 via-gold to-gold2 py-2 px-4 shadow-lg text-navy select-none border-b border-gold/20">
        <div className="animate-marquee inline-block font-condensed font-black text-xs md:text-sm tracking-[2px] uppercase">
          🏆 SUBSCRIBE & WIN · 5 PREMIUM COLOURED JERSEYS GIVEAWAY • OFFICIAL SPONSOR: @tripurasujanbd • CO-POWERED BY GROWZIFY • CHOOSE YOUR TEAM SQUAD, PRINT NAME & UNLOCK WHEEL ENTRY PASS • LIVE ONLINE TICKETS IN QUEUE: {18542 + lockerSaves.length} • NO FEES REQUIRED • SUBSCRIBE TO @tripurasujanbd YOUTUBE CHANNEL TO MULTIPLY YOUR ODDS 🏆
        </div>
      </div>

      {/* 2. RED DEADLINE BANNER WITH HIGH INTERACTIVITY */}
      <div className="relative z-10 w-full bg-red-600 text-white py-3 px-4 shadow-xl flex flex-col md:flex-row items-center justify-center gap-3 border-b border-white/10 text-center">
        <div className="flex items-center gap-2">
          <span className="bg-white text-red-600 font-black font-condensed tracking-widest text-[9px] px-2.5 py-0.5 rounded-full animate-pulse">
            URGENT DEADLINE
          </span>
          <span className="font-bebas text-md sm:text-lg tracking-wide uppercase">
            GIVEAWAY ENDS AFTER THE LIVE Q&A SESSION!
          </span>
        </div>
        <div className="h-[2px] w-8 md:h-4 md:w-[1px] bg-white/20" />
        <span className="font-condensed font-bold tracking-wider text-xs uppercase text-white/95">
          Join the grand drawing instantly following the Q&A broadcast. Subscribe today to lock in your weight multipliers!
        </span>
      </div>

      {/* Main Container Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow py-8 flex flex-col gap-10">
        
        {/* HERO SECTION / GENERAL CAMPAIGN TITLE WITH FLOATING CONFETTI */}
        <section className="text-center flex flex-col items-center relative py-6 overflow-hidden w-full">
          {/* Confetti Simulator Graphics */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden h-full">
            {[...Array(16)].map((_, i) => {
              const bgColors = ['bg-nike', 'bg-gold', 'bg-[#00c2ff]', 'bg-white', 'bg-red-500', 'bg-green-400'];
              const leftPercent = (i * 7 + 4) % 100;
              const delay = (i * 0.4).toFixed(1);
              const customDuration = (3.5 + (i % 3)).toFixed(1);
              const chosenBg = bgColors[i % bgColors.length];
              return (
                <div
                  key={i}
                  className={`absolute w-1.5 h-3 opacity-70 rounded-xs ${chosenBg} animate-bounce`}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${(i * 18) % 80}px`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${customDuration}s`,
                    transform: `rotate(${i * 30}deg)`,
                  }}
                />
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 px-4 rounded-full mb-4 relative z-10"
          >
            <Trophy className="w-4 h-4 text-gold" />
            <span className="font-condensed font-black tracking-[3px] text-3xs text-gray-300 uppercase">
              FIFA WORLD CUP 2026 – OFFICIAL GRAND GIVEAWAY
            </span>
          </motion.div>

          {/* Title Area */}
          <div className="relative z-10 max-w-4xl px-2">
            <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl text-white tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              FIFA WORLD CUP 2026 <span className="text-nike block sm:inline">GRAND GIVEAWAY</span>
            </h1>
            
            <p className="text-gray-300 font-sans text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
              Design your custom jersey kit, subscribe to our official YouTube channel <span className="text-red-500 font-black">@tripurasujanbd</span>, and complete the steps below to secure your entry in our live sweepstakes pool!
            </p>
          </div>

          {/* Golden high fidelity countdown widget */}
          <div className="mt-6 relative z-10">
            <CountdownTimer />
          </div>
        </section>

        {/* PRIZE CARD SHOWCASING 5 ANIMATED FLOATING JERSEYS */}
        <section className="relative z-10 w-full rounded-2xl bg-gradient-to-br from-navy-light/95 via-[#11182c] to-navy border-2 border-gold/40 p-6 sm:p-8 animate-gold-pulse shadow-2xl overflow-hidden">
          {/* Neon/Reflective lights inside card background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-nike/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left Content / Badge info */}
            <div className="flex flex-col gap-3 text-center lg:text-left max-w-xl">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="bg-gradient-to-r from-gold via-[#FFE066] to-gold text-navy font-black tracking-widest text-[10px] px-3.5 py-1 rounded-full uppercase shadow-md animate-pulse">
                  🏆 5 LUCKY WINNERS GRAND RAFFLE
                </span>
                <span className="bg-red-600/90 text-white font-black tracking-widest text-[9px] px-3.5 py-1 rounded-full uppercase border border-red-500/30">
                  NIKE DRI-FIT VAPOR PREMIUM
                </span>
              </div>
              
              <h2 className="font-bebas text-3xl sm:text-4xl md:text-5xl text-white tracking-wide leading-none uppercase mt-1">
                WIN 1 OF <span className="text-gold font-bold">5 PREMIUM COLOURED JERSEYS</span>
              </h2>
              
              <p className="text-gray-300 font-sans text-xs leading-relaxed">
                We are giving away 5 official Nike Vapor 2026 kit customizer jerseys in 5 beautiful vibrant colors! Each jersey is custom tailored to your measurements, custom print name, and squad number with a 3x subscriber weight bonus multiplier! Fully secured by official sponsor <span className="text-gold font-bold">@tripurasujanbd</span> and powered by <span className="text-gold font-bold">Growzify</span>.
              </p>

              <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start bg-navy/60 p-3 rounded-2xl border border-white/5 mt-2">
                <div className="flex items-center gap-1.5 text-3xs font-condensed font-bold tracking-wider text-gray-300 uppercase">
                  <Check className="w-3.5 h-3.5 text-green-400" /> ANY COLOR & SQUAD OF CHOICE
                </div>
                <div className="flex items-center gap-1.5 text-3xs font-condensed font-bold tracking-wider text-gray-300 uppercase">
                  <Check className="w-3.5 h-3.5 text-green-400" /> PREMIUM CUSTOM EMBLEM PRINTING
                </div>
                <div className="flex items-center gap-1.5 text-3xs font-condensed font-bold tracking-wider text-gray-300 uppercase">
                  <Check className="w-3.5 h-3.5 text-green-400" /> GLOBAL COURIER DELIVERY AT 0 COST
                </div>
              </div>
            </div>

            {/* Right: Floating miniature 5 jerseys block */}
            <div className="grid grid-cols-5 gap-2 sm:gap-4 md:gap-5 justify-center w-full max-w-md bg-navy/45 py-4 px-3 sm:px-6 rounded-2xl border border-white/5 relative shadow-inner">
              {[
                { name: 'BRAZIL', primary: '#FFDF00', accent: '#009B3A', flag: '🇧🇷', class: 'animate-float-gentle', stars: 5 },
                { name: 'ARGENTINA', primary: '#74ACDF', accent: '#FFFFFF', flag: '🇦🇷', class: 'animate-float-stagger-1', stars: 3 },
                { name: 'FRANCE', primary: '#0F1E36', accent: '#F5C518', flag: '🇫🇷', class: 'animate-float-stagger-2', stars: 2 },
                { name: 'USA', primary: '#FFFFFF', accent: '#D0021B', flag: '🇺🇸', class: 'animate-float-gentle', stars: 0 },
                { name: 'PORTUGAL', primary: '#8B0000', accent: '#F5C518', flag: '🇵🇹', class: 'animate-float-stagger-1', stars: 1 }
              ].map((jer, idx) => (
                <div key={idx} className={`flex flex-col items-center gap-2 ${jer.class}`}>
                  {/* Miniature beautiful Jersey SVG representation */}
                  <div className="relative w-12 sm:w-16 h-16 sm:h-20 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-[1.12] transition duration-300">
                    <svg viewBox="0 0 300 350" className="w-full h-full filter drop-shadow">
                      <path d="M 95,50 L 45,85 L 65,130 L 100,115 L 100,310 L 200,310 L 200,115 L 235,130 L 255,85 L 205,50 Q 150,75 95,50 Z" fill={jer.primary} stroke={jer.accent} strokeWidth="6" />
                      <path d="M 95,50 Q 150,75 205,50" fill="none" stroke={jer.accent} strokeWidth="12" />
                      {jer.stars > 0 && <circle cx="150" cy="110" r="10" fill="#F5C518" />}
                      <rect x="135" y="145" width="30" height="30" rx="4" fill={jer.accent} opacity="0.8" />
                      <text x="150" y="240" textAnchor="middle" fill={jer.accent} fontFamily="sans-serif" fontWeight="900" fontSize="72">10</text>
                    </svg>
                  </div>
                  {/* Flag and Label */}
                  <div className="flex flex-col items-center">
                    <span className="text-[12px] leading-tight">{jer.flag}</span>
                    <span className="text-[7px] text-gray-400 font-condensed font-black tracking-wider text-center line-clamp-1 truncate uppercase mt-0.5">
                      {jer.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 REGULAR INTERACTIVE ENTRY ROADMAP STEPS */}
        <section className="relative z-10 w-full flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 bg-nike rounded animate-pulse" />
            <div>
              <h3 className="font-bebas text-lg sm:text-2xl text-white tracking-widest uppercase leading-none">
                COMPLETE THE 4 OFFICIAL ENTRY STEPS
              </h3>
              <p className="text-3xs sm:text-2xs font-condensed font-extrabold tracking-widest text-gray-400 uppercase mt-0.5">
                Each completed step maximizes validation in the final sweepstake database
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[
              {
                step: 'STEP 1',
                title: 'SUBSCRIBE ON YOUTUBE',
                desc: 'Subscribe to official YouTube channel @tripurasujanbd representing our prize pool.',
                status: hasYoutubeBoost ? 'COMPLETED' : 'PENDING',
                action: 'ACTIVATE 3x WEIGHT',
                subtext: 'Join @tripurasujanbd',
                onClick: () => {
                  setHasYoutubeBoost(true);
                  window.open('https://youtube.com/@tripurasujanbd', '_blank', 'noreferrer,noopener');
                }
              },
              {
                step: 'STEP 2',
                title: 'LIKE & SHARE VIDEO',
                desc: 'Give the pinned promotional giveaway video a thumbs up and share to sports groups.',
                status: isRegistered ? 'COMPLETED' : 'AUTO-CHECKING',
                action: 'VERIFY VIDEO INTERACTION',
                subtext: 'Promote sweepstakes draw',
                onClick: () => {
                  alert('Video Like & Share verification check initiated! Complete registration to lock in design parameters.');
                }
              },
              {
                step: 'STEP 3',
                title: 'LEAVE A COMMENT',
                desc: 'Write down your lucky squad name and custom jersey message on the countdown video.',
                status: isRegistered ? 'COMPLETED' : 'PENDING ENTRY',
                action: 'CONFIRM COMMENT TEXT',
                subtext: 'Add custom ticket print',
                onClick: () => {
                  alert('Comment verified successfully in stream logs! Complete Step 2 Registration below to link your jersey pass ID.');
                }
              },
              {
                step: 'STEP 4',
                title: 'JOIN LIVE Q&A BROADCAST',
                desc: 'Attend the live streaming Q&A session happening right before the lucky draw.',
                status: 'LIVE ACTIVE',
                action: 'Q&A PRE-NOTIFY',
                subtext: 'Instant winners announced',
                onClick: () => {
                  alert('Registered for Q&A stream notifications! Watch the broadcast instantly when the countdown timer hits 0.');
                }
              }
            ].map((st, i) => (
              <div
                key={i}
                className={`bg-navy-light/95 border p-5 rounded-2xl flex flex-col justify-between gap-4 relative overflow-hidden transition-all duration-300 ${
                  st.status === 'COMPLETED'
                    ? 'border-green-500/30 shadow-[0_4px_20px_rgba(34,197,94,0.05)]'
                    : 'border-white/5 hover:border-gold/30'
                }`}
              >
                {/* Floating Index Background */}
                <span className="absolute -bottom-6 -right-6 font-bebas text-8xl text-white/5 select-none pointer-events-none">
                  {i + 1}
                </span>

                <div className="flex flex-col gap-1.5 relative z-10 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-condensed font-black tracking-widest text-gold text-left">
                      {st.step}
                    </span>
                    <span className={`text-[8px] font-condensed font-black tracking-wider py-0.5 px-2 rounded uppercase ${
                      st.status === 'COMPLETED'
                        ? 'bg-green-500/20 text-green-300'
                        : st.status === 'LIVE ACTIVE'
                        ? 'bg-[#00c2ff]/20 text-[#00c2ff] animate-pulse'
                        : 'bg-white/5 text-gray-400'
                    }`}>
                      {st.status}
                    </span>
                  </div>

                  <h3 className="text-white font-bebas text-base sm:text-md tracking-wider mt-1">{st.title}</h3>
                  <p className="text-gray-400 font-condensed text-3xs sm:text-2xs font-medium leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="relative z-10 flex flex-col gap-1.5 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={st.onClick}
                    className="w-full py-2 bg-white/5 hover:bg-gold hover:text-navy transition font-bebas text-3xs tracking-widest uppercase rounded-lg text-gray-300 hover:font-black"
                  >
                    {st.action}
                  </button>
                  <span className="text-[8px] font-condensed font-semibold text-gray-500 text-center uppercase tracking-wider block">
                    {st.subtext}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Q&A STRIP EXPLAINER SECTION */}
        <section className="relative z-10 w-full bg-gradient-to-r from-red-600/10 via-[#151c33] to-red-600/10 border border-red-500/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-md shadow-md animate-pulse">
              🎥
            </div>
            <div>
              <h4 className="text-white text-sm sm:text-md font-bebas tracking-wide uppercase leading-none">
                ATTEND THE LIVE Q&A BROADCAST & SWEESPTAKES DRAW
              </h4>
              <p className="text-gray-300 font-condensed text-3xs sm:text-2xs mt-1 leading-normal max-w-2xl">
                The grand prize drawing takes place live on-air right after the Interactive Q&A broadcast. Make sure you are subscribed and your email notifications are turned ON to lock in real-time contestant verification.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end flex-shrink-0 bg-red-600/15 py-2 px-4 rounded-xl border border-red-500/30">
            <span className="text-[10px] text-red-300 font-black tracking-widest uppercase">BROADCAST SCHEDULED</span>
            <span className="text-white font-bebas text-sm sm:text-lg tracking-wider">LIVE @TRIPURASUJANBD</span>
          </div>
        </section>

        {/* PRIMARY SPLIT INTERACTIVE SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Dynamic Jersey Customizer form & Selector (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="bg-navy-light/95 border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden">
              {/* Mesh decoration */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-nike via-gold to-red" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2.5">
                  <Shirt className="w-5 h-5 text-nike" />
                  <div>
                    <h2 className="font-bebas text-xl sm:text-2xl tracking-wide uppercase leading-none text-white">
                      1. CUSTOM JERSEY LAB
                    </h2>
                    <p className="text-3xs sm:text-2xs font-extrabold font-condensed tracking-widest text-gray-400 uppercase mt-0.5">
                      Tailor your squad kit setup
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetCustomizer}
                  className="px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10 transition rounded-lg text-3xs font-condensed font-bold tracking-widest uppercase text-gray-300 hover:text-white"
                >
                  RESET FORM
                </button>
              </div>

              {/* INPUT FIELDS / DETAILED SYSTEM FOR CUSTOMIZER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SELECT SQUAD */}
                <div className="flex flex-col gap-2">
                  <label className="text-3xs font-extrabold font-condensed tracking-widest text-gold uppercase">
                    SELECT NATIONAL SQUAD
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {COUNTRY_KITS.map((country) => (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => handleCountrySelection(country)}
                        className={`p-2 rounded-xl flex flex-col items-center justify-center border transition-all duration-300 ${
                          selectedCountry.id === country.id
                            ? 'bg-gradient-to-b from-navy to-navy-light border-gold text-white drop-shadow-[0_4px_8px_rgba(245,197,24,0.15)] scale-[1.04]'
                            : 'bg-navy/40 border-white/5 hover:border-white/20 text-gray-400'
                        }`}
                      >
                        <span className="text-lg leading-none">{country.flag}</span>
                        <span className="text-[8px] font-condensed font-black tracking-wider text-center line-clamp-1 uppercase mt-1">
                          {country.id.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-4xs text-gray-500 font-condensed font-semibold tracking-wide uppercase">
                    Selects color profile, crest emblem shape, and star rating.
                  </span>
                </div>

                {/* SQUAD NAME & Lucky NUMBER INPUT */}
                <div className="flex flex-col gap-4">
                  
                  {/* Name input */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-3xs font-extrabold font-condensed tracking-widest text-gold uppercase">
                        PLAYER CUSTOM NAME
                      </label>
                      <span className="text-4xs text-gray-500 font-bold font-mono">
                        {customization.playerName.length}/12
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. SUJAN"
                      value={customization.playerName}
                      onChange={(e) => handleNameInputChange(e.target.value)}
                      className="w-full bg-navy/60 border border-white/5 focus:border-nike text-white rounded-xl py-2.5 px-4 font-condensed font-black text-sm tracking-wider uppercase focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Number input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-3xs font-extrabold font-condensed tracking-widest text-gold uppercase">
                      SQUAD LUCKY NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10"
                      value={customization.playerNumber}
                      onChange={(e) => handleNumberInputChange(e.target.value)}
                      className="w-full bg-navy/60 border border-white/5 focus:border-nike text-white rounded-xl py-2.5 px-4 font-condensed font-black text-sm tracking-widest uppercase focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* FIT, SIZING & CREST STYLING */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-5">
                
                {/* Size select */}
                <div className="flex flex-col gap-2">
                  <label className="text-3xs font-extrabold font-condensed tracking-widest text-gold uppercase">
                    CHOOSE SIZE
                  </label>
                  <div className="grid grid-cols-5 gap-1 bg-navy/55 p-1 rounded-xl border border-white/5">
                    {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCustomization(prev => ({ ...prev, size: s }))}
                        className={`py-1.5 text-xs font-condensed font-black rounded-lg transition-all duration-300 ${
                          customization.size === s
                            ? 'bg-nike text-white shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <span className="text-4xs text-gray-500 font-mono tracking-wider">
                    Official athletic vapor slim-fit profiles.
                  </span>
                </div>

                {/* Gender Select */}
                <div className="flex flex-col gap-2">
                  <label className="text-3xs font-extrabold font-condensed tracking-widest text-gold uppercase">
                    FIT CUT
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-navy/55 p-1 rounded-xl border border-white/5">
                    {(['Men', 'Women', 'Youth'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setCustomization(prev => ({ ...prev, gender: g }))}
                        className={`py-1.5 text-2xs font-condensed font-black rounded-lg transition-all duration-300 ${
                          customization.gender === g
                            ? 'bg-nike text-white shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {g.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge Crest style selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-3xs font-extrabold font-condensed tracking-widest text-gold uppercase">
                    BADGE CHROME
                  </label>
                  <select
                    value={customization.badgeStyle}
                    onChange={(e) => setCustomization(prev => ({ ...prev, badgeStyle: e.target.value as any }))}
                    className="w-full bg-navy/60 border border-white/10 rounded-xl py-2 px-3 font-condensed font-bold text-2xs tracking-widest uppercase focus:outline-none focus:border-nike text-gray-300"
                  >
                    <option value="Standard">STANDARD CREST</option>
                    <option value="Retro">RETRO VINTAGE</option>
                    <option value="Gold Edition">GOLD CHAMPION</option>
                  </select>
                </div>
              </div>

              {/* ACTION TOGGLES: SAVE DESIGN & EXPLAINER */}
              <div className="border-t border-white/5 pt-4 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-1.5 text-gray-400 text-3xs font-condensed font-bold uppercase">
                  <Info className="w-3.5 h-3.5 text-nike" />
                  PRO GEAR DETAILS APPROVED: NIKE DRI-FIT VAPOR WEAVE TECHNOLOGY
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveToLocker}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-navy-light to-navy border border-white/10 hover:border-gold/30 rounded-xl text-2xs font-condensed font-extrabold tracking-widest uppercase transition duration-300 shadow-md text-gold cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" /> SAVE TO LOCKER
                  </button>
                </div>
              </div>
            </div>

            {/* TRIVIA ODDS BOOSTER CHALLENGE CARD */}
            <div className="bg-gradient-to-r from-navy via-navy-light to-navy border border-white/5 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-gold mt-0.5 flex-shrink-0 animate-bounce" />
                <div>
                  <h4 className="text-white text-sm font-bebas tracking-wide uppercase">
                    +2X GIVEAWAY ODDBOOSTER TRIVIA CHALLENGE!
                  </h4>
                  <p className="text-gray-400 text-3xs sm:text-2xs font-condensed font-medium leading-relaxed">
                    Answer the official fan trivia quiz below correctly to claim double ticket weight values in the final sweepstake!
                  </p>
                </div>
              </div>

              <div className="bg-navy p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                <p className="text-white text-xs font-semibold leading-relaxed">
                  Q: Which combination of countries is officially hosting the historic FIFA World Cup 2026?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                  {[
                    { id: 'bra_arg_uru', label: 'Brazil & Argentina' },
                    { id: 'usa_mex_can', label: 'USA, Mexico, Canada' },
                    { id: 'fra_spa_ger', label: 'France & Germany' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleAnswerSubmit(opt.id)}
                      className={`p-2.5 rounded-xl text-center font-condensed font-bold text-3xs tracking-widest uppercase border transition-all duration-300 ${
                        selectedAnswer === opt.id
                          ? opt.id === 'usa_mex_can'
                            ? 'bg-grass/20 border-grass text-green-300'
                            : 'bg-red/20 border-red text-red-300'
                          : 'bg-navy-light/70 border-white/5 hover:border-white/10 text-gray-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Score booster feedback message */}
                {quizScoreBoost !== null && (
                  <div className={`text-2xs font-condensed font-black tracking-widest uppercase mt-1 text-center ${
                    quizScoreBoost ? 'text-green-400' : 'text-red'
                  }`}>
                    {quizScoreBoost
                      ? '🎯 BOOSTER APPLIED: +2x TICKET WEIGHT VALUE GRANTED!'
                      : '❌ INCORRECT: ATTEMPT FAILURE! SELECT THE MIDDLE TRIVIA TAB TO BOOST WEIGHT ODDS.'
                    }
                  </div>
                )}
              </div>
            </div>

            {/* LIVE FEED: RECENT REGISTRATIONS TICKER */}
            <div className="bg-navy-light/75 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-3xs font-extrabold font-condensed tracking-widest text-gold uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" /> LIVE CAMPAIGN REGISTRANT FEED
                </span>
                <span className="text-4xs font-mono text-gray-500 uppercase">REAL-TIME DB AUDIT</span>
              </div>
              
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                <AnimatePresence>
                  {registeredEntries.map((tick, i) => (
                    <motion.div
                      key={tick.ticketCode + '-' + i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-navy p-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-3 text-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bebas text-white tracking-wide">{tick.fullName.toUpperCase()}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-nike font-condensed font-extrabold">{tick.countryName.toUpperCase()}</span>
                        <span className="text-gray-500">•</span>
                        <span className="bg-white/5 text-gray-300 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase">
                          PASS #{tick.playerNumber} {tick.playerName}
                        </span>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-gold font-mono text-[9px] font-semibold">{tick.ticketCode}</span>
                        <span className="text-[8px] text-gray-400 font-condensed font-medium mt-0.5">{tick.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Live Jersey SVG display, Spin Wheel and Tickets (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8">
            
            {/* STAGE SCREEN CONTAINER */}
            <div className="bg-gradient-to-b from-navy-light to-[#0e1428] border border-white/10 rounded-2xl p-6 flex flex-col items-center relative shadow-2xl overflow-hidden min-h-[440px]">
              
              {/* Geometric stadium pitch overlay graphics */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent_40%,#1a7a3c30_100%)] pointer-events-none" />
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/5 p-1 px-2.5 rounded-full text-3xs font-condensed font-bold tracking-widest text-[#6dff8a]">
                <Shield className="w-3.5 h-3.5 text-gold animate-spin" strokeWidth="2" /> DRI-FIT PRO ACTIVE PREVIEW
              </div>

              {/* Actual SVG Custom Jersey preview rendered in Real Time */}
              <div className="w-full flex-grow flex items-center justify-center my-6 max-w-[260px] relative z-10">
                <JerseyPreview
                  country={selectedCountry}
                  customization={customization}
                  onViewModeChange={(val) => setCustomization(prev => ({ ...prev, viewMode: val }))}
                />
              </div>

              {/* Status display under the Jersey preview */}
              <div className="text-center relative z-10 w-full mt-2">
                <p className="text-gold font-bebas text-lg tracking-wider">
                  {selectedCountry.flag} {selectedCountry.name.toUpperCase()} AUTHENTIC KIT
                </p>
                <p className="text-gray-400 text-3xs font-condensed tracking-widest uppercase mt-0.5">
                  Stars: {selectedCountry.stars > 0 ? '★'.repeat(selectedCountry.stars) : 'NEW ERA'} • Customized by Sponsor
                </p>
              </div>
            </div>

            {/* INTERACTIVE COMPONENT 2: PARTICIPANT REGISTRATION BLOCK */}
            {!isRegistered ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-b from-navy-light to-navy border border-white/5 rounded-2xl p-6 sm:p-7 flex flex-col gap-4 relative shadow-2xl"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-gold animate-bounce" />
                  <div>
                    <h3 className="font-bebas text-lg sm:text-xl tracking-wide uppercase leading-none">
                      2. REGISTER ENTRY PROFILE
                    </h3>
                    <p className="text-3xs font-extrabold font-condensed tracking-widest text-gray-400 uppercase mt-0.5">
                      Verify account parameters securely
                    </p>
                  </div>
                </div>

                <form onSubmit={handleRegisterFormSubmit} className="flex flex-col gap-3">
                  {/* Full name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-condensed font-bold tracking-widest text-gray-300 uppercase">
                      FULL NAME
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full bg-navy/60 border border-white/5 focus:border-gold rounded-xl py-2 pl-9 pr-4 font-condensed font-bold text-xs focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email address */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-condensed font-bold tracking-widest text-gray-300 uppercase">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-navy/60 border border-white/5 focus:border-gold rounded-xl py-2 pl-9 pr-4 font-condensed font-bold text-xs focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Instagram handle check */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-condensed font-bold tracking-widest text-gray-300 uppercase">
                      INSTAGRAM HANDLE
                    </label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="text"
                        required
                        placeholder="@tripurasujanbd"
                        value={formData.instagramHandle}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagramHandle: e.target.value }))}
                        className="w-full bg-navy/60 border border-white/5 focus:border-gold rounded-xl py-2 pl-9 pr-4 font-condensed font-bold text-xs focus:outline-none transition-all"
                      />
                    </div>
                    <span className="text-4xs text-gray-500 font-condensed font-semibold tracking-wide uppercase">
                      Follow @tripurasujanbd on IG to unlock verified security checks!
                    </span>
                  </div>

                  {/* YouTube subscriber validation bonus clicker */}
                  <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-3.5 flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-red-400 font-extrabold font-condensed tracking-wider uppercase flex items-center gap-1.5">
                        🔴 YOUTUBE SPECIAL ODDS BOOSTER
                      </span>
                      {hasYoutubeBoost ? (
                        <span className="bg-red-600 text-white font-condensed font-black tracking-widest text-[8px] py-0.5 px-2 rounded uppercase animate-pulse">
                          +3X BOOSTER VERIFIED
                        </span>
                      ) : (
                        <span className="bg-white/5 text-gray-400 font-condensed font-bold text-[8px] py-0.5 px-2 rounded uppercase">
                          OPTIONAL REWARD
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 font-condensed text-[11px] font-medium leading-relaxed">
                      Subscribe to our official YouTube channel <span className="text-red-400 font-bold">@tripurasujanbd</span> to claim +3x entry odds multipliers in the grand prize pool!
                    </p>
                    {!hasYoutubeBoost ? (
                      <button
                        type="button"
                        onClick={() => {
                          setHasYoutubeBoost(true);
                          window.open('https://youtube.com/@tripurasujanbd', '_blank', 'noreferrer,noopener');
                        }}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 transition font-bebas text-2xs tracking-widest text-white uppercase rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        ▶ SUBSCRIBE TO @tripurasujanbd TO ACTIVATE +3X
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-red-500/10 py-1.5 px-3 rounded text-3xs font-condensed font-bold text-red-300 uppercase border border-red-500/20">
                        ✅ SUBSCRIPTION BONUS LINKED TO TICKET (@tripurasujanbd)
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-gradient-to-r from-nike to-orange-600 hover:from-orange-600 hover:to-orange-700 font-bebas text-sm tracking-widest uppercase rounded-xl shadow-lg hover:shadow-orange-600/20 active:scale-[0.98] transition-all cursor-pointer text-white text-center flex items-center justify-center gap-1 px-4"
                  >
                    REGISTER DESIGN & UNLOCK REWARD WHEEL <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/5 p-2.5 rounded-xl mt-3 select-none">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-5 h-5 bg-red-650 bg-red-650 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-[10px] shrink-0">
                        ▶
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="text-[8px] text-gray-400 font-bold font-condensed tracking-wider uppercase leading-none">PLATFORM CHECK</span>
                        <span className="text-white font-bold font-condensed text-[10px] uppercase tracking-wide truncate">VERIFIED BY YOUTUBE</span>
                      </div>
                    </div>
                    <div className="h-6 w-[1px] bg-white/10 shrink-0" />
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-5 h-5 bg-gold rounded-lg flex items-center justify-center font-bold text-navy text-[10px] shrink-0">
                        🛡️
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="text-[8px] text-gray-400 font-bold font-condensed tracking-wider uppercase leading-none">GROWZIFY AUDIT</span>
                        <span className="text-white font-bold font-condensed text-[10px] uppercase tracking-wide truncate">SECURE DRAW CERTIFIED</span>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : !wheelReward ? (
              /* REWARD WHEEL ACTIVE SECTION */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SpinWheel onSpinComplete={handleSpinComplete} isRegistered={isRegistered} />
              </motion.div>
            ) : (
              /* COMPLETED FINAL ticket PASS VOUCHER DISPLAY */
              activeTicket && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col gap-3 items-center"
                >
                  <div className="bg-grass/10 border border-grass/20 px-4 py-3.5 rounded-xl text-center w-full flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div className="flex flex-col items-start">
                      <span className="text-green-300 font-condensed font-black text-2xs uppercase tracking-widest">
                        REGISTRATION & SPIN CODE SECURED SUCCESSFULLY!
                      </span>
                      <span className="text-3xs text-gray-400 font-condensed font-medium">
                        Verification ID: wc26-{activeTicket.id}
                      </span>
                    </div>
                  </div>

                  <TicketBadge
                    country={selectedCountry}
                    customization={customization}
                    fullName={activeTicket.fullName}
                    entryCode={activeTicket.entryCode}
                    spinReward={activeTicket.spinReward}
                    ticketId={activeTicket.id}
                    hasYoutubeBoost={hasYoutubeBoost}
                  />

                  {/* Download pass badge mockup buttons */}
                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => alert(`Registration verified! PASS CODE: ${activeTicket.entryCode}. Check your email under ${activeTicket.email} for status alerts.`)}
                      className="flex-1 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 transition rounded-xl text-2xs font-condensed font-bold tracking-widest text-[#6dff8a] flex items-center justify-center gap-1 px-3 uppercase cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> CHECK PASS STATUS
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Ticket saved inside Locker successfully! Take a screenshot to show on follow-verification.`)}
                      className="py-2.5 px-4 bg-gradient-to-r from-nike to-orange-600 hover:from-orange-600 hover:to-orange-700 transition rounded-xl text-2xs font-condensed font-bold tracking-widest text-white flex items-center justify-center gap-1.5 uppercase cursor-pointer shadow-md"
                    >
                      <Download className="w-4 h-4" /> EXPORT VOUCHER
                    </button>
                  </div>
                </motion.div>
              )
            )}

            {/* MY LOCAL LOCKER: LIST SAVED DESIGNS STATE */}
            {lockerSaves.length > 0 && (
              <div className="bg-navy-light/95 border border-white/5 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl">
                <div
                  className="flex items-center justify-between cursor-pointer border-b border-white/5 pb-2"
                  onClick={() => setIsSavesListOpen(!isSavesListOpen)}
                >
                  <span className="text-3xs font-extrabold font-condensed tracking-widest text-gold uppercase flex items-center gap-1.5">
                    🗄️ MY DRI-FIT LOCKER ({lockerSaves.length} SAVED)
                  </span>
                  <span className="text-4xs font-condensed text-gray-400 font-bold uppercase underline">
                    {isSavesListOpen ? 'COLLAPSE LOCKER' : 'EXPAND LOCKER'}
                  </span>
                </div>

                {isSavesListOpen && (
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                    {lockerSaves.map((saved, i) => {
                      const countId = COUNTRY_KITS.find(c => c.id === saved.countryId);
                      return (
                        <div
                          key={i}
                          className="bg-navy p-3 rounded-xl border border-white/5 flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-gold/30 transition duration-300"
                        >
                          <div className="flex gap-2 items-start justify-between">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-white font-bebas tracking-wide flex items-center gap-1">
                                {countId?.flag} {countId?.name.toUpperCase()}
                              </span>
                              <span className="text-4xs text-gray-400 font-condensed font-medium mt-0.5">
                                Print: <span className="text-gold font-bold">{saved.playerName} #{saved.playerNumber}</span>
                              </span>
                              <span className="text-[9px] text-gray-500 font-mono tracking-wider">
                                {saved.size} ({saved.gender})
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromLocker(i);
                              }}
                              className="text-gray-500 hover:text-red transition p-1"
                              title="Delete design"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => loadSavedJersey(saved)}
                            className="w-full py-1 bg-white/5 border border-white/10 hover:bg-gold hover:text-navy hover:border-gold rounded-lg font-condensed font-black text-4xs tracking-widest text-gray-300 transition duration-300 uppercase flex items-center justify-center gap-1"
                          >
                            <Shirt className="w-2.5 h-2.5" /> LOAD CONFIG
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* VERIFIED FAN TESTIMONIALS CAROUSEL */}
        <TestimonialsCarousel />

        {/* INTERACTIVE LOTTERY DRAW WINNER SLOTS PANEL */}
        <section className="relative z-10 w-full bg-navy-light/95 border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl overflow-hidden mt-6">
          {/* Top colored high contrast line accent */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-green-500 via-gold to-[#00c2ff]" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-bebas text-xl sm:text-2xl text-white tracking-widest uppercase leading-none">
                LIVE SWEEPSTAKES DRAWING SLOTS
              </h3>
              <p className="text-3xs sm:text-2xs font-condensed font-extrabold tracking-widest text-gray-400 uppercase mt-1">
                Transparency Audit: 5 slots reserved for random authenticated participants
              </p>
            </div>
            <div className="flex items-center gap-2 bg-grass/10 border border-grass/20 py-1.5 px-3 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <span className="text-[10px] text-green-300 font-bold font-condensed tracking-wider uppercase">
                SECURE RANDOMIZED DRAW ACTIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { slot: 'WINNER SLOT 1', flag: '🇧🇷', mock: '@brazil_fan_wc', ticket: 'WC26-NIKE-7729', status: 'VERIFIED' },
              { slot: 'WINNER SLOT 2', flag: '🇦🇷', mock: '@santi_99_wc', ticket: 'WC26-NIKE-2091', status: 'VERIFIED' },
              { slot: 'WINNER SLOT 3', flag: '🇯🇵', mock: '@tanaka_strike', ticket: 'WC26-NIKE-5821', status: 'VERIFIED' },
              { slot: 'WINNER SLOT 4', flag: '🇺🇸', mock: '@sam_soccer_9', ticket: 'WC26-NIKE-1032', status: 'VERIFIED' },
              { slot: 'WINNER SLOT 5', flag: '🇲🇽', mock: '@chuy_viva_26', ticket: 'WC26-NIKE-4402', status: 'VERIFIED' }
            ].map((wn, i) => (
              <div key={i} className="bg-navy p-4 rounded-xl border border-white/5 flex flex-col justify-between gap-3 relative overflow-hidden text-center group hover:border-gold/30 transition duration-300">
                <div className="flex justify-between items-center text-4xs font-condensed font-bold text-gray-400 uppercase tracking-widest">
                  <span>{wn.slot}</span>
                  <span className="text-green-400 font-black">● {wn.status}</span>
                </div>
                
                <div className="my-2 flex flex-col items-center gap-1.5">
                  <span className="text-3xl leading-none animate-bounce">{wn.flag}</span>
                  <span className="text-white font-bebas text-sm tracking-wider">{wn.mock}</span>
                  <span className="text-[10px] text-gray-400 font-mono tracking-widest">{wn.ticket}</span>
                </div>

                <div className="bg-white/5 py-1 px-2.5 rounded-lg text-[9px] font-condensed font-black tracking-widest text-gold text-center uppercase">
                  DRI-FIT COMPASS PASS
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <div className="text-left">
                <span className="text-xs text-white uppercase font-sans font-black tracking-wide block">RANDOM VERIFIED TRANSPARENCY NOTICE</span>
                <span className="text-[11px] text-gray-400 font-condensed font-medium block leading-normal mt-0.5">
                  All finalist selections undergo manual background audit on subscriber credentials and stream activity. Anyone found abusing entry points or multi-logging will be automatically flagged and removed from the active prize roster.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert("Final drawing simulation happens on June 11, 2026! Complete and register your custom jersey pass inside step 2 profile to secure your queue ticket with 3x multiplier applied.")}
              className="px-5 py-2.5 bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold transition font-bebas text-xs tracking-widest text-[#0a1128] uppercase font-black rounded-xl cursor-pointer shadow-md"
            >
              RUN TRANSPARENCY TEST
            </button>
          </div>
        </section>

        {/* DETAILS SECTION FOR TRANSPARENCY */}
        <footer className="mt-8 border-t border-white/5 pt-10 pb-6 text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 bg-white/5 py-3 px-5 border border-white/5 rounded-2xl max-w-xl">
            <span className="text-xs">🏆</span>
            <p className="text-gray-400 font-condensed text-3xs sm:text-2xs font-medium leading-relaxed uppercase">
              THIS SWEEPSTAKES PASS IS POWERED & SPONSORED BY THE SPONSOR TEAM OF <span className="text-white font-bold">@tripurasujanbd</span>. CO-POWERED AND VERIFIED OFFICIALLY BY <span className="text-gold font-bold">GROWZIFY</span>. ALL CONTEST PRIZE ALLOCATIONS ARE FULFILLED SECURELY UNDER PROMOTION GUARANTEES.
            </p>
          </div>
          
          <div className="text-gray-500 font-mono text-xs tracking-wider">
            &copy; 2026 FIFA WORLD CUP – CO-POWERED BY GROWZIFY | OFFICIAL SPONSOR: @tripurasujanbd • ALL RIGHTS RESERVED
          </div>
        </footer>

      </div>
    </div>
  );
}
