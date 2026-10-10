import React, { useMemo } from 'react';
import { 
  X, 
  PieChart as PieChartIcon, 
  Coins, 
  Sparkles, 
  Package, 
  PlusCircle, 
  TrendingUp, 
  Receipt,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { BookingFormData } from '../types';
import { SERVICE_PACKAGES, ADD_ON_SERVICES } from '../data/farhaData';

interface BookingCostBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingFormData | null;
}

export const BookingCostBreakdownModal: React.FC<BookingCostBreakdownModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  if (!isOpen || !booking) return null;

  // Format currency in IQD
  const formatIQD = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  };

  // Find selected package
  const matchedPackage = useMemo(() => {
    return SERVICE_PACKAGES.find(p => p.id === booking.packageId);
  }, [booking.packageId]);

  // Calculate costs breakdown:
  // 1. Base Package Price
  // 2. Add-Ons total Price
  // 3. Seasonal / Demand Adjustment or Custom Additions
  const breakdown = useMemo(() => {
    const packagePrice = matchedPackage ? matchedPackage.price : Math.round(booking.totalEstimatedPrice * 0.7);

    // Calculate sum of add-ons
    const selectedAddOns = (booking.selectedAddOnIds || []).map(id => {
      const found = ADD_ON_SERVICES.find(a => a.id === id);
      return {
        id,
        name: found ? found.name : 'إضافة مخصصة',
        price: found ? found.price : 50000,
      };
    });

    const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);

    // Seasonal / Custom Demand fee difference (if total exceeds package + addOns or minimum buffer)
    const baseSum = packagePrice + addOnsTotal;
    const seasonalDifference = Math.max(0, booking.totalEstimatedPrice - baseSum);

    // If seasonalDifference is 0 but booking total is already calculated, adjust proportionally
    let packagePart = packagePrice;
    let addOnsPart = addOnsTotal;
    let seasonalPart = seasonalDifference;

    if (seasonalPart === 0 && booking.totalEstimatedPrice > packagePart && addOnsPart === 0) {
      // Small buffer for peak hours / weekend seasonal demand
      seasonalPart = Math.round(booking.totalEstimatedPrice * 0.1);
      packagePart = booking.totalEstimatedPrice - seasonalPart;
    }

    const data = [
      {
        name: 'الباقة الأساسية',
        value: packagePart,
        color: '#e11d48', // rose-600
        description: matchedPackage?.name || 'باقة الحفل المختارة',
      },
      {
        name: 'الخدمات الإضافية',
        value: addOnsPart > 0 ? addOnsPart : 0,
        color: '#8b5cf6', // violet-500
        description: `${selectedAddOns.length} إضافات وتجهيزات تكميلية`,
      },
      {
        name: 'الرسوم الموسمية والتنسيق',
        value: seasonalPart > 0 ? seasonalPart : Math.round(booking.totalEstimatedPrice * 0.05),
        color: '#f59e0b', // amber-500
        description: 'أوقات الذروة والمواسم والإشراف الميداني',
      },
    ].filter(item => item.value > 0);

    return {
      data,
      packagePart,
      addOnsPart,
      seasonalPart,
      selectedAddOns,
      total: booking.totalEstimatedPrice,
    };
  }, [booking, matchedPackage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
              <PieChartIcon className="w-5 h-5 text-rose-100" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">توزيع تكاليف الحجز</h3>
              <p className="text-xs text-rose-100">
                حجز رقم: <span className="font-mono font-bold">{booking.id}</span> • {booking.clientName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Total Price Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">إجمالي تكلفة الحجز التقديرية</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {formatIQD(booking.totalEstimatedPrice)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
              <Receipt className="w-4 h-4 text-rose-500" />
              <span>مفصل بصرياً</span>
            </div>
          </div>

          {/* Recharts Pie Chart Visual Breakdown */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3">
            <h4 className="text-xs font-black text-slate-800 text-center mb-1">
              النسبة المئوية لكل بند من بنود الفاتورة
            </h4>

            <div className="h-56 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {breakdown.data.map((entry, index) => (
                      <Cell key={`cost-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [formatIQD(Number(val)), name]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      direction: 'rtl',
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
          </div>

          {/* Detailed Itemized List */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-700 block">تفاصيل البنود والخدمات:</span>

            {/* 1. Base Package */}
            <div className="p-3 rounded-xl border border-rose-200/80 bg-rose-50/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    {matchedPackage ? matchedPackage.name : 'الباقة الأساسية'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    تشمل الديكورات، التجهيزات، وفريق العمل الميداني
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-rose-700 font-mono shrink-0">
                {formatIQD(breakdown.packagePart)}
              </span>
            </div>

            {/* 2. Add-Ons */}
            {breakdown.addOnsPart > 0 && (
              <div className="p-3 rounded-xl border border-violet-200/80 bg-violet-50/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                      <PlusCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block">الخدمات الإضافية المختارة</span>
                      <span className="text-[10px] text-slate-500">
                        عدد الإضافات: {breakdown.selectedAddOns.length} خدمة
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-violet-700 font-mono shrink-0">
                    {formatIQD(breakdown.addOnsPart)}
                  </span>
                </div>

                {/* Sub list of add-ons */}
                <div className="pt-1.5 border-t border-violet-100/70 space-y-1">
                  {breakdown.selectedAddOns.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between text-[11px] text-slate-600 px-1">
                      <span>• {addon.name}</span>
                      <span className="font-mono text-slate-500">{formatIQD(addon.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Seasonal / Demand */}
            {breakdown.seasonalPart > 0 && (
              <div className="p-3 rounded-xl border border-amber-200/80 bg-amber-50/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">رسوم التنسيق والمواسم</span>
                    <span className="text-[10px] text-slate-500">
                      رسوم النقل والتجهيز السريع وضريبة أوقات الذروة
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-700 font-mono shrink-0">
                  {formatIQD(breakdown.seasonalPart)}
                </span>
              </div>
            )}
          </div>

          {/* Info Hint */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              جميع التكاليف تقديرية وقد يطبق خصم العروض الموسمية عند تثبيت ودفع العربون النهائي.
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
