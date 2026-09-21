import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Filter, 
  MessageCircle 
} from 'lucide-react';
import { PORTFOLIO_GALLERY } from '../data/farhaData';
import { EventCategory } from '../types';

interface PortfolioGalleryProps {
  onBookSpecial: () => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ onBookSpecial }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredItems = activeFilter === 'all'
    ? PORTFOLIO_GALLERY
    : PORTFOLIO_GALLERY.filter(item => item.category === activeFilter);

  return (
    <section id="gallery-section" className="py-16 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold mb-3">
            <Camera className="w-3.5 h-3.5 text-amber-700" />
            <span>معرض الأعمال الحية في العراق</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            لقطات حقيقية من مناسبات زبائننا
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            شاهد نتائج كادرنا في تزيين الصالات والمنازل والمستشفيات وسيارات الزفاف في بغداد والمحافظات.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {[
            { id: 'all', label: 'كافة الأعمال' },
            { id: 'birthday', label: 'أعياد ميلاد 🎂' },
            { id: 'car_decor', label: 'تزيين سيارات 🚗' },
            { id: 'graduation', label: 'تخرج 🎓' },
            { id: 'circumcision', label: 'ختان وطهور 👑' },
            { id: 'wedding_engagement', label: 'خطوبة وأعراس 💍' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-rose-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Photo */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Location Badge */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>{item.location}</span>
                </div>

                <div className="absolute bottom-3 right-3 left-3 text-white">
                  <h3 className="font-bold text-sm leading-snug drop-shadow-sm">{item.title}</h3>
                </div>
              </div>

              {/* Details & Review */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {item.clientReviewSnippet && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 italic flex items-start gap-2">
                    <span className="text-amber-500 font-bold text-sm">“</span>
                    <span>{item.clientReviewSnippet}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-700">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-700" />
                    {item.date}
                  </span>
                  <button
                    onClick={onBookSpecial}
                    className="font-bold text-rose-600 hover:text-rose-700 cursor-pointer flex items-center gap-1"
                  >
                    <span>طلب تصميم مشابه</span>
                    <span>←</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Event Callout */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black mb-1">
              لديك فكرة ديكور خاصة أو صورة من بنترست؟
            </h3>
            <p className="text-rose-100 text-xs sm:text-sm">
              أرسل لنا الصورة وسيقوم مهندس الديكور في فرحة بتنفيذها كما هي وبأدق التفاصيل في موقعك.
            </p>
          </div>
          <button
            onClick={() => {
              const text = encodeURIComponent("مرحباً فرحة، عندي صورة وفكرة ديكور خاصة وأريد أعرف إمكانية وتكلفة تنفيذها.");
              window.open(`https://wa.me/9647700000000?text=${text}`, '_blank');
            }}
            className="px-6 py-3.5 rounded-2xl bg-white text-rose-700 font-black text-xs sm:text-sm hover:bg-rose-50 shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>أرسل صورتك عبر واتساب</span>
          </button>
        </div>

      </div>
    </section>
  );
};
