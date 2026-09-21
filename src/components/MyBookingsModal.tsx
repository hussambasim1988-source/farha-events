import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  MessageCircle, 
  FileText, 
  CalendarCheck,
  CheckCircle,
  XCircle,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Info,
  ChevronRight,
  ChevronLeft,
  LayoutList,
  CalendarDays,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Coins,
  ArrowUpRight,
  PieChart as PieChartIcon,
  Star,
  MessageSquare,
  Award,
  ThumbsUp,
  Edit3,
  CheckSquare
} from 'lucide-react';
import { Calendar, dateFnsLocalizer, View, Views, ToolbarProps } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { arSA } from 'date-fns/locale';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { BookingFormData, BookingStatus, BookingReview } from '../types';
import { BookingRatingModal } from './BookingRatingModal';
import { FieldTasksTab } from './FieldTasksTab';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingFormData[];
  onDeleteBooking: (id: string) => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onSaveReview?: (bookingId: string, review: BookingReview) => void;
}

// Arabic Localizer Setup for react-big-calendar
const locales = {
  'ar': arSA,
  'ar-SA': arSA,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }), // Saturday in Iraq / Arab world
  getDay,
  locales,
});

export const STATUS_CONFIG: Record<BookingStatus, {
  label: string;
  description: string;
  badgeClass: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  calendarBg: string;
  calendarBorder: string;
  icon: React.ComponentType<{ className?: string }>;
  stepIndex: number;
}> = {
  pending: {
    label: 'قيد المراجعة',
    description: 'طلب الحجز قيد التدقيق من قبل كادر التنسيق لترتيب المواعيد والأدوات.',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-300/50',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-300',
    calendarBg: '#d97706',
    calendarBorder: '#b45309',
    icon: Clock,
    stepIndex: 1,
  },
  confirmed: {
    label: 'مؤكد',
    description: 'تم تثبيت الموعد والفريق الميداني مستعد للتجهيز في موقع الحفل.',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300/50',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    calendarBg: '#059669',
    calendarBorder: '#047857',
    icon: CheckCircle2,
    stepIndex: 2,
  },
  completed: {
    label: 'مكتمل',
    description: 'أقيم الحفل بنجاح ونتمنى لكم دوام الأفراح والمسرات!',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-300 ring-1 ring-blue-300/50',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    calendarBg: '#2563eb',
    calendarBorder: '#1d4ed8',
    icon: Sparkles,
    stepIndex: 3,
  },
  cancelled: {
    label: 'ملغي',
    description: 'تم إلغاء هذا الطلب بناءً على رغبة العميل أو عدم توافر الموعد.',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-300/50',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-800',
    borderColor: 'border-rose-300',
    calendarBg: '#e11d48',
    calendarBorder: '#be123c',
    icon: XCircle,
    stepIndex: 0,
  }
};

interface CalendarEventItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  booking: BookingFormData;
}

// Custom Arabic Toolbar Component for react-big-calendar
const CustomCalendarToolbar: React.FC<ToolbarProps<CalendarEventItem>> = ({
  label,
  onNavigate,
  onView,
  view,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50 border-b border-slate-200">
      {/* Month / Year Label */}
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-rose-600" />
        <span className="text-base font-black text-slate-900 capitalize">{label}</span>
      </div>

      {/* Navigation: Previous, Today, Next */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onNavigate('NEXT')}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
          title="الفترة السابقة"
        >
          <ChevronRight className="w-4 h-4" />
          <span>السابق</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black transition-colors cursor-pointer shadow-xs"
        >
          اليوم
        </button>

        <button
          type="button"
          onClick={() => onNavigate('PREV')}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
          title="الفترة التالية"
        >
          <span>التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* View Switcher: Month or Week or Agenda */}
      <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => onView(Views.MONTH)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            view === Views.MONTH
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          عرض شهري
        </button>
        <button
          type="button"
          onClick={() => onView(Views.WEEK)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            view === Views.WEEK
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          عرض أسبوعي
        </button>
        <button
          type="button"
          onClick={() => onView(Views.AGENDA)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            view === Views.AGENDA
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          جدول المواعيد
        </button>
      </div>
    </div>
  );
};

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onDeleteBooking,
  onUpdateStatus,
  onSaveReview
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'dashboard' | 'list' | 'tasks'>('calendar');
  const [calendarScope, setCalendarScope] = useState<'confirmed_only' | 'all'>('confirmed_only');
  const [filterStatus, setFilterStatus] = useState<'all' | BookingStatus>('all');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date());
  const [calendarView, setCalendarView] = useState<View>(Views.MONTH);
  const [ratingModalBooking, setRatingModalBooking] = useState<BookingFormData | null>(null);

  if (!isOpen) return null;

  const formatIQD = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    onUpdateStatus(bookingId, newStatus);
    const label = STATUS_CONFIG[newStatus].label;
    setStatusNotification(`تم تحديث حالة الحجز إلى: "${label}" بنجاح.`);
    setTimeout(() => {
      setStatusNotification(null);
    }, 3000);

    // If moved to completed, automatically prompt for rating if not rated yet!
    if (newStatus === 'completed') {
      const target = bookings.find((b) => b.id === bookingId);
      if (target && !target.review) {
        setTimeout(() => {
          setRatingModalBooking({ ...target, status: 'completed' });
        }, 500);
      }
    }
  };

  const handleSaveReview = (bookingId: string, review: BookingReview) => {
    if (onSaveReview) {
      onSaveReview(bookingId, review);
    }
    setStatusNotification('تم حفظ تقييمك ورأيك في جودة الخدمة بنجاح ⭐ شكراً لك!');
    setTimeout(() => {
      setStatusNotification(null);
    }, 4000);
  };

  const openWhatsAppForBooking = (b: BookingFormData) => {
    const statusLabel = STATUS_CONFIG[b.status]?.label || 'قيد المراجعة';
    const text = encodeURIComponent(
      `مرحباً فريق فرحة، أود الاستفسار عن حجزي رقم (${b.id}) باسم (${b.clientName}) لتاريخ (${b.eventDate}). حالته الحالية: (${statusLabel}).`
    );
    window.open(`https://wa.me/9647700000000?text=${text}`, '_blank');
  };

  // KPI Calculations
  const currentMonthPrefix = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, []);

  const thisMonthBookingsCount = useMemo(() => {
    return bookings.filter(b => b.eventDate && b.eventDate.startsWith(currentMonthPrefix)).length;
  }, [bookings, currentMonthPrefix]);

  const confirmedBookingsCount = useMemo(() => {
    return bookings.filter(b => b.status === 'confirmed').length;
  }, [bookings]);

  const ratedBookings = useMemo(() => {
    return bookings.filter(b => b.review && b.review.rating > 0);
  }, [bookings]);

  const averageRating = useMemo(() => {
    if (ratedBookings.length === 0) return '5.0';
    const sum = ratedBookings.reduce((acc, b) => acc + (b.review?.rating || 5), 0);
    return (sum / ratedBookings.length).toFixed(1);
  }, [ratedBookings]);

  const totalExpectedRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalEstimatedPrice || 0), 0);
  }, [bookings]);

  const confirmedRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.totalEstimatedPrice || 0), 0);
  }, [bookings]);

  // Data for Recharts PieChart (Status Distribution)
  const statusPieData = useMemo(() => {
    const counts: Record<BookingStatus, number> = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    bookings.forEach(b => {
      if (counts[b.status] !== undefined) {
        counts[b.status]++;
      } else {
        counts.pending++;
      }
    });

    return [
      { name: 'مؤكد', value: counts.confirmed, color: '#059669', status: 'confirmed' },
      { name: 'قيد المراجعة', value: counts.pending, color: '#d97706', status: 'pending' },
      { name: 'مكتمل', value: counts.completed, color: '#2563eb', status: 'completed' },
      { name: 'ملغي', value: counts.cancelled, color: '#e11d48', status: 'cancelled' },
    ].filter(item => item.value > 0);
  }, [bookings]);

  // Data for Recharts BarChart (Revenue & Bookings by Category)
  const categoryBarData = useMemo(() => {
    const map: Record<string, { name: string; count: number; revenue: number }> = {
      wedding: { name: 'أعراس', count: 0, revenue: 0 },
      birthday: { name: 'أعياد ميلاد', count: 0, revenue: 0 },
      graduation: { name: 'تخرج', count: 0, revenue: 0 },
      car_decoration: { name: 'تزيين سيارات', count: 0, revenue: 0 },
      other: { name: 'أخرى', count: 0, revenue: 0 },
    };

    bookings.forEach(b => {
      const key = map[b.eventType] ? b.eventType : 'other';
      map[key].count += 1;
      if (b.status !== 'cancelled') {
        map[key].revenue += b.totalEstimatedPrice || 0;
      }
    });

    return Object.values(map)
      .filter(item => item.count > 0)
      .map(item => ({
        ...item,
        revenueThousands: Math.round(item.revenue / 1000), // in thousands of IQD
      }));
  }, [bookings]);

  // Filtered bookings for cards list
  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const getStatusCount = (status: BookingStatus) => {
    return bookings.filter(b => b.status === status).length;
  };

  // Calendar events: support showing Confirmed bookings specifically or all bookings
  const calendarEvents: CalendarEventItem[] = useMemo(() => {
    const sourceBookings = calendarScope === 'confirmed_only'
      ? bookings.filter(b => b.status === 'confirmed')
      : bookings;

    return sourceBookings.map((b) => {
      const dateParts = (b.eventDate || '').split('-');
      const year = dateParts.length === 3 ? parseInt(dateParts[0], 10) : new Date().getFullYear();
      const month = dateParts.length === 3 ? parseInt(dateParts[1], 10) - 1 : new Date().getMonth();
      const day = dateParts.length === 3 ? parseInt(dateParts[2], 10) : new Date().getDate();

      let hour = 17;
      let minute = 0;
      if (b.eventTime) {
        const timeMatch = b.eventTime.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          hour = parseInt(timeMatch[1], 10);
          minute = parseInt(timeMatch[2], 10);
          if (b.eventTime.includes('مساءً') || b.eventTime.includes('م')) {
            if (hour < 12) hour += 12;
          } else if (b.eventTime.includes('صباحاً') || b.eventTime.includes('ص')) {
            if (hour === 12) hour = 0;
          }
        }
      }

      const start = new Date(year, month, day, hour, minute);
      const end = new Date(year, month, day, hour + 3, minute);

      const statusText = STATUS_CONFIG[b.status]?.label || 'قيد المراجعة';
      const title = `${b.clientName} [${statusText}] - ${b.eventTime || '17:00'}`;

      return {
        id: b.id,
        title,
        start,
        end,
        allDay: false,
        booking: b,
      };
    });
  }, [bookings, calendarScope]);

  // Selected booking for quick card preview
  const selectedBooking = useMemo(() => {
    if (!selectedBookingId) return null;
    return bookings.find(b => b.id === selectedBookingId) || null;
  }, [selectedBookingId, bookings]);

  // Arabic texts for react-big-calendar
  const calendarMessages = {
    allDay: 'طوال اليوم',
    previous: 'السابق',
    next: 'التالي',
    today: 'اليوم',
    month: 'عرض شهري',
    week: 'عرض أسبوعي',
    day: 'عرض يومي',
    agenda: 'جدول المواعيد',
    date: 'التاريخ',
    time: 'الوقت',
    event: 'المناسبة / الحجز',
    noEventsInRange: calendarScope === 'confirmed_only'
      ? 'لا توجد حجوزات مؤكدة في هذا النطاق الزمني.'
      : 'لا توجد حجوزات مسجلة في هذا النطاق الزمني.',
    showMore: (total: number) => `+ ${total} أخرى`,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in" dir="rtl">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-md">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black">إدارة وحجوزات المناسبات</h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{confirmedBookingsCount} مؤكد</span>
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                  {bookings.length} إجمالي
                </span>
              </div>
              <p className="text-xs text-slate-400">لوحة تحكم تفاعلية مع تقويم زمني وإحصائيات سريعة للحجوزات</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher: Calendar, Dashboard, List */}
            <div className="bg-slate-800 p-1 rounded-2xl flex items-center gap-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'dashboard'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">لوحة الإحصائيات</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">التقويم</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">البطاقات</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('tasks')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'tasks'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">قائمة المهام</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Status Toast Banner */}
        {statusNotification && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 flex items-center justify-between transition-all animate-in slide-in-from-top">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{statusNotification}</span>
            </div>
            <button 
              onClick={() => setStatusNotification(null)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick KPI Strip at the top for instant glance */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            
            {/* KPI 1: This Month Bookings */}
            <div 
              onClick={() => setViewMode('dashboard')}
              className="bg-white rounded-xl p-2.5 border border-slate-200 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">حجوزات هذا الشهر</span>
                  <span className="text-sm font-black text-slate-900">{thisMonthBookingsCount} حجز</span>
                </div>
              </div>
              <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                {format(new Date(), 'MMMM yyyy', { locale: arSA })}
              </span>
            </div>

            {/* KPI 2: Confirmed Bookings */}
            <div 
              onClick={() => {
                setViewMode('calendar');
                setCalendarScope('confirmed_only');
              }}
              className="bg-white rounded-xl p-2.5 border border-slate-200 flex items-center justify-between shadow-2xs hover:border-emerald-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">الحجوزات المؤكدة</span>
                  <span className="text-sm font-black text-emerald-700">{confirmedBookingsCount} مناسبة</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                جاهزة للتنفيذ
              </span>
            </div>

            {/* KPI 3: Total Expected Revenue */}
            <div 
              onClick={() => setViewMode('dashboard')}
              className="bg-white rounded-xl p-2.5 border border-slate-200 flex items-center justify-between shadow-2xs hover:border-amber-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">مجموع الأرباح المتوقعة</span>
                  <span className="text-sm font-black text-slate-900">{formatIQD(totalExpectedRevenue)}</span>
                </div>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                تقديري
              </span>
            </div>

            {/* KPI 4: Customer Satisfaction & Rating */}
            <div 
              onClick={() => setViewMode('dashboard')}
              className="bg-white rounded-xl p-2.5 border border-slate-200 flex items-center justify-between shadow-2xs hover:border-amber-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center font-black">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">تقييم رضا العملاء</span>
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1">
                    <span>{averageRating}</span>
                    <span className="text-xs text-amber-500">⭐</span>
                    <span className="text-[11px] text-slate-400 font-normal">({ratedBookings.length} تقييم)</span>
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                خدمة معتمدة
              </span>
            </div>

          </div>
        </div>

        {/* Sub-Header Toolbar depending on View Mode */}
        {viewMode === 'calendar' && (
          <div className="px-4 sm:px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
                <span>عرض بالتقويم:</span>
              </span>
              
              <button
                type="button"
                onClick={() => setCalendarScope('confirmed_only')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  calendarScope === 'confirmed_only'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>الحجوزات المؤكدة فقط ({confirmedBookingsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setCalendarScope('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  calendarScope === 'all'
                    ? 'bg-slate-900 text-white border-slate-950 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>جميع الحالات ({bookings.length})</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 hidden md:flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>أخضر: مؤكد</span>
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>أصفر: مراجعة</span>
              </span>
              <span className="flex items-center gap-1 text-blue-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>أزرق: مكتمل</span>
              </span>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          /* Cards List Filter Tabs */
          <div className="px-4 sm:px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 text-xs text-slate-500 ml-2 font-medium shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>تصفية:</span>
            </div>
            
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              الكل ({bookings.length})
            </button>

            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                filterStatus === 'confirmed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>مؤكد ({getStatusCount('confirmed')})</span>
            </button>

            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                filterStatus === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>قيد المراجعة ({getStatusCount('pending')})</span>
            </button>

            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                filterStatus === 'completed'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>مكتمل ({getStatusCount('completed')})</span>
            </button>

            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                filterStatus === 'cancelled'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              <XCircle className="w-3 h-3" />
              <span>ملغي ({getStatusCount('cancelled')})</span>
            </button>
          </div>
        )}

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* DASHBOARD VIEW (with recharts) */}
          {viewMode === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Top Banner with Financial Insights */}
              <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>مؤشرات أداء الحجوزات والمبيعات</span>
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">
                      {formatIQD(totalExpectedRevenue)}
                    </h3>
                    <p className="text-xs text-slate-300">
                      إجمالي المبالغ التقديرية لكافة الحجوزات النشطة (المؤكدة وقيد المراجعة).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setViewMode('calendar');
                        setCalendarScope('confirmed_only');
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>استعراض المواعيد بالتقويم</span>
                    </button>
                  </div>
                </div>

                {/* Sub Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/80 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">حجوزات هذا الشهر:</span>
                    <span className="font-black text-white text-sm">{thisMonthBookingsCount} حجز</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">المؤكدة المؤهلة:</span>
                    <span className="font-black text-emerald-400 text-sm">{confirmedBookingsCount} حجز</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">قيمة الحجوزات المؤكدة:</span>
                    <span className="font-black text-amber-300 text-sm">{formatIQD(confirmedRevenue)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">معدل إنجاز وتأكيد:</span>
                    <span className="font-black text-rose-300 text-sm">
                      {bookings.length > 0 ? Math.round((confirmedBookingsCount / bookings.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Charts Grid using Recharts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Chart 1: Recharts Pie/Donut Chart - Status Breakdown */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <PieChartIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">توزيع حالات الحجوزات</h4>
                        <span className="text-[11px] text-slate-400">نسبة الحجوزات المؤكدة والجارية</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      الإجمالي: {bookings.length}
                    </span>
                  </div>

                  {statusPieData.length === 0 ? (
                    <div className="h-56 flex items-center justify-center text-xs text-slate-400">
                      لا توجد بيانات كافية للرسم البياني
                    </div>
                  ) : (
                    <div className="h-60 w-full" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {statusPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(val: any, name: any) => [`${val} حجز`, name]}
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#334155',
                              borderRadius: '12px',
                              color: '#ffffff',
                              fontSize: '12px',
                              direction: 'rtl'
                            }}
                          />
                          <Legend 
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-xs font-bold text-slate-700 mx-1">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                    {statusPieData.map((st) => (
                      <div key={st.name} className="p-1.5 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-500 block">{st.name}</span>
                        <span className="text-xs font-black text-slate-800">{st.value} حجز</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 2: Recharts Bar Chart - Revenue by Category */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">الأرباح التقديرية حسب المناسبة</h4>
                        <span className="text-[11px] text-slate-400">القيمة المالية بآلاف الدنانير (ألف د.ع)</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      مقارنة الفئات
                    </span>
                  </div>

                  {categoryBarData.length === 0 ? (
                    <div className="h-56 flex items-center justify-center text-xs text-slate-400">
                      لا توجد بيانات كافية للرسم البياني
                    </div>
                  ) : (
                    <div className="h-60 w-full" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                            interval={0}
                          />
                          <YAxis 
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            unit=" ألف"
                          />
                          <Tooltip 
                            formatter={(val: any) => [`${new Intl.NumberFormat('ar-IQ').format(Number(val))} ألف د.ع`, 'الأرباح المتوقعة']}
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#334155',
                              borderRadius: '12px',
                              color: '#ffffff',
                              fontSize: '12px',
                              direction: 'rtl'
                            }}
                          />
                          <Bar 
                            dataKey="revenueThousands" 
                            name="الأرباح (ألف د.ع)" 
                            fill="#e11d48" 
                            radius={[6, 6, 0, 0]} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>* تُحتسب الأرباح بناءً على الباقات والخدمات الإضافية المختارة لكل مناسبة.</span>
                  </div>
                </div>

              </div>

              {/* Customer Rating & Reviews Showcase Section in Dashboard */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
                      <Award className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                        <span>تقييمات العملاء للحفلات المنجزة</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {averageRating} / 5.0 ⭐
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        ملاحظات وانطباعات العملاء الحقيقية بعد إتمام الحفلات والمناسبات
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    {ratedBookings.length} من أصل {bookings.filter(b => b.status === 'completed').length} حفل مكتمل تم تقييمه
                  </div>
                </div>

                {/* Reviews List */}
                {ratedBookings.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                    <Star className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-600 font-bold">لا توجد تقييمات مسجلة بعد</p>
                    <p className="text-[11px] text-slate-400">
                      عند تحويل حالة أي حجز إلى "مكتمل"، ستتمكن من تسجيل تقييم العميل ورأيه بالخدمة مباشرة.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ratedBookings.map((rb) => (
                      <div key={rb.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs text-slate-900">{rb.clientName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({rb.id})</span>
                          </div>
                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= (rb.review?.rating || 5)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {rb.review?.tags && rb.review.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {rb.review.tags.map((tg) => (
                              <span key={tg} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/60 text-amber-900">
                                {tg}
                              </span>
                            ))}
                          </div>
                        )}

                        {rb.review?.comment && (
                          <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200/60">
                            "{rb.review.comment}"
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-200/50">
                          <span>تاريخ التقييم: {rb.review?.createdAt}</span>
                          <button
                            type="button"
                            onClick={() => setRatingModalBooking(rb)}
                            className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer underline"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>تعديل</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons to View Calendar or Cards */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setViewMode('calendar')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <CalendarIcon className="w-4 h-4 text-rose-400" />
                  <span>الانتقال إلى التقويم الزمني للمواعيد</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <LayoutList className="w-4 h-4 text-slate-500" />
                  <span>عرض بطاقات الحجز التفصيلية</span>
                </button>
              </div>

            </div>
          )}

          {/* CALENDAR VIEW */}
          {viewMode === 'calendar' && (
            <div className="space-y-4">
              
              {/* React Big Calendar Container */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <Calendar<CalendarEventItem>
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  date={calendarDate}
                  view={calendarView}
                  onNavigate={(newDate) => setCalendarDate(newDate)}
                  onView={(newView) => setCalendarView(newView)}
                  views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
                  messages={calendarMessages}
                  style={{ height: 490 }}
                  onSelectEvent={(event) => setSelectedBookingId(event.booking.id)}
                  components={{
                    toolbar: CustomCalendarToolbar,
                  }}
                  eventPropGetter={(event) => {
                    const st = event.booking.status || 'pending';
                    const config = STATUS_CONFIG[st] || STATUS_CONFIG.pending;
                    return {
                      style: {
                        backgroundColor: config.calendarBg,
                        borderColor: config.calendarBorder,
                        color: '#ffffff',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      },
                    };
                  }}
                />
              </div>

              {/* Selected Booking Quick Card */}
              {selectedBooking ? (
                <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200">
                        {selectedBooking.id}
                      </span>
                      <h4 className="font-black text-slate-900 text-base">
                        {selectedBooking.clientName}
                      </h4>
                      <span className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 ${STATUS_CONFIG[selectedBooking.status].badgeClass}`}>
                        {React.createElement(STATUS_CONFIG[selectedBooking.status].icon, { className: "w-3.5 h-3.5" })}
                        <span>{STATUS_CONFIG[selectedBooking.status].label}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedBookingId(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer"
                      title="إغلاق المعاينة"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Interactive Status Changer in Quick Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
                        <span>تحديث حالة هذا الحجز مباشرة:</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {STATUS_CONFIG[selectedBooking.status].description}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map((st) => {
                        const stConfig = STATUS_CONFIG[st];
                        const isCurrent = selectedBooking.status === st;
                        const Icon = stConfig.icon;

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(selectedBooking.id, st)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                              isCurrent
                                ? `${stConfig.badgeClass} ring-2 ring-offset-1 font-black shadow-xs`
                                : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{stConfig.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedBooking.status === 'pending' && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50/90 border border-emerald-200 rounded-lg p-2 flex items-center justify-between gap-2 mt-2">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>جرّب النقر على زر "مؤكد" الآن لتفعيل تنبيه Toast الفوري وتأكيد الموعد!</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] shrink-0 cursor-pointer shadow-2xs transition-all hover:scale-105"
                        >
                          تأكيد الحجز فوراً ⚡
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{selectedBooking.eventDate} ({selectedBooking.eventTime})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{selectedBooking.city} - {selectedBooking.addressDetails}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">المبلغ التقديري: </span>
                      <span className="font-black text-slate-900">{formatIQD(selectedBooking.totalEstimatedPrice)}</span>
                    </div>
                  </div>

                  {selectedBooking.specialNotes && (
                    <div className="text-xs bg-white rounded-lg p-2.5 text-slate-700 border border-slate-200 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>ملاحظات الحفل: {selectedBooking.specialNotes}</span>
                    </div>
                  )}

                  {/* Rating Section for Completed Booking in Quick Card */}
                  {selectedBooking.status === 'completed' && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                          <span>تقييم جودة الخدمة ورأي العميل</span>
                        </span>
                        {selectedBooking.review ? (
                          <button
                            type="button"
                            onClick={() => setRatingModalBooking(selectedBooking)}
                            className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer underline"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>تعديل التقييم</span>
                          </button>
                        ) : null}
                      </div>

                      {selectedBooking.review ? (
                        <div className="space-y-1.5 bg-white rounded-lg p-2.5 border border-amber-200/80">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= (selectedBooking.review?.rating || 5)
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-black text-slate-800">
                              {selectedBooking.review.rating} من 5 نجوم
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({selectedBooking.review.createdAt})
                            </span>
                          </div>

                          {selectedBooking.review.tags && selectedBooking.review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {selectedBooking.review.tags.map((tg) => (
                                <span key={tg} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/70 text-amber-900">
                                  {tg}
                                </span>
                              ))}
                            </div>
                          )}

                          {selectedBooking.review.comment && (
                            <p className="text-xs text-slate-700 italic pt-1 border-t border-slate-100">
                              "{selectedBooking.review.comment}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-amber-800">
                            اكتمل الحفل بنجاح! شاركنا تقييمك ورأيك في جودة الخدمة والكادر لمساعدتنا في التميز المستمر.
                          </p>
                          <button
                            type="button"
                            onClick={() => setRatingModalBooking(selectedBooking)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shrink-0 cursor-pointer shadow-xs transition-transform hover:scale-105"
                          >
                            قيّم الخدمة الآن ⭐
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
                    <span className="text-xs text-slate-500">
                      رقم الهاتف المسجل: <span className="font-mono font-bold text-slate-800">{selectedBooking.phone}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setViewMode('tasks');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="عرض مهام هذا الحجز"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                        <span>قائمة المهام</span>
                      </button>
                      <button
                        onClick={() => openWhatsAppForBooking(selectedBooking)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>متابعة بواتساب</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من رغبتك في حذف الحجز رقم (${selectedBooking.id})؟`)) {
                            onDeleteBooking(selectedBooking.id);
                            setSelectedBookingId(null);
                          }
                        }}
                        className="p-2 rounded-xl hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="حذف الحجز"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 text-center text-xs text-slate-500">
                  💡 انقر على أي موعد في التقويم أعلاه لعرض التفاصيل وتحديث حالة الحجز أو التواصل عبر واتساب.
                </div>
              )}

            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            bookings.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">لا توجد حجوزات مسجلة حالياً</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  عند قيامك بحجز باقة أو استخدام حاسبة التكلفة، ستظهر تفاصيل حجزك ورقم المتابعة هنا في التقويم والقائمة.
                </p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-slate-600 text-sm font-bold">لا توجد حجوزات بهذه الحالة المحددة</p>
                <button
                  onClick={() => setFilterStatus('all')}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  عرض كل الحجوزات
                </button>
              </div>
            ) : (
              filteredBookings.map((b) => {
                const currentStatus = b.status || 'pending';
                const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
                const StatusIcon = config.icon;

                return (
                  <div
                    key={b.id}
                    className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-xs transition-all space-y-4"
                  >
                    {/* Card Header: Client Name, ID & Current Status Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                            {b.id}
                          </span>
                          <h4 className="font-black text-slate-900 text-base">
                            {b.clientName}
                          </h4>
                        </div>
                        <div className="text-xs text-rose-600 font-bold mt-1">
                          {b.customThemeColors && `الثيم: ${b.customThemeColors}`}
                          {b.childNameAge && ` • صاحب الحفل: ${b.childNameAge}`}
                          {b.carTypeModel && ` • السيارة: ${b.carTypeModel}`}
                          {b.universityCollege && ` • الكلية: ${b.universityCollege}`}
                        </div>
                      </div>

                      {/* Current Status Badge */}
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${config.badgeClass}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{config.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Interactive Status Updater */}
                    <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
                          <span>تحديث حالة الحجز مباشرة:</span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {config.description}
                        </span>
                      </div>

                      {/* Quick Status Action Buttons */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map((st) => {
                          const stConfig = STATUS_CONFIG[st];
                          const isCurrent = currentStatus === st;
                          const Icon = stConfig.icon;

                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStatusChange(b.id, st)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                                isCurrent
                                  ? `${stConfig.badgeClass} ring-2 ring-offset-1 font-black shadow-xs`
                                  : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5 shrink-0" />
                              <span>{stConfig.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Toast Alert Prompt for Pending Bookings */}
                      {currentStatus === 'pending' && (
                        <div className="text-[11px] text-emerald-800 bg-emerald-50/90 border border-emerald-200 rounded-lg p-2 flex items-center justify-between gap-2 mt-2">
                          <span className="flex items-center gap-1.5 font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>انقر على "مؤكد" الآن لتفعيل إشعار Toast الفوري واحتفال تأكيد الحجز!</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(b.id, 'confirmed')}
                            className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] shrink-0 cursor-pointer shadow-2xs transition-all hover:scale-105"
                          >
                            تأكيد الحجز فوراً ⚡
                          </button>
                        </div>
                      )}

                      {/* Status Visual Timeline Stepper */}
                      {currentStatus !== 'cancelled' && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200/70">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1 px-1">
                            <span className={config.stepIndex >= 1 ? 'text-amber-700' : ''}>1. استلام ومراجعة</span>
                            <span className={config.stepIndex >= 2 ? 'text-emerald-700' : ''}>2. تأكيد وتنسيق</span>
                            <span className={config.stepIndex >= 3 ? 'text-blue-700' : ''}>3. إتمام الحفل</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                config.stepIndex === 1 
                                  ? 'w-1/3 bg-amber-500' 
                                  : config.stepIndex === 2 
                                  ? 'w-2/3 bg-emerald-500' 
                                  : 'w-full bg-blue-600'
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{b.eventDate} ({b.eventTime})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{b.city} - {b.addressDetails}</span>
                      </div>
                    </div>

                    {b.specialNotes && (
                      <div className="text-xs bg-rose-50/50 rounded-lg p-2 text-slate-700 border border-rose-100 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>ملاحظات الحجز: {b.specialNotes}</span>
                      </div>
                    )}

                    {/* Customer Rating Section for Completed Bookings in List View */}
                    {currentStatus === 'completed' && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                            <span>تقييم جودة الخدمة ورأي العميل</span>
                          </span>

                          {b.review ? (
                            <button
                              type="button"
                              onClick={() => setRatingModalBooking(b)}
                              className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer underline"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>تعديل التقييم</span>
                            </button>
                          ) : null}
                        </div>

                        {b.review ? (
                          <div className="space-y-1.5 bg-white rounded-lg p-2.5 border border-amber-200/80">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center text-amber-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${
                                      s <= (b.review?.rating || 5)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-black text-slate-800">
                                {b.review.rating} من 5 نجوم
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({b.review.createdAt})
                              </span>
                            </div>

                            {b.review.tags && b.review.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {b.review.tags.map((tg) => (
                                  <span key={tg} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/70 text-amber-900">
                                    {tg}
                                  </span>
                                ))}
                              </div>
                            )}

                            {b.review.comment && (
                              <p className="text-xs text-slate-700 italic pt-1 border-t border-slate-100">
                                "{b.review.comment}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-amber-800">
                              اكتمل الحفل بنجاح! شاركنا تقييمك ورأيك في جودة الخدمة والكادر لمساعدتنا في التميز المستمر.
                            </p>
                            <button
                              type="button"
                              onClick={() => setRatingModalBooking(b)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shrink-0 cursor-pointer shadow-xs transition-transform hover:scale-105"
                            >
                              قيّم الخدمة الآن ⭐
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Footer: Price & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-500">المبلغ التقديري: </span>
                        <span className="font-black text-slate-900 text-sm">{formatIQD(b.totalEstimatedPrice)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedBookingId(b.id);
                            setViewMode('tasks');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="مهام هذا الحجز الميداني"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                          <span className="hidden sm:inline">المهام</span>
                        </button>
                        {currentStatus === 'completed' && (
                          <button
                            type="button"
                            onClick={() => setRatingModalBooking(b)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                            <span>{b.review ? 'تعديل التقييم' : 'تقييم الحجز ⭐'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => openWhatsAppForBooking(b)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>متابعة بواتساب</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من رغبتك في حذف الحجز رقم (${b.id}) من قائمتك؟`)) {
                              onDeleteBooking(b.id);
                            }
                          }}
                          className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                          title="حذف الحجز"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )
          )}

          {/* TASKS VIEW (Field Operations To-Do List) */}
          {viewMode === 'tasks' && (
            <FieldTasksTab
              bookings={bookings}
              initialBookingId={selectedBookingId}
              onOpenBookingDetails={(bId) => {
                setSelectedBookingId(bId);
                setViewMode('calendar');
              }}
            />
          )}

        </div>

      </div>

      {/* Customer Feedback & Rating Modal Dialog */}
      <BookingRatingModal
        isOpen={!!ratingModalBooking}
        onClose={() => setRatingModalBooking(null)}
        booking={ratingModalBooking}
        onSaveReview={handleSaveReview}
      />

    </div>
  );
};
