import { BookingFormData, FieldTaskItem, TaskStage, TaskPriority } from '../types';

/**
 * Generates an automated, contextual list of field preparation & execution tasks
 * specifically tailored to the event category, selected add-ons, and booking details.
 */
export function generateAutoTasksForBooking(booking: BookingFormData): FieldTaskItem[] {
  const tasks: FieldTaskItem[] = [];
  const bId = booking.id;

  // 1. Universal Pre-departure Logistical Task
  tasks.push({
    id: `${bId}-prep-contact`,
    bookingId: bId,
    title: `الاتصال بالعميل (${booking.clientName}) لتأكيد موعد الوصول وتفاصيل العنوان الدقيق (${booking.city} - ${booking.addressDetails})`,
    categoryTag: 'التنسيق والاتصال',
    stage: 'before_departure',
    priority: 'high',
    completed: false,
    assignedRole: 'مشرف الميدان'
  });

  // 2. Category-Specific Task Generation
  switch (booking.eventType) {
    case 'birthday':
      tasks.push(
        {
          id: `${bId}-bday-balloons`,
          bookingId: bId,
          title: `إعداد وتنسيق قوس بالونات الباستيل الملوكي بالألوان المطلوبة (${booking.customThemeColors || 'ثيم العيد المختارة'}) والمعالجة ضد الحرارة`,
          categoryTag: 'إعداد الزينة والبالونات',
          stage: 'before_departure',
          priority: 'high',
          completed: false,
          assignedRole: 'فريق الديكور'
        },
        {
          id: `${bId}-bday-backdrop`,
          bookingId: bId,
          title: `تجهيز ستاند وخلفية التصوير 3D مع لافتة الاسم${booking.childNameAge ? ` (${booking.childNameAge})` : ''}`,
          categoryTag: 'إعداد الزينة والبالونات',
          stage: 'before_departure',
          priority: 'high',
          completed: false,
          assignedRole: 'فريق الديكور'
        },
        {
          id: `${bId}-bday-cake`,
          bookingId: bId,
          title: `فحص واستلام كيكة عيد الميلاد الطازجة والتأكد من مطابقة الاسم والعمر وسلامة التزيين`,
          categoryTag: 'تجهيز الكيك والحلويات',
          stage: 'before_departure',
          priority: 'high',
          completed: false,
          assignedRole: 'مسؤول المأكولات'
        },
        {
          id: `${bId}-bday-table`,
          bookingId: bId,
          title: `تركيب طاولة الكيك الأكريليك الشفافة وتنسيق ستاندات الضيافة والشموع العطرية`,
          categoryTag: 'التجهيز الموقعي',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'منسق الموقع'
        },
        {
          id: `${bId}-bday-lighting`,
          bookingId: bId,
          title: `توصيل واختبار إضاءات الـ LED الدافئة وركن تصوير الأطفال التذكاري`,
          categoryTag: 'المؤثرات والإضاءة',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'فني الإضاءة'
        },
        {
          id: `${bId}-bday-kids-show`,
          bookingId: bId,
          title: `تأكيد وصول المهرج / الشخصيات الكرتونية وفحص جهاز الفقاعات وجهاز الصوت الصغير`,
          categoryTag: 'الفقرات والترفيه',
          stage: 'during_event',
          priority: 'medium',
          completed: false,
          assignedRole: 'منسق الفقرات'
        }
      );
      break;

    case 'car_decor':
      tasks.push(
        {
          id: `${bId}-car-inspect`,
          bookingId: bId,
          title: `فحص نظافة وتلميع هيكل السيارة الخارجي${booking.carTypeModel ? ` (${booking.carTypeModel})` : ''} والتأكد من جفاف طلاء السيارة`,
          categoryTag: 'فحص السيارة والهيكل',
          stage: 'before_departure',
          priority: 'high',
          completed: false,
          assignedRole: 'فني تزيين السيارات'
        },
        {
          id: `${bId}-car-hood-flower`,
          bookingId: bId,
          title: `تثبيت باقة غطاء المحرك الكبرى (ورد جوري طبيعي) باستخدام القواعد المغناطيسية السيليكونية الآمنة 100%`,
          categoryTag: 'إعداد الزينة والورد',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'فني تزيين السيارات'
        },
        {
          id: `${bId}-car-handles`,
          bookingId: bId,
          title: `ربط أشرطة الساتان الإيطالي وباقات الورد الصغيرة على مقابض الأبواب الأربعة والمرايا الجانبية`,
          categoryTag: 'إعداد الزينة والورد',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'فني تزيين السيارات'
        },
        {
          id: `${bId}-car-backplate`,
          bookingId: bId,
          title: `تثبيت لوحة الزفاف الخلفية المخصصة بأسماء العروسين وتاريخ المناسبة مع إكليل الورد`,
          categoryTag: 'إعداد الزينة والورد',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'فني تزيين السيارات'
        },
        {
          id: `${bId}-car-scent-bouquet`,
          bookingId: bId,
          title: `التعطير الفرنسي الفاخر لكبينة السيارة وتسليم مسكة العروس الطبيعية (المهداة)`,
          categoryTag: 'اللمسات النهائية',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'مشرف الميدان'
        },
        {
          id: `${bId}-car-speed-test`,
          bookingId: bId,
          title: `اختبار ثبات الزينة على سرعة سير معتدلة والتسليم الرسمي للعريس/العميل`,
          categoryTag: 'الفحص والتسليم',
          stage: 'during_event',
          priority: 'high',
          completed: false,
          assignedRole: 'مشرف الميدان'
        }
      );
      break;

    case 'graduation':
      tasks.push(
        {
          id: `${bId}-grad-poster`,
          bookingId: bId,
          title: `طباعة وفحص بوستر التخرج العملاق وشعار الكلية${booking.universityCollege ? ` (${booking.universityCollege})` : ''} بدقة عالية`,
          categoryTag: 'الطباعة واللوحات',
          stage: 'before_departure',
          priority: 'high',
          completed: false,
          assignedRole: 'مسؤول الطباعة'
        },
        {
          id: `${bId}-grad-stage`,
          bookingId: bId,
          title: `تركيب الاستيج الملوكي الرخامي وتمديد الممر الرئاسي (Red Carpet) في موقع الحفل`,
          categoryTag: 'إعداد الاستيج والمسرح',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'فريق الاستيج'
        },
        {
          id: `${bId}-grad-sparkulars`,
          bookingId: bId,
          title: `تركيب ماكينات الشرار البارد (Sparkulars) اللاسلكية وفحص كمية الباودر الآمن وبطاريات الريموت`,
          categoryTag: 'المؤثرات والإضاءة',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'فني المؤثرات'
        },
        {
          id: `${bId}-grad-sound`,
          bookingId: bId,
          title: `ضبط الساوند سيستم والميكروفونات اللاسلكية وتجهيز مقطوعة التكريم وأغاني التخرج الحماسية`,
          categoryTag: 'الصوتيات والدي جي',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'مهندس الصوت'
        },
        {
          id: `${bId}-grad-rosettes`,
          bookingId: bId,
          title: `ترتيب باقات ورد التكريم والوشاح المذهب وقبعات التخرج على منصة التكريم`,
          categoryTag: 'الضيافة والتكريم',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'منسق الحفل'
        },
        {
          id: `${bId}-grad-fire-cue`,
          bookingId: bId,
          title: `إطلاق مؤثرات الشرار البارد والليزر بالتزامن التام مع لحظة رمي القبعات وتكريم الخريج`,
          categoryTag: 'المؤثرات الميدانية',
          stage: 'during_event',
          priority: 'high',
          completed: false,
          assignedRole: 'فني المؤثرات'
        }
      );
      break;

    case 'circumcision':
      tasks.push(
        {
          id: `${bId}-circ-throne`,
          bookingId: bId,
          title: `تجهيز ونقل كوشة وعرش الختان التراثي المطرز بالمخمل الكحلي والذهب`,
          categoryTag: 'تجهيز الكوشة التراثية',
          stage: 'before_departure',
          priority: 'high',
          completed: false,
          assignedRole: 'فريق الديكور'
        },
        {
          id: `${bId}-circ-henna-pot`,
          bookingId: bId,
          title: `تجهيز طاسة الحنة النحاسية المنقوشة يدوياً وسيف العباس التراثي ومباخر العود والجاوي`,
          categoryTag: 'المقتنيات التراثية',
          stage: 'before_departure',
          priority: 'high',
          completed: false,
          assignedRole: 'مسؤول التراث'
        },
        {
          id: `${bId}-circ-outfit`,
          bookingId: bId,
          title: `كي وتجهيز بشت وعباءة الطفل المطرزة${booking.childNameAge ? ` (${booking.childNameAge})` : ''} مع التاج الملكي`,
          categoryTag: 'أزياء الحفل',
          stage: 'before_departure',
          priority: 'medium',
          completed: false,
          assignedRole: 'منسق الحفل'
        },
        {
          id: `${bId}-circ-arches`,
          bookingId: bId,
          title: `تركيب أقواس البالونات الكروم والأعمدة المضيئة عند مدخل الاستقبال والجلسة العربية`,
          categoryTag: 'إعداد الزينة والبالونات',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'فريق البالونات'
        },
        {
          id: `${bId}-circ-treats`,
          bookingId: bId,
          title: `تجهيز صواني توزيعات الحنة والحلويات التراثية وتجهيز المبخرة بـ عود كمبودي فاخر للضيوف`,
          categoryTag: 'الضيافة والتقديم',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'مسؤول الضيافة'
        },
        {
          id: `${bId}-circ-ceremony`,
          bookingId: bId,
          title: `تنسيق طقوس وضع الحنة على يد الطفل وزفة الطهور مع الأهالي والمهنئين`,
          categoryTag: 'إدارة المراسم',
          stage: 'during_event',
          priority: 'high',
          completed: false,
          assignedRole: 'مشرف الحفل'
        }
      );
      break;

    case 'wedding_engagement':
      tasks.push(
        {
          id: `${bId}-wed-flowers`,
          bookingId: bId,
          title: `استلام وحفظ زهور الكوشة الطبيعية الهولندية وتغذيتها بمحلول الحفظ المائي لتتحمل درجات الحرارة`,
          categoryTag: 'الزهور والورود',
          stage: 'before_departure',
          priority: 'high',
          completed: false,
          assignedRole: 'مصمم الزهور'
        },
        {
          id: `${bId}-wed-arch`,
          bookingId: bId,
          title: `تركيب هيكل الكوشة الملكية وتثبيت خلفية الأقمشة والزهور والأضواء الخفية`,
          categoryTag: 'إعداد الزينة والكوشة',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'فريق الديكور'
        },
        {
          id: `${bId}-wed-lights`,
          bookingId: bId,
          title: `تمديد واختبار شبكة سترينغ لايتس والإنارة المعلقة للحديقة أو صالة الاستقبال`,
          categoryTag: 'المؤثرات والإضاءة',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'فني الإضاءة'
        },
        {
          id: `${bId}-wed-table-rings`,
          bookingId: bId,
          title: `تجهيز طاولة العرسان والشمعدانات الكريستالية وصينية تبادل الدبل المحفورة بالأسماء`,
          categoryTag: 'إعداد الزينة والكوشة',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'منسق الكوشة'
        },
        {
          id: `${bId}-wed-aisle`,
          bookingId: bId,
          title: `تجهيز الممر الرخامي المضيء وتوزيع فوانيس الشموع المائية على جانبي ممر العروسين`,
          categoryTag: 'الممر والديكور الموقعي',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'فريق الديكور'
        },
        {
          id: `${bId}-wed-smoke-entry`,
          bookingId: bId,
          title: `إشعال الشموع وتشغيل جهاز الدخان الثقيل (Heavy Fog) وأجهزة الشرار قبل دخول العروسين`,
          categoryTag: 'المؤثرات والإضاءة',
          stage: 'during_event',
          priority: 'high',
          completed: false,
          assignedRole: 'فني المؤثرات'
        }
      );
      break;

    case 'baby_shower':
      tasks.push(
        {
          id: `${bId}-baby-clouds`,
          bookingId: bId,
          title: `تجهيز سحب البالونات الألمانية المعالجة والمجسمات الناعمة (تيدي بير / ألعاب لينة)`,
          categoryTag: 'إعداد الزينة والبالونات',
          stage: 'before_departure',
          priority: 'high',
          completed: false,
          assignedRole: 'فريق البالونات'
        },
        {
          id: `${bId}-baby-crib`,
          bookingId: bId,
          title: `تزيين سرير الطفل بالتول الإيطالي الناعم وورود الباستيل وأضواء فيري لايت الدافئة`,
          categoryTag: 'إعداد الزينة والسرير',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'منسقة الديكور'
        },
        {
          id: `${bId}-baby-door`,
          bookingId: bId,
          title: `تثبيت طوق باب الغرفة بالزهور الطبيعية ولافتة الترحيب المطبوعة باسم المولود`,
          categoryTag: 'إعداد الزينة والمدخل',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'منسقة الديكور'
        },
        {
          id: `${bId}-baby-sweets`,
          bookingId: bId,
          title: `تنسيق طاولة الضيافة وترتيب علب الشوكولاتة السويسرية الفاخرة المغلفة باسم المولود`,
          categoryTag: 'الضيافة والحلويات',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'مسؤولة الضيافة'
        },
        {
          id: `${bId}-baby-footprint`,
          bookingId: bId,
          title: `تجهيز لوحة توثيق بصمة قدم الطفل والبيانات الولادية التذكارية مع قلم الإهداء`,
          categoryTag: 'التوثيق التذكاري',
          stage: 'on_site_setup',
          priority: 'medium',
          completed: false,
          assignedRole: 'منسقة الديكور'
        },
        {
          id: `${bId}-baby-hospital-quiet`,
          bookingId: bId,
          title: `مراعاة بروتوكول الهدوء التام والتعقيم داخل المستشفى أو الغرفة أثناء التركيب السريع`,
          categoryTag: 'التنظيم والسلامة',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'مشرف الميدان'
        }
      );
      break;

    default:
      tasks.push(
        {
          id: `${bId}-custom-decor`,
          bookingId: bId,
          title: `تجهيز وتحميل معدات وديكورات الزينة المخصصة وفق طلب العميل`,
          categoryTag: 'إعداد الزينة',
          stage: 'before_departure',
          priority: 'high',
          completed: false,
          assignedRole: 'فريق الديكور'
        },
        {
          id: `${bId}-custom-setup`,
          bookingId: bId,
          title: `التجهيز الميداني الموقعي والتنسيق مع صاحب المناسبة في الموقع`,
          categoryTag: 'التجهيز الموقعي',
          stage: 'on_site_setup',
          priority: 'high',
          completed: false,
          assignedRole: 'مشرف الميدان'
        }
      );
      break;
  }

  // 3. Dynamic Add-on Tasks
  if (booking.selectedAddOnIds && booking.selectedAddOnIds.length > 0) {
    if (booking.selectedAddOnIds.includes('addon-custom-cake')) {
      tasks.push({
        id: `${bId}-addon-cake`,
        bookingId: bId,
        title: `استلام وتوصيل كيك ديزاين طبقتين مخصص بالاسم في صندوق مبرد وفحص سلامة التزيين`,
        categoryTag: 'تجهيز الكيك والحلويات',
        stage: 'before_departure',
        priority: 'high',
        completed: false,
        assignedRole: 'مسؤول المأكولات'
      });
    }

    if (booking.selectedAddOnIds.includes('addon-photo-session')) {
      tasks.push({
        id: `${bId}-addon-photo`,
        bookingId: bId,
        title: `التنسيق مع مصور الفوتو والفيديو الميداني وشحن بطاريات الكاميرا ومعدات الإضاءة السينمائية`,
        categoryTag: 'التصوير والتوثيق',
        stage: 'before_departure',
        priority: 'high',
        completed: false,
        assignedRole: 'مسؤول التصوير'
      });
    }

    if (booking.selectedAddOnIds.includes('addon-sparkulars')) {
      tasks.push({
        id: `${bId}-addon-spark`,
        bookingId: bId,
        title: `فحص أجهزة الشرار البارد (Sparkulars) والتأكد من مسافات الأمان وموقع الكهرباء`,
        categoryTag: 'المؤثرات والإضاءة',
        stage: 'on_site_setup',
        priority: 'high',
        completed: false,
        assignedRole: 'فني المؤثرات'
      });
    }

    if (booking.selectedAddOnIds.includes('addon-dj-sound')) {
      tasks.push({
        id: `${bId}-addon-sound`,
        bookingId: bId,
        title: `فحص مكسر الصوت ومكبرات الدي جي اللاسلكية والتأكد من قائمة الأغاني المطلوبة`,
        categoryTag: 'الصوتيات والدي جي',
        stage: 'on_site_setup',
        priority: 'high',
        completed: false,
        assignedRole: 'مهندس الصوت'
      });
    }

    if (booking.selectedAddOnIds.includes('addon-clown')) {
      tasks.push({
        id: `${bId}-addon-clown`,
        bookingId: bId,
        title: `تأكيد وصول المهرج وفقرة الرسم على الوجوه وتجهيز الألوان المائية الآمنة للأطفال`,
        categoryTag: 'الفقرات والترفيه',
        stage: 'during_event',
        priority: 'medium',
        completed: false,
        assignedRole: 'منسق الفقرات'
      });
    }
  }

  // 4. Special Notes Task (if client wrote custom notes)
  if (booking.specialNotes && booking.specialNotes.trim().length > 3) {
    tasks.push({
      id: `${bId}-notes-attention`,
      bookingId: bId,
      title: `مراعاة ملاحظات العميل الخاصة: "${booking.specialNotes.trim()}"`,
      categoryTag: 'ملاحظات العميل الخاصة',
      stage: 'on_site_setup',
      priority: 'high',
      completed: false,
      assignedRole: 'مشرف الميدان'
    });
  }

  // 5. Final Handover & Quality Assurance Task
  tasks.push({
    id: `${bId}-final-qa`,
    bookingId: bId,
    title: `التسليم النهائي وإجراء جولة فحص الجودة برفقة العميل وأخذ الموافقة وصورة توثيقية للأرشيف`,
    categoryTag: 'الجودة والتسليم',
    stage: 'after_event',
    priority: 'high',
    completed: false,
    assignedRole: 'مشرف الميدان'
  });

  return tasks;
}

const STORAGE_KEY = 'farha_field_tasks_state_v1';

export interface PersistedTasksState {
  completedTaskIds: string[];
  customTasks: FieldTaskItem[];
}

/**
 * Loads saved task completion state and custom user-created tasks from localStorage.
 */
export function loadPersistedTasksState(): PersistedTasksState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedTaskIds: [], customTasks: [] };
    const parsed = JSON.parse(raw);
    return {
      completedTaskIds: Array.isArray(parsed.completedTaskIds) ? parsed.completedTaskIds : [],
      customTasks: Array.isArray(parsed.customTasks) ? parsed.customTasks : []
    };
  } catch {
    return { completedTaskIds: [], customTasks: [] };
  }
}

/**
 * Saves task state back to localStorage.
 */
export function savePersistedTasksState(state: PersistedTasksState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save field tasks state', e);
  }
}
