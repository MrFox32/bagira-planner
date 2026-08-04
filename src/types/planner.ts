export interface Master {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  color: string; // Tailwind/HEX hex color for calendar block
  role: string; // e.g. "Top Stylist", "Nail Master"
  isActive: boolean;
  specialties: string[]; // Service IDs master can perform
  workHours: {
    start: string; // "09:00"
    end: string;   // "19:00"
    breakStart?: string; // "13:00"
    breakEnd?: string;   // "14:00"
  };
}

export interface Service {
  id: string;
  category: 'hair' | 'nails' | 'cosmetology' | 'brows' | 'massage';
  title: string;
  durationMinutes: number; // e.g. 45
  bufferMinutes: number;   // e.g. 15 for prep/sanitization
  price: number; // UAH
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  visitCount?: number;
  totalSpent?: number;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'disabled';

export interface AppointmentServiceItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  masterId: string;
  masterName: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  price: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  status: AppointmentStatus;
  notificationStatus: NotificationStatus;
  services: AppointmentServiceItem[];
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

export interface RecommendedSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "14:00"
  endTime: string;   // "16:30"
  totalMinutes: number;
  isOptimal: boolean;
  scoreReason: string; // e.g., "Слідом за записом о 13:30 (без простою)"
  masterBreakdown: {
    serviceId: string;
    serviceTitle: string;
    masterId: string;
    masterName: string;
    masterColor: string;
    startTime: string; // "14:00"
    endTime: string;   // "15:00"
  }[];
}
