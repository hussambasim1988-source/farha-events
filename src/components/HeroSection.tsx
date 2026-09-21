import React from 'react';
import { 
  Sparkles, 
  PartyPopper, 
  Calculator, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  ArrowLeft, 
  Car, 
  GraduationCap, 
  Cake, 
  Crown, 
  HeartHandshake 
} from 'lucide-react';
import { EVENT_CATEGORIES } from '../data/farhaData';
import { EventCategory } from '../types';

interface HeroSectionProps {
  onSelectCategory: (cat: EventCategory) => void;
  onOpenCalculator: () => void;
  onOpenAIPlanner: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectCategory,
  onOpenCalculator,
  onOpenAIPlanner
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-amber-50/30 pt-8 pb-16 border-b border-rose-100">
      {/* Decorative festive blobs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>المنصة الأولى في العراق لتنظيم المناسبات السعيدة وتزيين السيارات</span>
            <span className="hidden sm:inline text-rose-400">•</span>
            <span className="hidden sm:inline font-semibold">تغطية بغداد وكافة المحافظات</span>
          </div>
        </div>

        {/* Hero Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.25] sm:leading-[1.2] mb-6">
            فرّح حبايبك.. وديكور المناسبة وتفاصيلها{' '}
            <span className="bg-gradient-to-l from-rose-600 via-pink-600 to-amber-500 bg-clip-text text-transparent underline decoration-amber-300 decoration-wavy decoration-2">
              علينــــا بالكامل
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            نحول مناسبتك إلى ذكرى استثنائية! أعياد ميلاد، ختان وطهور، حفلات تخرج، وتزيين سيارات الأعراس بأحدث أشكال البالونات والورد الطبيعي والإضاءات المودرن.
          </p>
        </div>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-14 max-w-xl mx-auto">
          <button
            onClick={onOpenCalculator}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-base shadow-lg shadow-rose-600/25 hover:shadow-xl hover:shadow-rose-600/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Calculator className="w-5 h-5 text-amber-300" />
            <span>احسب كلفة مناسبتك فوراً</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAIPlanner}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-purple-200 text-purple-900 font-bold text-base shadow-sm hover:border-purple-300 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>مستشار فرحة الذكي للأفكار</span>
          </button>
        </div>

        {/* Category Cards Quick Access */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <h2 className="text-sm uppercase tracking-wider font-bold text-slate-700">
              اختر نوع مناسبتك للاطلاع على الباقات والأسعار
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {EVENT_CATEGORIES.map((cat) => {
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    const el = document.getElementById('packages-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group bg-white rounded-2xl p-4 border border-rose-100 hover:border-rose-300 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer text-center relative overflow-hidden flex flex-col items-center justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-50 to-pink-100 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-xs">
                    {cat.id === 'birthday' && <Cake className="w-6 h-6" />}
                    {cat.id === 'circumcision' && <Crown className="w-6 h-6" />}
                    {cat.id === 'graduation' && <GraduationCap className="w-6 h-6" />}
                    {cat.id === 'car_decor' && <Car className="w-6 h-6" />}
                    {cat.id === 'wedding_engagement' && <HeartHandshake className="w-6 h-6" />}
                    {cat.id === 'baby_shower' && <PartyPopper className="w-6 h-6" />}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-700 font-medium line-clamp-1">
                    {cat.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-rose-100/70 text-center sm:text-right">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-slate-900 text-lg sm:text-xl">2,500+</div>
              <div className="text-xs text-slate-700 font-medium">مناسبة تم تنفيذها بنجاح</div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-slate-900 text-lg sm:text-xl">10+ محافظات</div>
              <div className="text-xs text-slate-700 font-medium">كادر متواجد بموقعك</div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-slate-900 text-lg sm:text-xl">100% ضمان رضا</div>
              <div className="text-xs text-slate-700 font-medium">مواد آمنة وتثبيت بلا أثر</div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-slate-900 text-lg sm:text-xl">التزام صارم</div>
              <div className="text-xs text-slate-700 font-medium">تجهيز كامل قبل الموعد</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
