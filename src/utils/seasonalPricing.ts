// Iraq & Middle East Holiday and Seasonal Pricing Utility

export interface SeasonalAnalysis {
  date: string;
  dayName: string;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName: string | null;
  isPeak: boolean;
  surgeRate: number; // 0.15 or 0
  surgePercentage: number; // 15 or 0
  badgeLabel: string;
  alertTitle: string;
  alertMessage: string;
}

// Fixed recurring holidays (MM-DD)
const FIXED_HOLIDAYS: Record<string, string> = {
  '01-01': 'عطلة رأس السنة الميلادية الجديدة 🎆',
  '01-06': 'عيد الجيش العراقي الباسل 🎖️',
  '03-21': 'أعياد نوروز والربيع 🌸',
  '05-01': 'عيد العمال العالمي 🛠️',
  '07-14': 'ذكرى تأسيس جمهورية العراق (14 تموز) 🇮🇶',
  '10-03': 'اليوم الوطني لجمهورية العراق 🇮🇶',
  '12-10': 'يوم النصر الوطني الكبير ✌️',
  '12-25': 'عطلة عيد الميلاد المجيد 🎄',
};

// Variable / Hijri holidays mapped to specific dates (YYYY-MM-DD)
const MOVABLE_HOLIDAYS: Record<string, string> = {
  // 2025
  '2025-03-30': 'عطلة عيد الفطر المبارك 🌙',
  '2025-03-31': 'عطلة عيد الفطر المبارك 🌙',
  '2025-04-01': 'عطلة عيد الفطر المبارك 🌙',
  '2025-06-06': 'عطلة عيد الأضحى المبارك 🐑',
  '2025-06-07': 'عطلة عيد الأضحى المبارك 🐑',
  '2025-06-08': 'عطلة عيد الأضحى المبارك 🐑',
  '2025-06-09': 'عطلة عيد الأضحى المبارك 🐑',
  '2025-06-26': 'رأس السنة الهجرية 1447 🕌',
  '2025-07-05': 'يوم عاشوراء 🕊️',
  '2025-09-04': 'المولد النبوي الشريف 🌟',

  // 2026
  '2026-03-19': 'عطلة عيد الفطر المبارك 🌙',
  '2026-03-20': 'عطلة عيد الفطر المبارك 🌙',
  '2026-03-21': 'عطلة عيد الفطر المبارك وأعياد نوروز 🌸',
  '2026-03-22': 'عطلة عيد الفطر المبارك 🌙',
  '2026-05-26': 'عطلة عيد الأضحى المبارك (يوم عرفة) 🕋',
  '2026-05-27': 'عطلة عيد الأضحى المبارك 🐑',
  '2026-05-28': 'عطلة عيد الأضحى المبارك 🐑',
  '2026-05-29': 'عطلة عيد الأضحى المبارك 🐑',
  '2026-06-16': 'رأس السنة الهجرية 1448 🕌',
  '2026-06-25': 'يوم عاشوراء 🕊️',
  '2026-08-25': 'المولد النبوي الشريف 🌟',

  // 2027
  '2027-03-09': 'عطلة عيد الفطر المبارك 🌙',
  '2027-03-10': 'عطلة عيد الفطر المبارك 🌙',
  '2027-03-11': 'عطلة عيد الفطر المبارك 🌙',
  '2027-05-16': 'عطلة عيد الأضحى المبارك 🐑',
  '2027-05-17': 'عطلة عيد الأضحى المبارك 🐑',
  '2027-05-18': 'عطلة عيد الأضحى المبارك 🐑',
};

const ARABIC_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export function analyzeSeasonalDate(dateInput: string | Date): SeasonalAnalysis {
  let dateObj: Date;
  let dateStr = '';

  if (typeof dateInput === 'string') {
    dateStr = dateInput.split('T')[0];
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      dateObj = new Date(dateInput);
    }
  } else {
    dateObj = dateInput;
    dateStr = dateObj.toISOString().split('T')[0];
  }

  const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
  const dayName = ARABIC_DAYS[dayOfWeek] || 'اليوم المحدد';
  
  // In Iraq & the Middle East, Friday (5) & Saturday (6) are weekends
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

  // Check month-day (MM-DD)
  const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dayOfMonthStr = String(dateObj.getDate()).padStart(2, '0');
  const mmDd = `${monthStr}-${dayOfMonthStr}`;

  let holidayName: string | null = null;

  if (MOVABLE_HOLIDAYS[dateStr]) {
    holidayName = MOVABLE_HOLIDAYS[dateStr];
  } else if (FIXED_HOLIDAYS[mmDd]) {
    holidayName = FIXED_HOLIDAYS[mmDd];
  }

  const isHoliday = !!holidayName;
  const isPeak = isWeekend || isHoliday;
  const surgeRate = isPeak ? 0.15 : 0;
  const surgePercentage = isPeak ? 15 : 0;

  let badgeLabel = 'يوم اعتيادي (بدون زيادة)';
  let alertTitle = 'تسعير قياسي مخفض';
  let alertMessage = 'التاريخ يوافق يوماً عادياً خلال الأسبوع بدون أي رسوم ذروة أو زيادات موسمية.';

  if (isHoliday && isWeekend) {
    badgeLabel = `عطلة رسمية + نهاية أسبوع (+15%)`;
    alertTitle = `⚡ موسم ذروة استثنائي: ${holidayName} وعطلة نهاية الأسبوع (${dayName})`;
    alertMessage = `يصادف تاريخ حجزك عطلة رسمية ونهاية أسبوع تشهد إقبالاً وحجوزات فائقة. تم تطبيق الزيادة الموسمية التلقائية (+15%) لضمان أولوية التجهيز وتأمين طاقم العمل المتخصص.`;
  } else if (isHoliday) {
    badgeLabel = `عطلة رسمية (+15%)`;
    alertTitle = `⚡ موسم ذروة وعطلة رسمية: ${holidayName}`;
    alertMessage = `يصادف تاريخ مناسبتك عطلة رسمية وموسم احتفالات مزدحم. تم تطبيق زيادة موسمية تقديرية بنسبة 15% لضمان حجز المعدات وتثبيت الكادر في أيام العطلات.`;
  } else if (isWeekend) {
    badgeLabel = `عطلة نهاية الأسبوع (${dayName}) (+15%)`;
    alertTitle = `⚡ نهاية الأسبوع (${dayName}) - موسم ذروة وإقبال مرتفع (+15%)`;
    alertMessage = `تعتبر عطلة نهاية الأسبوع (${dayName}) فترة الذروة الأولى لحفلات الأعراس وأعياد الميلاد وتخضع لزيادة موسمية بنسبة 15% لتغطية دوام فرق التركيب والتصوير الإضافية.`;
  }

  return {
    date: dateStr,
    dayName,
    isWeekend,
    isHoliday,
    holidayName,
    isPeak,
    surgeRate,
    surgePercentage,
    badgeLabel,
    alertTitle,
    alertMessage,
  };
}
