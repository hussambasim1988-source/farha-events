import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, CalendarCheck, CheckCircle2, Clock, Sparkles, XCircle, ChevronLeft } from 'lucide-react';
import { ToastType } from './ToastNotification';

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  timestamp: string;
  isRead: boolean;
  bookingId?: string;
}

interface NotificationBellProps {
  notifications: InAppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectBookingNotification?: (bookingId: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectBookingNotification,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'celebration':
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <XCircle className="w-4 h-4 text-amber-500" />;
      case 'info':
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef} dir="rtl">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 transition-all cursor-pointer flex items-center justify-center"
        title="التنبيهات والإشعارات"
        aria-label="التنبيهات والإشعارات"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
              {unreadCount > 9 ? '+9' : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black">التنبيهات الفورية</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} جديد
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  title="تحديد الكل كمقروء"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>قراءة الكل</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-slate-400 hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer"
                  title="مسح السجل"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto stroke-1 text-slate-300" />
                <p className="text-xs font-bold text-slate-600">لا توجد إشعارات جديدة</p>
                <p className="text-[11px] text-slate-400">ستصلك تنبيهات فورية وتأكيدات الحجز هنا تلقائياً.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.bookingId && onSelectBookingNotification) {
                      onSelectBookingNotification(notif.bookingId);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-50 ${
                    !notif.isRead ? 'bg-rose-50/30' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-xs font-black text-slate-900">
                        {notif.title}
                      </h5>
                      <span className="text-[10px] text-slate-400">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.bookingId && (
                      <div className="flex items-center gap-1 text-[10px] text-rose-600 font-bold pt-1">
                        <CalendarCheck className="w-3 h-3" />
                        <span>انقر لعرض تفاصيل الحجز #{notif.bookingId}</span>
                        <ChevronLeft className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
