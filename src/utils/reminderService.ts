import { BookingFormData } from '../types';

export interface ReminderCheckResult {
  booking: BookingFormData;
  hoursRemaining: number;
  isWithin24Hours: boolean;
  eventDateFormatted: string;
  reminderStatus: 'critical_24h' | 'today' | 'upcoming' | 'past';
  checklist: {
    label: string;
    description: string;
  }[];
}

/**
 * Parse an event date and optional time into a JavaScript Date object
 */
export function parseEventDateTime(eventDateStr: string, eventTimeStr?: string): Date | null {
  if (!eventDateStr) return null;
  
  const parts = eventDateStr.split('-');
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  let hour = 18; // Default 6:00 PM if time not provided
  let minute = 0;

  if (eventTimeStr) {
    const timeMatch = eventTimeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      minute = parseInt(timeMatch[2], 10);

      // Handle Arabic AM / PM formats
      if (eventTimeStr.includes('مساءً') || eventTimeStr.includes('م') || eventTimeStr.toLowerCase().includes('pm')) {
        if (hour < 12) hour += 12;
      } else if (eventTimeStr.includes('صباحاً') || eventTimeStr.includes('ص') || eventTimeStr.toLowerCase().includes('am')) {
        if (hour === 12) hour = 0;
      }
    }
  }

  const dt = new Date(year, month, day, hour, minute);
  return isNaN(dt.getTime()) ? null : dt;
}

/**
 * Checks a booking against a reference time (now) and determines if it falls within the 24-hour reminder window
 */
export function checkBookingReminder(booking: BookingFormData, now = new Date()): ReminderCheckResult | null {
  // Only remind for non-cancelled bookings
  if (booking.status === 'cancelled') return null;

  const eventDateTime = parseEventDateTime(booking.eventDate, booking.eventTime);
  if (!eventDateTime) return null;

  const diffMs = eventDateTime.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // If already past more than 6 hours
  if (diffHours < -6) {
    return {
      booking,
      hoursRemaining: diffHours,
      isWithin24Hours: false,
      eventDateFormatted: booking.eventDate,
      reminderStatus: 'past',
      checklist: [],
    };
  }

  // Define checklist items for 24h readiness
  const checklist = [
    {
      label: 'تأكيد الحضور وموقع الحفل',
      description: `العنوان المسجل: ${booking.city} - ${booking.addressDetails}`,
    },
    {
      label: 'تجهيز الكادر ومعدات الباقة',
      description: 'فحص الإضاءة، البالونات، أجهزة الصوت أو المؤثرات المطلوبة.',
    },
    {
      label: 'تنسيق توقيت وصول الفريق',
      description: 'يصل فريق العمل قبل موعد الحفل بساعتين للتركيب والتزيين.',
    },
    {
      label: 'التواصل المباشر مع العميل',
      description: `رقم الهاتف: ${booking.phone}`,
    },
  ];

  let reminderStatus: 'critical_24h' | 'today' | 'upcoming' | 'past' = 'upcoming';
  const isWithin24Hours = diffHours > 0 && diffHours <= 24;

  if (diffHours <= 0 && diffHours >= -6) {
    reminderStatus = 'today';
  } else if (isWithin24Hours) {
    reminderStatus = 'critical_24h';
  }

  return {
    booking,
    hoursRemaining: Math.round(diffHours * 10) / 10,
    isWithin24Hours,
    eventDateFormatted: booking.eventDate,
    reminderStatus,
    checklist,
  };
}

/**
 * Builds reminder WhatsApp text template
 */
export function generateWhatsAppReminderMessage(booking: BookingFormData, hoursRemaining: number): string {
  const timeDesc = hoursRemaining > 0 
    ? `خلال أقل من ${Math.ceil(hoursRemaining)} ساعة (غداً)` 
    : 'اليوم';

  return encodeURIComponent(
    `🔔 *تذكير موعد الحفل - منصة فرحة العراق* 🎈\n` +
    `----------------------------------------\n` +
    `عزيزنا/عزيزتنا: *${booking.clientName}* المحترم،\n` +
    `نود تذكيركم بأن موعد حفلكم المبهج يقترب (${timeDesc})!\n\n` +
    `📌 *رقم الحجز*: ${booking.id}\n` +
    `🗓️ *التاريخ والوقت*: ${booking.eventDate} (${booking.eventTime})\n` +
    `📍 *الموقع*: ${booking.city} - ${booking.addressDetails}\n` +
    `✨ *الحالة*: ${booking.status === 'confirmed' ? 'مؤكد والكادر جاهز ✅' : 'قيد المراجعة'}\n` +
    `----------------------------------------\n` +
    `فريق العمل الميداني سيتواجد في الموقع قبل الموعد بساعتين لإتمام الديكور والتجهيزات بأعلى المعايير.\n` +
    `إذا كان لديكم أي تعديل أو استفسار عاجل، يسعدنا تواصلكم المباشر معنا الآن! 🌟`
  );
}
