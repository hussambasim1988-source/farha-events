import React from 'react';
import { Star, ShieldCheck, Heart, MessageSquare } from 'lucide-react';
import { CUSTOMER_REVIEWS, WHY_FARHA_FEATURES } from '../data/farhaData';

export const CustomerReviewsSection: React.FC = () => {
  return (
    <section id="reviews-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>ثقة أكثر من 2,500 عائلة عراقية</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            ماذا يقول عملاؤنا عن تجربة "فرحة"؟
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            فرحتكم هي رأس مالنا الحقيقي، نقرأ كل كلمة ونطور خدماتنا باستمرار لنكون دائماً خياركم الأول.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {CUSTOMER_REVIEWS.map(rev => (
            <div
              key={rev.id}
              className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between transition-all"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-3 border-t border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{rev.name}</h4>
                    <span className="text-[11px] text-slate-500">{rev.city}</span>
                  </div>
                  {rev.verifiedBooking && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3" />
                      حجز مؤكد
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-rose-600 font-bold mt-1">
                  {rev.eventTitle}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Farha Grid */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-black mb-2">لماذا يفضل العراقيون منصة "فرحة"؟</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              معايير عالية نلتزم بها في كل تفصيلة لنمنحك راحة البال التامة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_FARHA_FEATURES.map((feat, i) => (
              <div key={i} className="space-y-2 text-center sm:text-right">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto sm:mr-0 sm:ml-auto">
                  <Star className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">{feat.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
