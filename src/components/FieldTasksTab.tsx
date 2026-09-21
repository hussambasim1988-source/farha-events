import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Sparkles, 
  Plus, 
  Trash2, 
  Share2, 
  MessageCircle, 
  Printer, 
  RotateCcw, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Briefcase, 
  Cake, 
  Palette, 
  SlidersHorizontal,
  ChevronDown,
  Check
} from 'lucide-react';
import { BookingFormData, FieldTaskItem, TaskStage, TaskPriority } from '../types';
import { 
  generateAutoTasksForBooking, 
  loadPersistedTasksState, 
  savePersistedTasksState 
} from '../utils/fieldTasksGenerator';
import { EVENT_CATEGORIES } from '../data/farhaData';

interface FieldTasksTabProps {
  bookings: BookingFormData[];
  initialBookingId?: string | null;
  onOpenBookingDetails?: (bookingId: string) => void;
}

const STAGE_LABELS: Record<TaskStage, { label: string; icon: string }> = {
  before_departure: { label: 'قبل التحرك من المخزن', icon: '🚚' },
  on_site_setup: { label: 'التجهيز الموقعي الميداني', icon: '🛠️' },
  during_event: { label: 'أثناء الحفل والمراسم', icon: '🎉' },
  after_event: { label: 'التسليم وما بعد الحفل', icon: '🏁' }
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  high: { label: 'أولوية قصوى', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  medium: { label: 'أولوية متوسطة', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  low: { label: 'عادية', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' }
};

export const FieldTasksTab: React.FC<FieldTasksTabProps> = ({
  bookings,
  initialBookingId
}) => {
  // Active selected booking or "all"
  const [selectedBookingId, setSelectedBookingId] = useState<string>(() => {
    if (initialBookingId && bookings.some(b => b.id === initialBookingId)) {
      return initialBookingId;
    }
    // Prefer confirmed booking, or first booking, or "all"
    const firstConfirmed = bookings.find(b => b.status === 'confirmed');
    return firstConfirmed ? firstConfirmed.id : (bookings[0]?.id || 'all');
  });

  // Filter states
  const [stageFilter, setStageFilter] = useState<'all' | TaskStage>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persisted task states (completed IDs & custom added tasks)
  const [persistedState, setPersistedState] = useState(() => loadPersistedTasksState());

  // Form for adding custom task
  const [showAddForm, setShowAddForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customStage, setCustomStage] = useState<TaskStage>('on_site_setup');
  const [customCategory, setCustomCategory] = useState('مهمة ميدانية خاصة');
  const [customRole, setCustomRole] = useState('فريق الديكور');
  const [customPriority, setCustomPriority] = useState<TaskPriority>('medium');

  // Copy notification toast
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    savePersistedTasksState(persistedState);
  }, [persistedState]);

  // Selected Booking object
  const currentBooking = useMemo(() => {
    if (selectedBookingId === 'all') return null;
    return bookings.find(b => b.id === selectedBookingId) || null;
  }, [selectedBookingId, bookings]);

  // Generate automated tasks for all relevant bookings + append custom tasks
  const allGeneratedTasks = useMemo(() => {
    const list: FieldTaskItem[] = [];
    const targetBookings = currentBooking ? [currentBooking] : bookings;

    targetBookings.forEach(b => {
      // Auto tasks based on category & details
      const autoTasks = generateAutoTasksForBooking(b);
      list.push(...autoTasks);

      // Append custom tasks for this booking
      const customForBooking = persistedState.customTasks.filter(ct => ct.bookingId === b.id);
      list.push(...customForBooking);
    });

    // Apply completion state from persisted completedTaskIds
    return list.map(t => ({
      ...t,
      completed: persistedState.completedTaskIds.includes(t.id)
    }));
  }, [currentBooking, bookings, persistedState]);

  // Filtered task list
  const filteredTasks = useMemo(() => {
    return allGeneratedTasks.filter(task => {
      // Stage filter
      if (stageFilter !== 'all' && task.stage !== stageFilter) return false;
      // Status filter
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesCategory = task.categoryTag.toLowerCase().includes(query);
        const matchesRole = task.assignedRole.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesRole) return false;
      }
      return true;
    });
  }, [allGeneratedTasks, stageFilter, statusFilter, searchQuery]);

  // KPI Calculations
  const totalTasksCount = allGeneratedTasks.length;
  const completedTasksCount = allGeneratedTasks.filter(t => t.completed).length;
  const pendingTasksCount = totalTasksCount - completedTasksCount;
  const completionPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Toggle completion
  const handleToggleTask = (taskId: string) => {
    setPersistedState(prev => {
      const isAlreadyCompleted = prev.completedTaskIds.includes(taskId);
      const newCompleted = isAlreadyCompleted
        ? prev.completedTaskIds.filter(id => id !== taskId)
        : [...prev.completedTaskIds, taskId];
      return {
        ...prev,
        completedTaskIds: newCompleted
      };
    });
  };

  // Add custom task
  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const targetBookingId = currentBooking ? currentBooking.id : (bookings[0]?.id || 'general');
    const newTask: FieldTaskItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      bookingId: targetBookingId,
      title: customTitle.trim(),
      categoryTag: customCategory.trim() || 'مهمة ميدانية خاصة',
      stage: customStage,
      priority: customPriority,
      completed: false,
      assignedRole: customRole.trim() || 'مشرف الميدان',
      isCustom: true
    };

    setPersistedState(prev => ({
      ...prev,
      customTasks: [newTask, ...prev.customTasks]
    }));

    setCustomTitle('');
    setShowAddForm(false);
  };

  // Delete custom task
  const handleDeleteCustomTask = (taskId: string) => {
    setPersistedState(prev => ({
      completedTaskIds: prev.completedTaskIds.filter(id => id !== taskId),
      customTasks: prev.customTasks.filter(t => t.id !== taskId)
    }));
  };

  // Bulk complete all
  const handleCompleteAll = () => {
    const allIds = allGeneratedTasks.map(t => t.id);
    setPersistedState(prev => ({
      ...prev,
      completedTaskIds: Array.from(new Set([...prev.completedTaskIds, ...allIds]))
    }));
  };

  // Reset tasks for current view
  const handleResetTasks = () => {
    if (confirm('هل أنت متأكد من رغبتك في إعادة ضبط وتصفير حالة المهام المنجزة؟')) {
      const currentIds = allGeneratedTasks.map(t => t.id);
      setPersistedState(prev => ({
        ...prev,
        completedTaskIds: prev.completedTaskIds.filter(id => !currentIds.includes(id))
      }));
    }
  };

  // Generate plain-text for WhatsApp / Clipboard
  const getFormattedChecklistText = () => {
    const title = currentBooking
      ? `📋 قائمة المهام الميدانية - فرحة العراق\n👤 العميل: ${currentBooking.clientName}\n📅 الموعد: ${currentBooking.eventDate} (${currentBooking.eventTime})\n📍 الموقع: ${currentBooking.city} - ${currentBooking.addressDetails}\nنسبة الإنجاز: ${completionPercentage}%\n`
      : `📋 قائمة المهام الميدانية لكافة الحجوزات النشطة - فرحة العراق\nنسبة الإنجاز: ${completionPercentage}%\n`;

    const stages: TaskStage[] = ['before_departure', 'on_site_setup', 'during_event', 'after_event'];
    let content = title + '\n';

    stages.forEach(stg => {
      const stageTasks = allGeneratedTasks.filter(t => t.stage === stg);
      if (stageTasks.length > 0) {
        content += `\n🔹 ${STAGE_LABELS[stg].icon} ${STAGE_LABELS[stg].label}:\n`;
        stageTasks.forEach(t => {
          const mark = t.completed ? '✅' : '⬜';
          content += `${mark} [${t.assignedRole}] ${t.title}\n`;
        });
      }
    });

    return content;
  };

  const handleCopyClipboard = () => {
    const text = getFormattedChecklistText();
    navigator.clipboard?.writeText(text);
    setCopiedNotification('تم نسخ قائمة المهام بنجاح! جاهزة للإرسال في قروب العمل.');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getFormattedChecklistText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const categoryName = currentBooking 
    ? (EVENT_CATEGORIES.find(c => c.id === currentBooking.eventType)?.name || currentBooking.eventType)
    : 'كافة المناسبات';

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{copiedNotification}</span>
          </div>
          <button 
            onClick={() => setCopiedNotification(null)}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner: Booking Selector & Overview */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>قائمة المهام والتنظيم الميداني للفريق</span>
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                (توليد تلقائي حسب نوع الحجز)
              </span>
            </div>
            
            <h3 className="text-lg sm:text-xl font-black">
              {currentBooking ? currentBooking.clientName : 'كافة مهام العمليات الميدانية'}
            </h3>

            {currentBooking ? (
              <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-rose-300">
                  <Palette className="w-3.5 h-3.5" />
                  <span>{categoryName}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentBooking.eventDate} ({currentBooking.eventTime})</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentBooking.city} - {currentBooking.addressDetails}</span>
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-300">
                عرض إجمالي لكافة المهام المطلوبة عبر جميع الحجوزات النشطة لتوزيع المسؤوليات على كادر العمل.
              </p>
            )}
          </div>

          {/* Booking Picker Selector */}
          <div className="w-full md:w-auto shrink-0 flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full appearance-none bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold pr-8 focus:outline-hidden focus:border-rose-500 cursor-pointer shadow-inner"
              >
                <option value="all">🌐 جميع الحجوزات النشطة ({bookings.length})</option>
                {bookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.clientName} - {b.eventDate} ({b.eventType})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm(p => !p)}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
              title="إضافة مهمة خاصة بالميدان"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">مهمة مخصصة</span>
            </button>
          </div>

        </div>

        {/* Progress Metrics & Completion Strip */}
        <div className="mt-4 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="w-full sm:w-1/2 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span>نسبة إنجاز المهام:</span>
                <span className="font-mono text-amber-300 text-sm">{completionPercentage}%</span>
              </span>
              <span className="text-slate-400">
                {completedTasksCount} منجز من أصل {totalTasksCount} مهمة
              </span>
            </div>

            {/* Custom High-Contrast Progress Bar */}
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  completionPercentage === 100 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-xs' 
                    : 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Quick Counter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-medium">بانتظار البدء</span>
              <span className="text-xs font-black text-amber-400">{pendingTasksCount}</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-medium">المنجزة</span>
              <span className="text-xs font-black text-emerald-400">{completedTasksCount}</span>
            </div>

            {completionPercentage === 100 && (
              <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>جاهز 100% للتسليم!</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Add Custom Task Inline Drawer */}
      {showAddForm && (
        <form 
          onSubmit={handleAddCustomTask}
          className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-md space-y-4 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-600" />
              <span>إضافة مهمة ميدانية خاصة بالحجز</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">نص المهمة المطلوب تنفيذها *</label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="مثال: شراء وصلة كهرباء 20 متر، توصيل باقة زهور إضافية..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">مرحلة التنفيذ</label>
              <select
                value={customStage}
                onChange={(e) => setCustomStage(e.target.value as TaskStage)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-rose-500"
              >
                <option value="before_departure">🚚 قبل التحرك</option>
                <option value="on_site_setup">🛠️ التجهيز الموقعي</option>
                <option value="during_event">🎉 أثناء الحفل</option>
                <option value="after_event">🏁 بعد الحفل والتسليم</option>
              </select>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">الفريق المسؤول</label>
              <select
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-rose-500"
              >
                <option value="فريق الديكور">فريق الديكور</option>
                <option value="مشرف الميدان">مشرف الميدان</option>
                <option value="فني الإضاءة والصوت">فني الإضاءة والصوت</option>
                <option value="مسؤول المأكولات">مسؤول المأكولات والكيك</option>
                <option value="فني تزيين السيارات">فني تزيين السيارات</option>
                <option value="مسؤول التصوير">مسؤول التصوير</option>
              </select>
            </div>

            <div className="sm:col-span-6 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">تصنيف المهمة</label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="مثال: لوجستيات موقعية، كيك وحلويات، فحص سلامة..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">درجة الأولوية</label>
              <select
                value={customPriority}
                onChange={(e) => setCustomPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-rose-500"
              >
                <option value="high">🔴 أولوية قصوى</option>
                <option value="medium">🟡 أولوية متوسطة</option>
                <option value="low">🔵 أولوية عادية</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                حفظ المهمة للقائمة
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Control Bar: Filters, Search, and Action Buttons */}
      <div className="bg-slate-100/90 rounded-2xl p-3 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Stage & Status Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          
          {/* Stage Dropdown or Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setStageFilter('all')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                stageFilter === 'all'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              كافة المراحل ({allGeneratedTasks.length})
            </button>

            {(['before_departure', 'on_site_setup', 'during_event', 'after_event'] as TaskStage[]).map(stg => (
              <button
                key={stg}
                type="button"
                onClick={() => setStageFilter(stg)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  stageFilter === stg
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
                title={STAGE_LABELS[stg].label}
              >
                <span className="ml-1">{STAGE_LABELS[stg].icon}</span>
                <span className="hidden lg:inline">{STAGE_LABELS[stg].label}</span>
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

          {/* Pending / Completed Status Toggle */}
          <div className="bg-white rounded-xl p-0.5 border border-slate-200 flex items-center">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                statusFilter === 'pending' ? 'bg-amber-500 text-white' : 'text-amber-800 hover:text-amber-900'
              }`}
            >
              المتبقية ({pendingTasksCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                statusFilter === 'completed' ? 'bg-emerald-600 text-white' : 'text-emerald-800 hover:text-emerald-900'
              }`}
            >
              المنجزة ({completedTasksCount})
            </button>
          </div>

        </div>

        {/* Quick Search & Team Export Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          
          <div className="relative flex-1 md:w-44">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في المهام..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-rose-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="button"
            onClick={handleCopyClipboard}
            className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            title="نسخ قائمة المهام كرسالة للفريق"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-colors cursor-pointer"
            title="إرسال إلى واتساب الفريق"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleCompleteAll}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
            title="تحديد الكل كمنجز ✓"
          >
            <Check className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetTasks}
            className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-300 transition-colors cursor-pointer"
            title="إعادة ضبط المهام"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">لا توجد مهام تطابق هذا الفلتر</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            قم بتغيير مرحلة التنفيذ أو مسح نص البحث لعرض بقية المهام الميدانية.
          </p>
          <button
            type="button"
            onClick={() => {
              setStageFilter('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
          >
            إلغاء الفلاتر
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map(task => {
            const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
            const stageInfo = STAGE_LABELS[task.stage] || STAGE_LABELS.on_site_setup;

            return (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`group rounded-2xl p-3 sm:p-4 border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  task.completed
                    ? 'bg-emerald-50/50 border-emerald-200/90 opacity-80'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Checkbox & Task Main Info */}
                <div className="flex items-start gap-3 flex-1">
                  
                  {/* Interactive Checkbox */}
                  <div className="pt-0.5 shrink-0">
                    {task.completed ? (
                      <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-lg border-2 border-slate-300 group-hover:border-rose-500 bg-white transition-colors" />
                    )}
                  </div>

                  {/* Task Content */}
                  <div className="space-y-1.5 flex-1">
                    <p className={`text-xs sm:text-sm font-bold leading-relaxed ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}>
                      {task.title}
                    </p>

                    {/* Meta Tags Row */}
                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                      
                      {/* Category Tag */}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200/80">
                        {task.categoryTag}
                      </span>

                      {/* Responsible Role Badge */}
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200/60 flex items-center gap-1">
                        <Briefcase className="w-2.5 h-2.5" />
                        <span>{task.assignedRole}</span>
                      </span>

                      {/* Stage Pill */}
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200/60">
                        <span>{stageInfo.icon}</span> <span>{stageInfo.label}</span>
                      </span>

                      {/* Priority Tag */}
                      <span className={`px-2 py-0.5 rounded-md font-bold border ${priorityInfo.bg} ${priorityInfo.color}`}>
                        {priorityInfo.label}
                      </span>

                      {task.isCustom && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold border border-purple-200">
                          مهمة مخصصة
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Quick Actions (e.g. delete custom task) */}
                <div className="flex items-center gap-1 shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
                  {task.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="حذف هذه المهمة المخصصة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Field Operations Guide Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 block">
            دليل التنسيق الميداني لكادر فرحة العراق:
          </span>
          <p className="leading-relaxed text-[11px] text-slate-500">
            يتم توليد قائمة المهام آلياً بناءً على مواصفات المناسبة (عيد ميلاد، سيارة، تخرج، ختان، عرس، بيبي شاور) والإضافات المختارة (كيك، تصوير، شرار بارد). يمكنك مشاركة القائمة مباشرة مع كادر العمل عبر واتساب أو طباعتها لمتابعة الإنجاز لحظة بلحظة.
          </p>
        </div>
      </div>

    </div>
  );
};
