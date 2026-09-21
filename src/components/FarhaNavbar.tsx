import React from 'react';
import { 
  Sparkles, 
  PartyPopper, 
  Calculator, 
  Image as ImageIcon, 
  MessageCircle, 
  CalendarCheck, 
  PhoneCall, 
  Bot, 
  Download, 
  Code2 
} from 'lucide-react';
import { NotificationBell, InAppNotification } from './NotificationBell';

interface FarhaNavbarProps {
  onOpenCalculator: () => void;
  onOpenAIPlanner: () => void;
  onOpenMyBookings: () => void;
  onOpenSourceCode?: () => void;
  onSelectCategory: (catId: string) => void;
  bookingsCount: number;
  notifications?: InAppNotification[];
  onMarkAllAsRead?: () => void;
  onClearAllNotifications?: () => void;
  onSelectBookingNotification?: (bookingId: string) => void;
}

export const FarhaNavbar: React.FC<FarhaNavbarProps> = ({
  onOpenCalculator,
  onOpenAIPlanner,
  onOpenMyBookings,
  onOpenSourceCode,
  bookingsCount,
  notifications = [],
  onMarkAllAsRead = () => {},
  onClearAllNotifications = () => {},
  onSelectBookingNotification,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsAppSupport = () => {
    const text = encodeURIComponent("مرحباً فريق فرحة، أود الاستفسار عن باقات تنظيم المناسبات وتنسيق الديكور.");
    window.open(`https://wa.me/9647700000000?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-rose-600">
                <PartyPopper className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                  فرحــــة
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  العراق
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium hidden sm:block">
                حجز وتنظيم المناسبات وتزيين السيارات
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-700">
            <button
              onClick={() => scrollToSection('packages-section')}
              className="px-3.5 py-2 rounded-xl hover:text-rose-600 hover:bg-rose-50/70 transition-colors cursor-pointer"
            >
              الباقات والخدمات
            </button>
            <button
              onClick={onOpenCalculator}
              className="px-3.5 py-2 rounded-xl text-rose-600 bg-rose-50/80 hover:bg-rose-100/80 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Calculator className="w-4 h-4" />
              احسب كلفة الحفلة
            </button>
            <button
              onClick={() => scrollToSection('gallery-section')}
              className="px-3.5 py-2 rounded-xl hover:text-rose-600 hover:bg-rose-50/70 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              معرض الأعمال
            </button>
            <button
              onClick={() => scrollToSection('reviews-section')}
              className="px-3.5 py-2 rounded-xl hover:text-rose-600 hover:bg-rose-50/70 transition-colors cursor-pointer"
            >
              آراء العوائل
            </button>
            <button
              onClick={onOpenAIPlanner}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200/70 hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              مستشار فرحة الذكي
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* View & Copy Code Modal Button */}
            {onOpenSourceCode && (
              <button
                onClick={onOpenSourceCode}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all border border-slate-700 hover:border-amber-400 cursor-pointer"
                title="عرض وتصفح ملفات الكود"
              >
                <Code2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">عرض الكود</span>
                <span className="sm:hidden">الكود</span>
              </button>
            )}

            {/* Direct ZIP Download */}
            <a
              href="/api/download-zip"
              download="farha-events-iraq.zip"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 sm:px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
              title="تحميل كود المشروع كاملاً ZIP"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>تحميل ZIP</span>
            </a>

            {/* In-app Notifications Bell */}
            <NotificationBell
              notifications={notifications}
              onMarkAllAsRead={onMarkAllAsRead}
              onClearAll={onClearAllNotifications}
              onSelectBookingNotification={onSelectBookingNotification}
            />

            {/* My Bookings Button */}
            <button
              onClick={onOpenMyBookings}
              title="حجوزاتي"
              className="relative p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="hidden sm:inline">حجوزاتي</span>
              {bookingsCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {bookingsCount}
                </span>
              )}
            </button>

            {/* Direct WhatsApp Call/Chat */}
            <button
              onClick={openWhatsAppSupport}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-emerald-600/20 hover:shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span className="hidden md:inline">تواصل واتساب</span>
              <span className="md:hidden">واتساب</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
