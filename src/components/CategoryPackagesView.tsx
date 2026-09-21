import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Clock, 
  Users, 
  ArrowLeft, 
  Tag, 
  PlusCircle, 
  Car, 
  Cake, 
  Crown, 
  GraduationCap, 
  HeartHandshake, 
  Baby 
} from 'lucide-react';
import { EVENT_CATEGORIES, SERVICE_PACKAGES, ADD_ON_SERVICES } from '../data/farhaData';
import { EventCategory, ServicePackage } from '../types';

interface CategoryPackagesViewProps {
  selectedCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  onBookPackage: (pkg: ServicePackage) => void;
  onOpenCalculatorWithCategory: (cat: EventCategory) => void;
}

export const CategoryPackagesView: React.FC<CategoryPackagesViewProps> = ({
  selectedCategory,
  onSelectCategory,
  onBookPackage,
  onOpenCalculatorWithCategory
}) => {
  const currentCategoryInfo = EVENT_CATEGORIES.find(c => c.id === selectedCategory) || EVENT_CATEGORIES[0];
  const filteredPackages = SERVICE_PACKAGES.filter(p => p.category === selectedCategory);

  const formatIQD = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  };

  return (
    <section id="packages-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>باقات متكاملة وشفافة بالدينار العراقي</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            اختر الباقة المناسبة لاحتفالك
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            جميع باقاتنا تشمل التوصيل والتركيب والتنسيق الكامل في موقعك دون أي رسوم إضافية مخفية.
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-10 gap-2 scrollbar-none">
          {EVENT_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/25 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {category.id === 'birthday' && <Cake className="w-4 h-4" />}
                {category.id === 'circumcision' && <Crown className="w-4 h-4" />}
                {category.id === 'graduation' && <GraduationCap className="w-4 h-4" />}
                {category.id === 'car_decor' && <Car className="w-4 h-4" />}
                {category.id === 'wedding_engagement' && <HeartHandshake className="w-4 h-4" />}
                {category.id === 'baby_shower' && <Baby className="w-4 h-4" />}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Highlight Banner */}
        <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 rounded-2xl p-4 sm:p-6 mb-10 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-rose-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentCategoryInfo.name} — {currentCategoryInfo.badge}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {currentCategoryInfo.shortDesc}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenCalculatorWithCategory(selectedCategory)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>تخصيص باقة وحساب التكلفة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {filteredPackages.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-3xl overflow-hidden border transition-all flex flex-col justify-between ${
                  pkg.popular
                    ? 'border-rose-400 shadow-xl ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:border-rose-200 shadow-sm hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      {pkg.badge || 'الأكثر طلباً'}
                    </span>
                  </div>
                )}

                {/* Package Image Banner */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 right-3 left-3 text-white">
                    <h4 className="text-lg font-black drop-shadow-sm">{pkg.name}</h4>
                    <p className="text-xs text-slate-200 line-clamp-1">{pkg.tagline}</p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Price Block */}
                    <div className="mb-6 p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-baseline justify-between">
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-rose-600">
                          {formatIQD(pkg.price)}
                        </div>
                        {pkg.originalPrice && (
                          <div className="text-xs text-slate-700 line-through">
                            بدلاً من {formatIQD(pkg.originalPrice)}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-100/70 px-2.5 py-1 rounded-lg">
                        شامل التركيب والتوصيل
                      </span>
                    </div>

                    {/* Suitability details */}
                    <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-rose-500" />
                        <span>{pkg.suitableFor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{pkg.estimatedHours}</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mb-6 space-y-2.5">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        ماذا تتضمن هذه الباقة:
                      </div>
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onBookPackage(pkg)}
                    className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-md shadow-rose-600/25 hover:shadow-lg'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>حجز وتأكيد هذه الباقة</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Addons Strip */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3 border border-amber-400/30">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>إضافات مميزة ومؤثرات ساحرة</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black mb-2">
              هل ترغب بإضافة مؤثرات خاصة لمناسبتك؟
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              يمكنك إضافة أي من الخدمات الإضافية أدناه مع باقتك بأسعار رمزية (دي جي، أجهزة شرار بارد، دخان، تصوير فوتوغرافي وريلز تيك توك، كيك ديزاين).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ADD_ON_SERVICES.slice(0, 4).map((addon) => (
              <div 
                key={addon.id} 
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400">
                    +{formatIQD(addon.price)}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-rose-400 flex items-center justify-center text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{addon.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {addon.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:text-right">
            <button
              onClick={() => onOpenCalculatorWithCategory(selectedCategory)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>فتح حاسبة التكلفة واختيار الإضافات خطوة بخطوة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
