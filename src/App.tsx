import React, { useState, useEffect } from 'react';
import { FarhaNavbar } from './components/FarhaNavbar';
import { HeroSection } from './components/HeroSection';
import { CategoryPackagesView } from './components/CategoryPackagesView';
import { InteractiveCostCalculator } from './components/InteractiveCostCalculator';
import { BookingModal } from './components/BookingModal';
import { FarhaAIAssistantModal } from './components/FarhaAIAssistantModal';
import { PortfolioGallery } from './components/PortfolioGallery';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { MyBookingsModal } from './components/MyBookingsModal';
import { FarhaFooter } from './components/FarhaFooter';
import { SourceCodeModal } from './components/SourceCodeModal';
import { ToastContainer, ToastItem } from './components/ToastNotification';
import { InAppNotification } from './components/NotificationBell';
import { 
  EventCategory, 
  ServicePackage, 
  AddOnService, 
  BookingFormData,
  BookingStatus,
  BookingReview
} from './types';
import { SERVICE_PACKAGES } from './data/farhaData';
import { MessageCircle, Bot, Sparkles, Code2, Download } from 'lucide-react';

const STORAGE_KEY_BOOKINGS = 'farha_iraq_bookings_v1';

export function App() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('birthday');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isSourceCodeOpen, setIsSourceCodeOpen] = useState(false);

  // In-app Toasts & Notifications
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => [
    {
      id: 'notif-welcome',
      title: 'مرحباً بك في منصة فرحة',
      message: 'تم تفعيل نظام الإشعارات الفورية (Toast) لمتابعة تأكيد الحجوزات والمواعيد.',
      type: 'info',
      timestamp: 'الآن',
      isRead: false,
    },
  ]);

  // Selected package and add-ons for booking modal
  const [bookingPackage, setBookingPackage] = useState<ServicePackage | null>(null);
  const [bookingAddOns, setBookingAddOns] = useState<AddOnService[]>([]);
  const [bookingCity, setBookingCity] = useState<string>('بغداد');
  const [bookingGuestsCount, setBookingGuestsCount] = useState<number>(25);
  const [bookingEventDate, setBookingEventDate] = useState<string>('');

  // Saved bookings in local storage
  const [bookings, setBookings] = useState<BookingFormData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load bookings from storage', e);
    }
    // Initial sample bookings to show user on calendar (including pending to test transition!)
    return [
      {
        id: 'FARHA-IQ-92841',
        clientName: 'أحمد السعدي',
        phone: '07701234567',
        city: 'بغداد',
        addressDetails: 'الكرخ - المنصور / قرب تمثال المنصور',
        eventType: 'birthday',
        packageId: 'bday-gold',
        eventDate: '2026-09-28',
        eventTime: '06:00 مساءً',
        guestsCount: 30,
        selectedAddOnIds: ['addon-dj', 'addon-sparklers'],
        customThemeColors: 'أزرق ملكي وذهبي',
        childNameAge: 'عمر (5 سنوات)',
        specialNotes: 'يرجى إحضار مهرج مرح مع المسابقات للأطفال',
        totalEstimatedPrice: 485000,
        createdAt: new Date().toISOString(),
        status: 'pending' // pending so user can easily test transition to confirmed!
      },
      {
        id: 'FARHA-IQ-92842',
        clientName: 'د. مروة العبيدي',
        phone: '07712345678',
        city: 'بغداد',
        addressDetails: 'حي الجامعة - قاعة ريحانة للاحتفالات',
        eventType: 'wedding',
        packageId: 'wed-royal',
        eventDate: '2026-09-24',
        eventTime: '07:30 مساءً',
        guestsCount: 150,
        selectedAddOnIds: ['addon-photo', 'addon-cake', 'addon-dj'],
        customThemeColors: 'أبيض لؤلؤي وذهبي إيطالي',
        specialNotes: 'كوشة ملكية فخمة مع إضاءة خافتة رومانسية',
        totalEstimatedPrice: 950000,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      },
      {
        id: 'FARHA-IQ-92843',
        clientName: 'م. سيف الدين كريم',
        phone: '07809876543',
        city: 'بغداد',
        addressDetails: 'الجادرية - قاعة النادي الملكي',
        eventType: 'graduation',
        packageId: 'grad-vip',
        eventDate: '2026-10-02',
        eventTime: '05:00 مساءً',
        guestsCount: 80,
        selectedAddOnIds: ['addon-photo', 'addon-sparklers'],
        customThemeColors: 'أسود وبرونزي مع شعار الكلية',
        universityCollege: 'جامعة بغداد - كلية الهندسة',
        specialNotes: 'تنسيق قبعات التخرج وتصوير جوي بالدرون',
        totalEstimatedPrice: 520000,
        createdAt: new Date().toISOString(),
        status: 'completed',
        review: {
          rating: 5,
          comment: 'ألف شكر لفريق فرحة، التنسيق كان قمة في الروعة والتنظيم والتصوير الجوي كان مفاجأة أذهلت كل الحضور!',
          tags: ['✨ ديكور مبهر وفخم', '⏱️ التزام دقيق بالوقت', '🤝 كادر محترف ولطيف'],
          createdAt: '2026-09-18'
        }
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed to persist bookings', e);
    }
  }, [bookings]);

  // Toast trigger helper
  const triggerToast = (toastData: Omit<ToastItem, 'id' | 'timestamp'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const timestamp = new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });
    const newToast: ToastItem = {
      ...toastData,
      id,
      timestamp,
    };

    setToasts((prev) => [newToast, ...prev]);

    setNotifications((prev) => [
      {
        id,
        title: newToast.title,
        message: newToast.message,
        type: newToast.type,
        timestamp,
        isRead: false,
        bookingId: newToast.bookingId,
      },
      ...prev,
    ]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleSelectBookingNotification = (bookingId: string) => {
    setIsMyBookingsOpen(true);
  };

  // Handler when user clicks "احجز هذه الباقة" from package card
  const handleBookPackage = (pkg: ServicePackage) => {
    setBookingPackage(pkg);
    setBookingAddOns([]);
    setBookingEventDate('');
    setIsBookingModalOpen(true);
  };

  // Handler when user finishes calculator and proceeds to booking
  const handleProceedFromCalculator = (data: {
    category: EventCategory;
    packageItem: ServicePackage;
    selectedAddOns: AddOnService[];
    city: string;
    totalPrice: number;
    guestsCount: number;
    eventDate?: string;
    isPeakSeason?: boolean;
    seasonalSurge?: number;
  }) => {
    setIsCalculatorOpen(false);
    setBookingPackage(data.packageItem);
    setBookingAddOns(data.selectedAddOns);
    setBookingCity(data.city);
    setBookingGuestsCount(data.guestsCount);
    if (data.eventDate) {
      setBookingEventDate(data.eventDate);
    }
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: BookingFormData) => {
    setBookings((prev) => [newBooking, ...prev]);
    triggerToast({
      type: 'info',
      title: 'تم استلام طلب الحجز بنجاح 📋',
      message: `حجزك باسم "${newBooking.clientName}" برقم (${newBooking.id}) قيد المراجعة والتدقيق وسنتواصل معك قريباً لتأكيده.`,
      bookingId: newBooking.id,
      actionLabel: 'متابعة حجوزاتي',
      onAction: () => setIsMyBookingsOpen(true),
      duration: 5500,
    });
  };

  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // Immediate Alert System for Status Change (specifically pending -> confirmed)
  const handleUpdateBookingStatus = (id: string, newStatus: BookingStatus) => {
    const currentBooking = bookings.find((b) => b.id === id);
    const oldStatus = currentBooking?.status || 'pending';

    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));

    if (!currentBooking) return;

    const clientName = currentBooking.clientName || 'العميل';
    const eventDate = currentBooking.eventDate || 'المحدد';

    // Requirement: Immediate Toast Alert when status changes from 'pending' to 'confirmed'
    if (oldStatus === 'pending' && newStatus === 'confirmed') {
      triggerToast({
        type: 'celebration',
        title: 'تهانينا! تم تأكيد الحجز بنجاح 🎉',
        message: `تم تثبيت موعد حجز "${clientName}" لتاريخ (${eventDate}) وأصبح الآن مؤكداً وجاهزاً لتجهيز الكادر الميداني!`,
        bookingId: id,
        actionLabel: 'استعراض في التقويم 📅',
        onAction: () => setIsMyBookingsOpen(true),
        duration: 6500,
      });
    } else if (newStatus === 'confirmed') {
      triggerToast({
        type: 'celebration',
        title: 'تم تأكيد الحجز بنجاح 🎉',
        message: `حجز "${clientName}" برقم (${id}) أصبح مؤكداً في جدول المواعيد.`,
        bookingId: id,
        actionLabel: 'فتح التقويم',
        onAction: () => setIsMyBookingsOpen(true),
        duration: 6000,
      });
    } else if (newStatus === 'completed') {
      triggerToast({
        type: 'celebration',
        title: 'اكتمل الحفل بنجاح ✨ شاركنا تقييمك ورأيك!',
        message: `تم وسم حجز "${clientName}" كمكتمل. نسعد جداً بتلقي تقييمك لجودة الخدمة والكادر!`,
        bookingId: id,
        actionLabel: 'تقييم الخدمة ⭐',
        onAction: () => setIsMyBookingsOpen(true),
        duration: 7000,
      });
    } else if (newStatus === 'cancelled') {
      triggerToast({
        type: 'warning',
        title: 'تم إلغاء الحجز ⚠️',
        message: `تم إلغاء طلب حجز "${clientName}". يمكنك إعادة جدولته أو تغييره في أي وقت.`,
        bookingId: id,
        duration: 5000,
      });
    } else if (newStatus === 'pending') {
      triggerToast({
        type: 'info',
        title: 'الحجز قيد المراجعة ⏳',
        message: `تمت إعادة حجز "${clientName}" إلى قائمة المراجعة والتدقيق.`,
        bookingId: id,
        actionLabel: 'تفاصيل الحجز',
        onAction: () => setIsMyBookingsOpen(true),
        duration: 5000,
      });
    }
  };

  const handleSaveBookingReview = (bookingId: string, review: BookingReview) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, review } : b))
    );
    triggerToast({
      type: 'celebration',
      title: 'شكراً جزيلاً لتقييمك الغالي! ⭐',
      message: `تم تسجيل تقييمك (${review.rating}/5 نجوم) بنجاح لحجز #${bookingId}. رأيك وسام فخر لفريق فرحة.`,
      bookingId,
      duration: 5500,
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white" dir="rtl">
      
      {/* Global In-App Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Quick Bar with Direct ZIP Download and Code Viewer */}
      <div className="bg-slate-950 text-white text-xs py-2 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">منصة فرحة لتنظيم الحفلات والمناسبات بالعراق</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSourceCodeOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-3 py-1 rounded-md text-xs inline-flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>عرض ونسخ الأكواد</span>
            </button>
            <a
              href="/api/download-zip"
              download="farha-events-iraq.zip"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1 rounded-md text-xs inline-flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>تحميل الكود بالكامل (ZIP)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Top Navbar with Real-time Notification Bell */}
      <FarhaNavbar
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenAIPlanner={() => setIsAIPlannerOpen(true)}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenSourceCode={() => setIsSourceCodeOpen(true)}
        onSelectCategory={(catId) => setSelectedCategory(catId as EventCategory)}
        bookingsCount={bookings.length}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onSelectBookingNotification={handleSelectBookingNotification}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenAIPlanner={() => setIsAIPlannerOpen(true)}
        />

        {/* 2. Interactive Packages & Addons View */}
        <CategoryPackagesView
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onBookPackage={handleBookPackage}
          onOpenCalculatorWithCategory={(cat) => {
            setSelectedCategory(cat);
            setIsCalculatorOpen(true);
          }}
        />

        {/* 3. Real Work Portfolio Gallery */}
        <PortfolioGallery
          onBookSpecial={() => {
            const defaultPkg = SERVICE_PACKAGES[1]; // Bday gold
            handleBookPackage(defaultPkg);
          }}
        />

        {/* 4. Customer Reviews & Why Choose Farha */}
        <CustomerReviewsSection />
      </main>

      {/* Footer */}
      <FarhaFooter />

      {/* Floating Action Buttons for quick WhatsApp, Code Viewer, and AI Planner */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-2.5">
        {/* Floating Source Code Button */}
        <button
          onClick={() => setIsSourceCodeOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-950 hover:bg-slate-900 text-amber-400 border-2 border-amber-400 shadow-xl shadow-amber-400/20 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
          title="عرض ونسخ كود المشروع أو تحميل ZIP"
        >
          <Code2 className="w-6 h-6 text-amber-400" />
        </button>

        <button
          onClick={() => setIsAIPlannerOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl shadow-purple-600/30 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
          title="مستشار فرحة الذكي"
        >
          <Bot className="w-6 h-6 text-amber-300" />
        </button>

        <button
          onClick={() => {
            const text = encodeURIComponent("مرحباً فريق فرحة، أود الاستفسار عن باقات تزيين وتنظيم المناسبات في العراق.");
            window.open(`https://wa.me/9647700000000?text=${text}`, '_blank');
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
          title="تواصل مباشر عبر واتساب"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </button>
      </div>

      {/* Modals */}
      {/* 0. Source Code Viewer & Downloader Modal */}
      <SourceCodeModal
        isOpen={isSourceCodeOpen}
        onClose={() => setIsSourceCodeOpen(false)}
      />

      {/* 1. Interactive Cost Calculator Modal */}
      <InteractiveCostCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        initialCategory={selectedCategory}
        onProceedToBooking={handleProceedFromCalculator}
      />

      {/* 2. Direct Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        packageItem={bookingPackage}
        selectedAddOns={bookingAddOns}
        initialCity={bookingCity}
        initialGuestsCount={bookingGuestsCount}
        initialEventDate={bookingEventDate}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 3. AI Event Planner Assistant Modal */}
      <FarhaAIAssistantModal
        isOpen={isAIPlannerOpen}
        onClose={() => setIsAIPlannerOpen(false)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* 4. My Saved Bookings Modal */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={bookings}
        onDeleteBooking={handleDeleteBooking}
        onUpdateStatus={handleUpdateBookingStatus}
        onSaveReview={handleSaveBookingReview}
      />

    </div>
  );
}

export default App;

