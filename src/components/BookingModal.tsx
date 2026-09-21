import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Sparkles, 
  MessageCircle, 
  Car, 
  Cake, 
  Palette, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { IRAQ_GOVERNORATES } from '../data/farhaData';
import { EventCategory, ServicePackage, AddOnService, BookingFormData } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageItem: ServicePackage | null;
  selectedAddOns: AddOnService[];
  initialCity?: string;
  initialGuestsCount?: number;
  onBookingSuccess: (booking: BookingFormData) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  packageItem,
  selectedAddOns,
  initialCity = 'بغداد',
  initialGuestsCount = 25,
  onBookingSuccess
}) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(initialCity);
  const [district, setDistrict] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [eventDate, setEventDate] = useState(() => {
    // Default to 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [eventTime, setEventTime] = useState('06:00 مساءً');
  const [specialNotes, setSpecialNotes] = useState('');
  const [customColors, setCustomColors] = useState('ذهبي وأبيض عاجي');
  const [celebrantName, setCelebrantName] = useState('');
  const [carType, setCarType] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  if (!isOpen || !packageItem) return null;

  const currentGov = IRAQ_GOVERNORATES.find(g => g.name === city) || IRAQ_GOVERNORATES[0];
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalEstimated = packageItem.price + addOnsTotal;

  const formatIQD = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  };

  const handleSaveLocally = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim()) {
      alert("يرجى ملء الاسم الكامل ورقم الهاتف");
      return;
    }

    const bookingId = `FARHA-IQ-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: BookingFormData = {
      id: bookingId,
      clientName,
      phone,
      city,
      addressDetails: `${district} - ${addressDetails}`,
      eventType: packageItem.category,
      packageId: packageItem.id,
      eventDate,
      eventTime,
      guestsCount: initialGuestsCount,
      selectedAddOnIds: selectedAddOns.map(a => a.id),
      customThemeColors: customColors,
      carTypeModel: carType,
      childNameAge: celebrantName,
      specialNotes,
      totalEstimatedPrice: totalEstimated,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    onBookingSuccess(newBooking);
    setConfirmedBookingId(bookingId);
    setIsSubmitted(true);
  };

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim()) {
      alert("يرجى كتابة الاسم ورقم الهاتف لإرسال الحجز");
      return;
    }

    const bookingId = `FARHA-IQ-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Construct rich message for WhatsApp
    const msg = `🎉 *طلب حجز جديد من منصة فرحة (العراق)* 🎉
----------------------------------------
📌 *رقم الحجز المرجعي*: ${bookingId}
👤 *اسم العميل*: ${clientName}
📞 *رقم الهاتف*: ${phone}
📍 *الموقع*: ${city} / ${district || 'حسب الاتفاق'} (${addressDetails || 'البيت/القاعة'})
🗓️ *تاريخ المناسبة*: ${eventDate} (${eventTime})
🎈 *نوع الحفل*: ${packageItem.name}
${celebrantName ? `👑 *اسم صاحب المناسبة*: ${celebrantName}\n` : ''}${carType ? `🚗 *نوع وموديل السيارة*: ${carType}\n` : ''}🎨 *الألوان والثيم المطلوب*: ${customColors}
✨ *الخدمات الإضافية المختارة*:
${selectedAddOns.length > 0 ? selectedAddOns.map(a => `   - ${a.name} (${formatIQD(a.price)})`).join('\n') : '   - بدون إضافات'}
📝 *ملاحظات خاصة*: ${specialNotes || 'لا توجد'}
----------------------------------------
💰 *المجموع التقديري*: ${formatIQD(totalEstimated)}
(شامل التوصيل والتنسيق والتركيب في الموقع)
----------------------------------------
أرجو التواصل لتأكيد التفاصيل النهائية. شكراً لكم!`;

    // Also record locally
    const newBooking: BookingFormData = {
      id: bookingId,
      clientName,
      phone,
      city,
      addressDetails: `${district} - ${addressDetails}`,
      eventType: packageItem.category,
      packageId: packageItem.id,
      eventDate,
      eventTime,
      guestsCount: initialGuestsCount,
      selectedAddOnIds: selectedAddOns.map(a => a.id),
      customThemeColors: customColors,
      carTypeModel: carType,
      childNameAge: celebrantName,
      specialNotes,
      totalEstimatedPrice: totalEstimated,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    onBookingSuccess(newBooking);

    const whatsappUrl = `https://wa.me/9647700000000?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');

    setConfirmedBookingId(bookingId);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-600 to-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black">حجز وتأكيد مناسبتك في فرحة</h2>
              <p className="text-xs text-rose-100">خطوة واحدة ويكون فريق التنسيق في خدمتك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">
                ألف مبروك! تم تسجيل حجزك بنجاح
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                تم حفظ بيانات الحجز برقم مرجعي وتوجيهها لفريق التنسيق. سنتواصل معك هاتفياً أو عبر واتساب لتأكيد توقيت الوصول وترتيب كافة التفاصيل.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>رقم الحجز المرجعي:</span>
                <span className="font-mono font-bold text-slate-900">{confirmedBookingId}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>الباقة المختارة:</span>
                <span className="font-bold text-rose-600">{packageItem.name}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>المبلغ الكلي:</span>
                <span className="font-black text-slate-900">{formatIQD(totalEstimated)}</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm cursor-pointer"
              >
                إغلاق والعودة للموقع
              </button>
            </div>
          </div>
        ) : (
          <form className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Selected Package Banner */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">الباقة المختارة:</span>
                <div className="font-black text-slate-900 text-base">{packageItem.name}</div>
                {selectedAddOns.length > 0 && (
                  <div className="text-xs text-slate-500">
                    + {selectedAddOns.length} خدمات إضافية ({selectedAddOns.map(a => a.name).join('، ')})
                  </div>
                )}
              </div>
              <div className="text-left font-black text-rose-600 text-lg">
                {formatIQD(totalEstimated)}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-rose-500" />
                  <span>الاسم الكامل للعميل *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حسام البصري"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-rose-500" />
                  <span>رقم الهاتف (واتساب) *</span>
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="0770xxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs text-right bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-rose-500"
                />
              </div>
            </div>

            {/* Location info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>المحافظة *</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setDistrict('');
                  }}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-rose-500"
                >
                  {IRAQ_GOVERNORATES.map(gov => (
                    <option key={gov.name} value={gov.name}>{gov.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المنطقة أو الحي:
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-rose-500"
                >
                  <option value="">اختر المنطقة</option>
                  {currentGov.districts.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تفاصيل العنوان أو اسم القاعة:
              </label>
              <input
                type="text"
                placeholder="اسم الشارع، أقرب نقطة دالة، أو اسم الصالة"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-rose-500"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  <span>تاريخ المناسبة *</span>
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>وقت بدء المناسبة *</span>
                </label>
                <select
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-rose-500"
                >
                  <option value="03:00 عصراً">03:00 عصراً</option>
                  <option value="05:00 عصراً">05:00 عصراً</option>
                  <option value="06:00 مساءً">06:00 مساءً</option>
                  <option value="07:00 مساءً">07:00 مساءً</option>
                  <option value="08:00 مساءً">08:00 مساءً</option>
                  <option value="11:00 صباحاً (مناسبات صباحية)">11:00 صباحاً (مناسبات صباحية)</option>
                </select>
              </div>
            </div>

            {/* Dynamic fields based on event type */}
            {packageItem.category === 'car_decor' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-rose-500" />
                  <span>نوع وموديل ولون السيارة:</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: رينج روفر 2025 أبيض، أو كاديلاك، أو سوناتا"
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-rose-500"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Cake className="w-3.5 h-3.5 text-rose-500" />
                    <span>اسم صاحب المناسبة (للطباعة على البوستر):</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: علي، الأميرة نور، الدكتور أحمد"
                    value={celebrantName}
                    onChange={(e) => setCelebrantName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-rose-500" />
                    <span>الألوان أو الثيم المفضل:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: كحلي وذهبي، وردي وأبيض، ميكي ماوس"
                    value={customColors}
                    onChange={(e) => setCustomColors(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-rose-500"
                  />
                </div>
              </div>
            )}

            {/* Special notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ملاحظات أو طلبات إضافية لفريق التنسيق:
              </label>
              <textarea
                rows={2}
                placeholder="أي طلب خاص بالتجهيز، نوع الموسيقى، طريقة تقديم الكيك..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-rose-500"
              />
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSendViaWhatsApp}
                className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>إرسال وتأكيد مباشر عبر واتساب</span>
              </button>

              <button
                type="button"
                onClick={handleSaveLocally}
                className="py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>حفظ الحجز بالموقع</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
