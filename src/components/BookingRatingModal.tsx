import React, { useState, useEffect } from 'react';
import { 
  Star, 
  X, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Award, 
  ThumbsUp, 
  CalendarCheck,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookingFormData, BookingReview } from '../types';

interface BookingRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingFormData | null;
  onSaveReview: (bookingId: string, review: BookingReview) => void;
}

const QUALITY_TAGS = [
  '⏱️ التزام دقيق بالمواعيد',
  '✨ ديكور فاخر ومتقن',
  '🤝 كادر محترم ولطيف',
  '🎈 بالونات وألوان متناسقة',
  '🎵 تنظيم استثنائي',
  '💰 قيمة ممتازة مقابل السعر',
  '📸 زوايا تصوير مميزة',
  '🚗 تزيين سيارة فائق الجمال',
];

const RATING_DESCRIPTIONS: Record<number, { title: string; color: string }> = {
  1: { title: 'بحاجة لتحسين ملحوظ 😕', color: 'text-rose-500' },
  2: { title: 'مقبول ولكن هناك ملاحظات 🙂', color: 'text-amber-500' },
  3: { title: 'جيد ومناسب 👍', color: 'text-amber-600' },
  4: { title: 'ممتاز جداً ومرتب 😃', color: 'text-emerald-600' },
  5: { title: 'خدمة استثنائية وفوق التوقعات! 🌟', color: 'text-amber-500' },
};

export const BookingRatingModal: React.FC<BookingRatingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSaveReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill if editing existing review
  useEffect(() => {
    if (booking?.review) {
      setRating(booking.review.rating || 5);
      setComment(booking.review.comment || '');
      setSelectedTags(booking.review.tags || []);
    } else {
      setRating(5);
      setComment('');
      setSelectedTags(['✨ ديكور فاخر ومتقن', '⏱️ التزام دقيق بالمواعيد', '🤝 كادر محترم ولطيف']);
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.4, x: 0.5 },
        colors: ['#f59e0b', '#10b981', '#e11d48', '#3b82f6', '#8b5cf6'],
      });
    } catch (err) {
      console.log('Confetti triggered', err);
    }

    const review: BookingReview = {
      rating,
      comment: comment.trim(),
      tags: selectedTags,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveReview(booking.id, review);
    setIsSubmitting(false);
    onClose();
  };

  const activeRatingDisplay = hoverRating !== null ? hoverRating : rating;
  const ratingInfo = RATING_DESCRIPTIONS[activeRatingDisplay] || RATING_DESCRIPTIONS[5];

  return (
    <div 
      className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
              <Star className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-black flex items-center gap-1.5">
                <span>تقييم جودة الخدمة</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                  #{booking.id}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                حجز العميل: <span className="text-white font-bold">{booking.clientName}</span> ({booking.eventDate})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Rating Prompt & Stars */}
          <div className="text-center space-y-2 pb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-bold block">
              كيف تقيّم تجربتك الإجمالية مع فريق وتجهيزات فرحة؟
            </span>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = starValue <= activeRatingDisplay;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 rounded-xl hover:scale-120 active:scale-95 transition-all cursor-pointer focus:outline-hidden"
                    title={`${starValue} نجوم`}
                  >
                    <Star
                      className={`w-9 h-9 transition-colors duration-200 ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                          : 'text-slate-200 fill-slate-100 hover:text-amber-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Dynamic Star Rating Label */}
            <div className="min-h-[24px]">
              <span className={`text-xs font-black transition-all ${ratingInfo.color}`}>
                {ratingInfo.title}
              </span>
            </div>
          </div>

          {/* Quick Quality Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-rose-500" />
              <span>أبرز ما أعجبك في الخدمة (اختر ما يناسبك):</span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {QUALITY_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300 shadow-2xs font-black'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Comment Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
              <span>ملاحظاتك وكلمتك لفريق العمل (اختياري):</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تفاصيل تجربتك، رأيك في جمال الديكور، التزام الكادر، أو أي اقتراح يسعدنا..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 text-xs text-slate-800 placeholder:text-slate-400 outline-hidden transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-black flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>حفظ وإرسال التقييم ⭐</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
