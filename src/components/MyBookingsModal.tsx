import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  MessageCircle, 
  FileText, 
  CalendarCheck 
} from 'lucide-react';
import { BookingFormData } from '../types';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingFormData[];
  onDeleteBooking: (id: string) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onDeleteBooking
}) => {
  if (!isOpen) return null;

  const formatIQD = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  };

  const openWhatsAppForBooking = (b: BookingFormData) => {
    const text = encodeURIComponent(`مرحباً فرحة، أود الاستفسار عن حالة حجزي رقم (${b.id}) باسم (${b.clientName}) لتاريخ (${b.eventDate}).`);
    window.open(`https://wa.me/9647700000000?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">سجل حجوزاتي في منصة فرحة</h2>
              <p className="text-xs text-slate-400">متابعة تفاصيل ومواعيد مناسباتك المسجلة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of bookings */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">لا توجد حجوزات مسجلة حالياً</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                عند قيامك بحجز باقة أو استخدام حاسبة التكلفة، ستظهر تفاصيل حجزك ورقم المتابعة هنا.
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-slate-50 border border-slate-200 hover:border-rose-200 rounded-2xl p-4 sm:p-5 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      {b.id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-1">
                      {b.clientName}
                    </h4>
                    <div className="text-xs text-rose-600 font-bold">
                      {b.customThemeColors && `الثيم: ${b.customThemeColors}`}
                      {b.childNameAge && ` • صاحب الحفل: ${b.childNameAge}`}
                      {b.carTypeModel && ` • السيارة: ${b.carTypeModel}`}
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    مؤكد لدى الفريق
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>{b.eventDate} ({b.eventTime})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{b.city} - {b.addressDetails}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <div>
                    <span className="text-[11px] text-slate-500">المبلغ التقديري: </span>
                    <span className="font-black text-slate-900 text-sm">{formatIQD(b.totalEstimatedPrice)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openWhatsAppForBooking(b)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 fill-white" />
                      <span>متابعة بواتساب</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("هل أنت متأكد من رغبتك في حذف هذا الحجز من قائمتك؟")) {
                          onDeleteBooking(b.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
