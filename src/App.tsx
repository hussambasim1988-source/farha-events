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
import { 
  EventCategory, 
  ServicePackage, 
  AddOnService, 
  BookingFormData 
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

  // Selected package and add-ons for booking modal
  const [bookingPackage, setBookingPackage] = useState<ServicePackage | null>(null);
  const [bookingAddOns, setBookingAddOns] = useState<AddOnService[]>([]);
  const [bookingCity, setBookingCity] = useState<string>('بغداد');
  const [bookingGuestsCount, setBookingGuestsCount] = useState<number>(25);

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
    // Initial sample booking to show user
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
        status: 'confirmed'
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

  // Handler when user clicks "احجز هذه الباقة" from package card
  const handleBookPackage = (pkg: ServicePackage) => {
    setBookingPackage(pkg);
    setBookingAddOns([]);
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
  }) => {
    setIsCalculatorOpen(false);
    setBookingPackage(data.packageItem);
    setBookingAddOns(data.selectedAddOns);
    setBookingCity(data.city);
    setBookingGuestsCount(data.guestsCount);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: BookingFormData) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white" dir="rtl">
      
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

      {/* Top Navbar */}
      <FarhaNavbar
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenAIPlanner={() => setIsAIPlannerOpen(true)}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenSourceCode={() => setIsSourceCodeOpen(true)}
        onSelectCategory={(catId) => setSelectedCategory(catId as EventCategory)}
        bookingsCount={bookings.length}
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
      />

    </div>
  );
}

export default App;

