import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  Star, 
  Camera, 
  Maximize2, 
  Minimize2,
  Share2,
  Check
} from 'lucide-react';
import { PortfolioItem, PortfolioImage } from '../types';

interface PortfolioSliderModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookSpecial: () => void;
}

export const PortfolioSliderModal: React.FC<PortfolioSliderModalProps> = ({
  item,
  isOpen,
  onClose,
  onBookSpecial
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Normalize gallery images: ensure at least one image exists
  const images: PortfolioImage[] = React.useMemo(() => {
    if (!item) return [];
    if (item.galleryImages && item.galleryImages.length > 0) {
      return item.galleryImages;
    }
    return [
      {
        url: item.imageUrl,
        caption: item.description,
        tag: 'الصورة الرئيسية'
      }
    ];
  }, [item]);

  // Reset to first slide when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsPlaying(false);
      setIsFullscreen(false);
    }
  }, [isOpen, item]);

  // Navigation handlers
  const nextSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-play slideshow effect
  useEffect(() => {
    if (isPlaying && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 3500);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPlaying, images.length, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        // In RTL Arabic layout: right arrow navigates to next or previous naturally
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, nextSlide, prevSlide]);

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleCopyShare = () => {
    if (!item) return;
    const text = `شاهد تفاصيل عمل "${item.title}" في منصة فرحة العراق: ${window.location.origin}`;
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isOpen || !item) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200" 
      dir="rtl"
    >
      {/* Click outside to close container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-700/40 overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full">
                  معرض الصور الحي
                </span>
                <span className="text-xs text-slate-400">
                  لقطة {currentIndex + 1} من {images.length}
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-md sm:max-w-xl">
                {item.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="مشاركة تفاصيل العمل"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'تم النسخ' : 'مشاركة'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content: Slider on Top, Details below */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Main Slider Stage */}
          <div 
            className={`relative bg-slate-950 flex flex-col items-center justify-center select-none ${
              isFullscreen ? 'h-[75vh]' : 'h-[50vh] sm:h-[60vh]'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* The Main High-Res Image */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <img
                key={currentImage.url}
                src={currentImage.url}
                alt={currentImage.caption || item.title}
                className="max-h-full max-w-full object-contain transition-opacity duration-300 animate-in fade-in"
                referrerPolicy="no-referrer"
              />

              {/* Tag Pill (Top Left) */}
              {currentImage.tag && (
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-1 rounded-xl shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>{currentImage.tag}</span>
                </div>
              )}

              {/* Location Badge (Top Right) */}
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white border border-slate-700/50 text-xs font-bold px-3 py-1 rounded-xl shadow-lg flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{item.location}</span>
              </div>

              {/* Caption Overlay Banner at the Bottom */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="max-w-2xl">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mb-1">
                    <Camera className="w-3 h-3" />
                    <span>تفاصيل الزاوية واللقطة:</span>
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed drop-shadow-sm">
                    {currentImage.caption}
                  </p>
                </div>

                {/* Counter Pill & Playback Control */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => setIsPlaying(p => !p)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold border border-white/15"
                    title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل العرض التلقائي'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-300" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'إيقاف' : 'سلايدر تلقائي'}</span>
                  </button>

                  <button
                    onClick={() => setIsFullscreen(f => !f)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title={isFullscreen ? 'تصغير' : 'تكبير المعاينة'}
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-slate-700">
                    {currentIndex + 1} / {images.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Navigation Arrow Buttons */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 z-10"
                  aria-label="الصورة السابقة"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 z-10"
                  aria-label="الصورة التالية"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="bg-slate-900/95 border-b border-slate-800 p-3 flex items-center justify-center gap-2 overflow-x-auto">
              {images.map((img, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={img.url + idx}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer border-2 ${
                      isActive 
                        ? 'border-rose-500 scale-105 ring-2 ring-rose-400 shadow-md' 
                        : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-rose-500/20" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Details & Package Information Panel */}
          <div className="p-6 bg-slate-50 space-y-6">
            
            {/* Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{item.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>تاريخ التنفيذ: {item.date}</span>
                  </span>
                  {item.setupTime && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>مدة التجهيز: {item.setupTime}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Book Button in Header */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookSpecial();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>طلب تصميم مطابق لهذه الباقة</span>
              </button>
            </div>

            {/* Description & Engineering Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Description & Highlights */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    نظرة عامة على التصميم والتجهيز:
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    {item.description}
                  </p>
                </div>

                {item.decorHighlights && item.decorHighlights.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      <span>مكونات الديكور والتنسيق المنجزة:</span>
                    </h5>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      {item.decorHighlights.map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Client Feedback & Guarantee Card */}
              <div className="md:col-span-5 space-y-4">
                {item.clientReviewSnippet && (
                  <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-full">
                        تقييم موثق من الزبون ★ 5.0
                      </span>
                    </div>

                    <p className="text-xs text-amber-950 italic leading-relaxed">
                      “{item.clientReviewSnippet}”
                    </p>

                    {item.clientName && (
                      <div className="text-[11px] font-bold text-amber-900 pt-2 border-t border-amber-200/80 flex items-center justify-between">
                        <span>العميل: {item.clientName}</span>
                        <span className="text-emerald-700 font-semibold">✓ تم الحفل بنجاح</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Direct WhatsApp Callout */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <h6 className="font-bold text-xs text-emerald-900">
                      هل تريد استفساراً سريعاً عن هذا العمل؟
                    </h6>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    فريق خدمة العملاء جاهز للإجابة عن المواد المستخدمة وإمكانية تطبيق ألوان وتعديلات خاصة بك.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const text = encodeURIComponent(`مرحباً فرحة، شفت عمل "${item.title}" في المعرض، وأريد أعرف تفاصيل وتكلفة حجز باقة مطابقة.`);
                      window.open(`https://wa.me/9647700000000?text=${text}`, '_blank');
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>تحدث مع منسق هذا العمل عبر واتساب</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
