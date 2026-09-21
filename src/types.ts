export type EventCategory = 
  | 'birthday'           // أعياد ميلاد
  | 'graduation'         // تخرج
  | 'circumcision'       // ختان / طهور
  | 'car_decor'          // تزيين سيارات
  | 'wedding_engagement' // خطوبة وأعراس
  | 'baby_shower';       // استقبال مواليد

export interface ServicePackage {
  id: string;
  category: EventCategory;
  name: string;
  tagline: string;
  price: number; // بالدينار العراقي (IQD)
  originalPrice?: number;
  popular?: boolean;
  badge?: string;
  imageUrl: string;
  features: string[];
  suitableFor: string;
  estimatedHours: string;
}

export interface AddOnService {
  id: string;
  name: string;
  description: string;
  price: number; // IQD
  category?: EventCategory | 'all';
  iconName: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingReview {
  rating: number; // 1 to 5
  comment: string;
  tags?: string[];
  createdAt: string;
}

export interface BookingFormData {
  id: string;
  clientName: string;
  phone: string;
  city: string;
  addressDetails: string;
  eventType: EventCategory;
  packageId: string;
  eventDate: string;
  eventTime: string;
  guestsCount: number;
  selectedAddOnIds: string[];
  customThemeColors: string;
  carTypeModel?: string; // إذا كان تزيين سيارات
  childNameAge?: string; // إذا كان عيد ميلاد أو ختان
  universityCollege?: string; // إذا كان تخرج
  specialNotes: string;
  totalEstimatedPrice: number;
  createdAt: string;
  status: BookingStatus;
  review?: BookingReview;
}

export interface PortfolioImage {
  url: string;
  caption: string;
  tag?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: EventCategory;
  imageUrl: string;
  galleryImages?: PortfolioImage[];
  location: string;
  date: string;
  description: string;
  clientReviewSnippet?: string;
  clientName?: string;
  decorHighlights?: string[];
  setupTime?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  city: string;
  eventType: EventCategory;
  eventTitle: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedBooking: boolean;
}

export interface FarhaAIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: 'select_category' | 'select_package' | 'open_calculator' | 'ask_question';
    payload?: string;
  }[];
  budgetBreakdown?: {
    item: string;
    cost: number;
  }[];
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStage = 'before_departure' | 'on_site_setup' | 'during_event' | 'after_event';

export interface FieldTaskItem {
  id: string;
  bookingId: string;
  title: string;
  categoryTag: string; // e.g. "تجهيز الزينة", "الكيك والحلويات", "المؤثرات والإضاءة"
  stage: TaskStage;
  priority: TaskPriority;
  completed: boolean;
  completedAt?: string;
  assignedRole: string; // e.g. "فريق الديكور", "مسؤول التوصيل", "فني الإضاءة"
  isCustom?: boolean;
  notes?: string;
}
