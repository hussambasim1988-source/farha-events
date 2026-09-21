import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  X, 
  Check, 
  Plus, 
  Minus, 
  Sparkles, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Info,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Cake,
  Crown,
  GraduationCap,
  Car,
  HeartHandshake,
  Baby,
  Clock,
  Flame,
  Tag
} from 'lucide-react';
import { EVENT_CATEGORIES, SERVICE_PACKAGES, ADD_ON_SERVICES, IRAQ_GOVERNORATES } from '../data/farhaData';
import { EventCategory, ServicePackage, AddOnService } from '../types';
import { analyzeSeasonalDate, SeasonalAnalysis } from '../utils/seasonalPricing';

interface InteractiveCostCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: EventCategory;
  onProceedToBooking: (bookingData: {
    category: EventCategory;
    packageItem: ServicePackage;
    selectedAddOns: AddOnService[];
    city: string;
    totalPrice: number;
    guestsCount: number;
    eventDate?: string;
    isPeakSeason?: boolean;
    seasonalSurge?: number;
  }) => void;
}

export const InteractiveCostCalculator: React.FC<InteractiveCostCalculatorProps> = ({
  isOpen,
  onClose,
  initialCategory = 'birthday',
  onProceedToBooking
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>(initialCategory);
  
  // Available packages for this category
  const categoryPackages = useMemo(() => {
    return SERVICE_PACKAGES.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    categoryPackages[0]?.id || ''
  );

  // Update selected package when category changes
  useEffect(() => {
    const pkgs = SERVICE_PACKAGES.filter(p => p.category === selectedCategory);
    if (pkgs.length > 0) {
      setSelectedPackageId(pkgs[0].id);
    }
  }, [selectedCategory]);

  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('بغداد');
  const [guestsCount, setGuestsCount] = useState<number>(25);

  // Booking Date for Seasonal Cost Forecast
  const [bookingDate, setBookingDate] = useState<string>(() => {
    // Default to the upcoming Friday to showcase the seasonal engine or 3 days ahead
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const seasonalInfo: SeasonalAnalysis = useMemo(() => {
    return analyzeSeasonalDate(bookingDate);
  }, [bookingDate]);

  const currentPackage = useMemo(() => {
    return SERVICE_PACKAGES.find(p => p.id === selectedPackageId) || categoryPackages[0];
  }, [selectedPackageId, categoryPackages]);

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOnIds(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const selectedAddOnsList = useMemo(() => {
    return ADD_ON_SERVICES.filter(a => selectedAddOnIds.includes(a.id));
  }, [selectedAddOnIds]);

  // Base Subtotal (Package + Selected Addons)
  const baseSubtotal = useMemo(() => {
    const pkgPrice = currentPackage ? currentPackage.price : 0;
    const addOnsTotal = selectedAddOnsList.reduce((sum, item) => sum + item.price, 0);
    return pkgPrice + addOnsTotal;
  }, [currentPackage, selectedAddOnsList]);

  // 15% Seasonal surge if peak (Weekend or Holiday)
  const seasonalSurgeAmount = useMemo(() => {
    return seasonalInfo.isPeak ? Math.round(baseSubtotal * 0.15) : 0;
  }, [baseSubtotal, seasonalInfo.isPeak]);

  // Final Total Price
  const totalPrice = useMemo(() => {
    return baseSubtotal + seasonalSurgeAmount;
  }, [baseSubtotal, seasonalSurgeAmount]);

  const formatIQD = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  };

  // Quick preset helper
  const setQuickDate = (targetDayOfWeek: number) => {
    const d = new Date();
    const current = d.getDay();
    let diff = targetDayOfWeek - current;
    if (diff <= 0) diff += 7;
    d.setDate(d.getDate() + diff);
    setBookingDate(d.toISOString().split('T')[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200" dir="rtl">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">حاسبة كلفة المناسبات التفاعلية</h2>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Flame className="w-3 h-3 text-rose-600 fill-rose-600" />
                  <span>توقعات الموسم الذكية</span>
                </span>
              </div>
              <p className="text-xs text-rose-100">احسب تكلفة الباقة والمؤثرات الإضافية وتوقعات الذروة الموسمية بدقة وشفافية بالدينار العراقي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Two Columns on Desktop */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Main Config Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. نوع المناسبة السعيدة:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {EVENT_CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected 
                          ? 'bg-rose-50 border-rose-600 text-rose-700 font-bold shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-rose-600">
                        {cat.id === 'birthday' && <Cake className="w-4 h-4" />}
                        {cat.id === 'circumcision' && <Crown className="w-4 h-4" />}
                        {cat.id === 'graduation' && <GraduationCap className="w-4 h-4" />}
                        {cat.id === 'car_decor' && <Car className="w-4 h-4" />}
                        {cat.id === 'wedding_engagement' && <HeartHandshake className="w-4 h-4" />}
                        {cat.id === 'baby_shower' && <Baby className="w-4 h-4" />}
                      </div>
                      <span className="text-xs">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Package selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. الباقة الأساسية:
              </label>
              <div className="space-y-2.5">
                {categoryPackages.map(pkg => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-50/70 border-rose-500 ring-1 ring-rose-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{pkg.name}</div>
                          <div className="text-[11px] text-slate-500">{pkg.tagline}</div>
                        </div>
                      </div>
                      <div className="text-left shrink-0 font-black text-rose-600 text-sm sm:text-base">
                        {formatIQD(pkg.price)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add-on Services */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>3. خدمات وإضافات مميزة (اختياري):</span>
                <span className="text-[11px] font-normal text-rose-600">اختر ما يناسب رغبتك</span>
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {ADD_ON_SERVICES.map(addon => {
                  const isSelected = selectedAddOnIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-amber-50/60 border-amber-400 ring-1 ring-amber-400' 
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800">{addon.name}</span>
                          <p className="text-[10px] text-slate-500">{addon.description}</p>
                        </div>
                      </div>
                      <div className="text-xs font-black text-slate-900 shrink-0 mr-2">
                        +{formatIQD(addon.price)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Booking Date & Seasonal Cost Forecast (الميزة المطلوبة) */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <span>4. تاريخ المناسبة وتوقعات التكلفة الموسمية:</span>
                </label>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                  seasonalInfo.isPeak
                    ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {seasonalInfo.badgeLabel}
                </span>
              </div>

              {/* Date Input with day badge */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-7">
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-rose-500 focus:ring-1 focus:ring-rose-400"
                  />
                </div>
                <div className="sm:col-span-5 bg-white rounded-xl p-2 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">يوافق تاريخياً:</span>
                  <span className="text-xs font-black text-slate-900 flex items-center justify-center gap-1">
                    <span>يوم {seasonalInfo.dayName}</span>
                    {seasonalInfo.isPeak && <span className="text-amber-500">⚡</span>}
                  </span>
                </div>
              </div>

              {/* Quick Simulation Chips to test weekends & holidays instantly */}
              <div className="flex items-center flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-bold">اختبار سريع:</span>
                <button
                  type="button"
                  onClick={() => setQuickDate(5)}
                  className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  ⚡ الجمعة (نهاية أسبوع)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(6)}
                  className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  ⚡ السبت (نهاية أسبوع)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(3)}
                  className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  🌿 الأربعاء (يوم اعتيادي)
                </button>
                <button
                  type="button"
                  onClick={() => setBookingDate('2026-10-03')}
                  className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  🇮🇶 3 تشرين (اليوم الوطني)
                </button>
              </div>

              {/* Seasonal Forecast Notification Banner */}
              {seasonalInfo.isPeak ? (
                <div className="bg-gradient-to-l from-amber-50 via-amber-50/80 to-rose-50/60 border border-amber-300 rounded-xl p-3 text-amber-950 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-xs text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{seasonalInfo.alertTitle}</span>
                    </div>
                    <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-md shadow-2xs shrink-0">
                      +15% زيادة تلقائية
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {seasonalInfo.alertMessage}
                  </p>
                  <div className="pt-1.5 border-t border-amber-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">قيمة الزيادة التقديرية المضافة (+15%):</span>
                    <span className="font-black text-amber-900 font-mono">
                      +{formatIQD(seasonalSurgeAmount)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 text-emerald-900 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-black text-xs block text-emerald-900">سعر اعتيادي قياسي (0% زيادة)</span>
                      <span className="text-[10px] text-emerald-700">التاريخ يوافق يوماً عادياً خلال الأسبوع بدون أي رسوم ذروة موسمية.</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                    أوفر سعر 🌿
                  </span>
                </div>
              )}
            </div>

            {/* Step 5: City & Guests */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>المحافظة:</span>
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-rose-500"
                >
                  {IRAQ_GOVERNORATES.map(gov => (
                    <option key={gov.name} value={gov.name}>{gov.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-rose-500" />
                  <span>عدد الضيوف المتوقع:</span>
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setGuestsCount(Math.max(5, guestsCount - 5))}
                    className="p-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center font-bold text-xs text-slate-800">
                    {guestsCount} شخص
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuestsCount(guestsCount + 5)}
                    className="p-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right / Invoice Breakdown & Action Summary */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">تفاصيل التكلفة التقديرية</h3>
              </div>

              <div className="space-y-3 mb-6 text-xs">
                {/* Main Package line */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-800">{currentPackage?.name}</div>
                    <div className="text-[11px] text-slate-500">الباقة الأساسية</div>
                  </div>
                  <span className="font-black text-slate-900">
                    {formatIQD(currentPackage?.price || 0)}
                  </span>
                </div>

                {/* Addons list */}
                {selectedAddOnsList.map(addon => (
                  <div key={addon.id} className="flex justify-between items-center text-slate-700">
                    <span className="truncate max-w-[180px]">• {addon.name}</span>
                    <span className="font-bold text-slate-800">+{formatIQD(addon.price)}</span>
                  </div>
                ))}

                {/* Subtotal line before seasonal adjustment */}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-600">
                  <span className="font-bold">المجموع الأساسي (الباقة + الإضافات):</span>
                  <span className="font-mono font-bold text-slate-800">{formatIQD(baseSubtotal)}</span>
                </div>

                {/* Seasonal Surge Line Item (الميزة المطلوبة) */}
                <div className={`p-2 rounded-xl border flex items-center justify-between transition-colors ${
                  seasonalInfo.isPeak
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                    : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1">
                      {seasonalInfo.isPeak ? (
                        <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span className="text-xs">
                        {seasonalInfo.isPeak ? 'زيادة موسمية (+15% عطلات / ذروة)' : 'تسعير موسمي اعتيادي (0%)'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {seasonalInfo.holidayName ? seasonalInfo.holidayName : `يوافق ${seasonalInfo.dayName}`}
                    </span>
                  </div>

                  <span className={`font-black ${seasonalInfo.isPeak ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {seasonalInfo.isPeak ? `+${formatIQD(seasonalSurgeAmount)}` : '0 د.ع'}
                  </span>
                </div>

                {/* Free inclusions */}
                <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px] text-emerald-700">
                  <div className="flex justify-between">
                    <span>• التوصيل والتركيب في {selectedCity}</span>
                    <span className="font-bold">مجاناً</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• كادر التنسيق الموقعي المتخصص</span>
                    <span className="font-bold">مشـمول</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Price Box & Proceed Button */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-slate-600 block">المجموع الكلي التقديري:</span>
                  {seasonalInfo.isPeak && (
                    <span className="text-[10px] text-amber-700 font-bold">شامل الزيادة الموسمية (+15%)</span>
                  )}
                </div>
                <span className="text-2xl font-black text-rose-600">
                  {formatIQD(totalPrice)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (currentPackage) {
                    onProceedToBooking({
                      category: selectedCategory,
                      packageItem: currentPackage,
                      selectedAddOns: selectedAddOnsList,
                      city: selectedCity,
                      totalPrice: totalPrice,
                      guestsCount: guestsCount,
                      eventDate: bookingDate,
                      isPeakSeason: seasonalInfo.isPeak,
                      seasonalSurge: seasonalSurgeAmount
                    });
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-sm shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>متابعة وتأكيد الحجز فوراً</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <p className="text-center text-[10px] text-slate-700 mt-2">
                لا يتم خصم أي مبالغ الآن — الدفع يتم بعد التركيب ورؤية الديكور!
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
