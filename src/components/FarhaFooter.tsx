import React from 'react';
import { PartyPopper, Phone, Mail, MapPin, MessageCircle, Heart, Instagram } from 'lucide-react';

export const FarhaFooter: React.FC = () => {
  const openWhatsApp = () => {
    window.open('https://wa.me/9647700000000', '_blank');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white">
                <PartyPopper className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">فرحــــة</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              المنصة الأولى والوجهة الموثوقة لتنسيق وتنظيم المناسبات السعيدة في العراق. نوفر أجمل باقات أعياد الميلاد، الختان، التخرج، وتزيين سيارات الزفاف في موقعك مباشرة.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={openWhatsApp}
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                title="واتساب"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <a
                href="tel:07700000000"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                title="اتصال هاتفي"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">خدماتنا الرئيسية</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#packages-section" className="hover:text-rose-400 transition-colors">تنظيم أعياد ميلاد الأطفال والكبار</a></li>
              <li><a href="#packages-section" className="hover:text-rose-400 transition-colors">حفلات الختان والطهور التراثية</a></li>
              <li><a href="#packages-section" className="hover:text-rose-400 transition-colors">تنسيق استيج وبوسترات التخرج</a></li>
              <li><a href="#packages-section" className="hover:text-rose-400 transition-colors">تزيين سيارات الأعراس بالورد الطبيعي</a></li>
              <li><a href="#packages-section" className="hover:text-rose-400 transition-colors">أجهزة الشرار البارد والدخان والدي جي</a></li>
            </ul>
          </div>

          {/* Iraqi Coverage */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">التغطية الميدانية في العراق</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              فرقنا الميدانية جاهزة للوصول إلى منازلكم وقاعاتكم في:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['بغداد (الكرخ والرصافة)', 'البصرة', 'أربيل', 'النجف الأشرف', 'كربلاء المقدسة', 'بابل', 'نينوى', 'السليمانية', 'ديالى', 'الأنبار'].map((city, idx) => (
                <span key={idx} className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800">
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">التواصل والحجوزات</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-500" />
                <span dir="ltr">+964 770 000 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>واتساب متاح على مدار الساعة (24/7)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>بغداد - المنصور / الكرادة</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة فرحة العراق (Farha Events).
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>صُنع بحب في العراق لرسم الفرحة على وجوهكم</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
};
