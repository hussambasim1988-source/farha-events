import React from 'react';
import { 
  Bell, 
  Clock, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  MessageCircle, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import { BookingFormData } from '../types';
import { ReminderCheckResult, generateWhatsAppReminderMessage } from '../utils/reminderService';

interface EventReminderBannerProps {
  reminders: ReminderCheckResult[];
  onOpenBookingDetails: (bookingId: string) => void;
  onDismissReminder?: (bookingId: string) => void;
  onTestSimulate24h?: () => void;
}

export const EventReminderBanner: React.FC<EventReminderBannerProps> = ({
  reminders,
  onOpenBookingDetails,
  onDismissReminder,
  onTestSimulate24h,
}) => {
  if (reminders.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white shadow-lg border-b border-amber-300/40 relative z-30 animate-in slide-in-from-top duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Main notification header & badge */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <Bell className="w-5 h-5 text-white absolute" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-xs">
                  🔔 تذكير تلقائي (أقل من 24 ساعة)
                </span>
                <span className="text-xs text-amber-100 font-bold">
                  لديك ({reminders.length}) {reminders.length === 1 ? 'حفل مقبل خلال 24 ساعة' : 'حفلات مقبلة خلال 24 ساعة'}!
                </span>
              </div>
              <p className="text-xs text-white/90 line-clamp-1">
                يرجى التأكد من تجهيز الموقع والتواصل مع العميل لضمان الجاهزية الكاملة وتفادي أي تأخير.
              </p>
            </div>
          </div>

          {/* Cards for each 24h reminder */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {reminders.map((rem) => {
              const b = rem.booking;
              const waText = generateWhatsAppReminderMessage(b, rem.hoursRemaining);

              return (
                <div 
                  key={b.id} 
                  className="bg-white/15 backdrop-blur-md border border-white/25 rounded-xl px-3 py-2 flex items-center justify-between gap-3 text-xs w-full sm:w-auto shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-white truncate max-w-[130px]">
                        {b.clientName}
                      </span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">
                        #{b.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-amber-100 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-200" />
                        <span>متبقي: {rem.hoursRemaining > 0 ? `${rem.hoursRemaining} ساعة` : 'اليوم'}</span>
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[110px]">{b.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* View Booking Details CTA */}
                    <button
                      type="button"
                      onClick={() => onOpenBookingDetails(b.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-white text-slate-900 hover:bg-amber-50 font-black text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                      title="عرض بطاقة الحجز وجدول المهام"
                    >
                      <span>التفاصيل</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {/* WhatsApp Quick Reminder button */}
                    <a
                      href={`https://wa.me/964${b.phone.replace(/^0/, '')}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors cursor-pointer shadow-xs"
                      title="إرسال تذكير الجاهزية للعميل عبر واتساب"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                    </a>

                    {onDismissReminder && (
                      <button
                        type="button"
                        onClick={() => onDismissReminder(b.id)}
                        className="p-1 text-white/70 hover:text-white rounded hover:bg-white/10 transition-colors"
                        title="إخفاء التنبيه"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
