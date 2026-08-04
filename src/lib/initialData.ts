import { Master, Service, Client, Appointment } from '@/types/planner';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    category: 'hair',
    title: 'Жіноча стрижка + Укладка',
    durationMinutes: 60,
    bufferMinutes: 15,
    price: 900,
    description: 'Миття голови, стрижка будь-якої складності, укладка стайлінгом',
  },
  {
    id: 'srv-2',
    category: 'hair',
    title: 'Складне фарбування (Airtouch / Balayage)',
    durationMinutes: 150,
    bufferMinutes: 20,
    price: 3200,
    description: 'Освітлення, тонування, догляд та фінішне укладання',
  },
  {
    id: 'srv-3',
    category: 'nails',
    title: 'Комплексний манікюр з покриттям',
    durationMinutes: 90,
    bufferMinutes: 15,
    price: 850,
    description: 'Зняття старого покриття, апаратний манікюр, гель-лак',
  },
  {
    id: 'srv-4',
    category: 'nails',
    title: 'Педикюр естетичний з покриттям',
    durationMinutes: 75,
    bufferMinutes: 15,
    price: 1100,
    description: 'Обробка стопи, пальців та покриття гель-лаком',
  },
  {
    id: 'srv-5',
    category: 'brows',
    title: 'Ламінування та фарбування брів',
    durationMinutes: 45,
    bufferMinutes: 10,
    price: 650,
    description: 'Корекція формати, довготривала укладка, тонування',
  },
  {
    id: 'srv-6',
    category: 'cosmetology',
    title: 'Чистка обличчя комбінована',
    durationMinutes: 90,
    bufferMinutes: 15,
    price: 1400,
    description: 'Ультразвукова та механічна чистка, заспокійлива маска',
  },
];

export const INITIAL_MASTERS: Master[] = [
  {
    id: 'mst-1',
    name: 'Олена Ковальчук',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+380 67 111 22 33',
    color: '#8b5cf6', // Violet
    role: 'Топ-Стиліст / Колорист',
    isActive: true,
    specialties: ['srv-1', 'srv-2', 'srv-5'],
    workHours: {
      start: '09:00',
      end: '19:00',
      breakStart: '13:00',
      breakEnd: '13:30',
    },
  },
  {
    id: 'mst-2',
    name: 'Анна Мельник',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+380 50 444 55 66',
    color: '#ec4899', // Pink / Rose
    role: 'Майстер нігтьового сервісу',
    isActive: true,
    specialties: ['srv-3', 'srv-4'],
    workHours: {
      start: '09:00',
      end: '19:00',
      breakStart: '14:00',
      breakEnd: '14:30',
    },
  },
  {
    id: 'mst-3',
    name: 'Ірина Бойко',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    phone: '+380 63 777 88 99',
    color: '#10b981', // Emerald
    role: 'Косметолог-естетист',
    isActive: true,
    specialties: ['srv-5', 'srv-6'],
    workHours: {
      start: '10:00',
      end: '18:00',
    },
  },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Наталія Шевченко',
    phone: '+380 97 123 45 67',
    notes: 'Любить каву з мигдалевим молоком. Чутлива шкіра голови.',
    visitCount: 12,
    totalSpent: 14500,
  },
  {
    id: 'cli-2',
    name: 'Вікторія Бондар',
    phone: '+380 50 987 65 43',
    notes: 'Завжди записується на манікюр + педикюр послідовно.',
    visitCount: 6,
    totalSpent: 7800,
  },
  {
    id: 'cli-3',
    name: 'Марія Кравченко',
    phone: '+380 63 333 22 11',
    notes: 'Постійний клієнт колориста Олени.',
    visitCount: 19,
    totalSpent: 34000,
  },
];

// Helper to get formatted date string for today and offsetting days
export const getTodayISO = (offsetDays = 0, hour = 9, minute = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    clientId: 'cli-1',
    clientName: 'Наталія Шевченко',
    clientPhone: '+380 97 123 45 67',
    startTime: getTodayISO(0, 9, 30),
    endTime: getTodayISO(0, 10, 45),
    status: 'completed',
    notificationStatus: 'sent',
    totalPrice: 900,
    notes: 'Попросила трохи коротше чубчик',
    createdAt: getTodayISO(-1, 10, 0),
    services: [
      {
        id: 'as-1',
        serviceId: 'srv-1',
        serviceTitle: 'Жіноча стрижка + Укладка',
        masterId: 'mst-1',
        masterName: 'Олена Ковальчук',
        startTime: getTodayISO(0, 9, 30),
        endTime: getTodayISO(0, 10, 45),
        price: 900,
      },
    ],
  },
  {
    id: 'apt-2',
    clientId: 'cli-2',
    clientName: 'Вікторія Бондар',
    clientPhone: '+380 50 987 65 43',
    startTime: getTodayISO(0, 11, 0),
    endTime: getTodayISO(0, 12, 45),
    status: 'confirmed',
    notificationStatus: 'sent',
    totalPrice: 850,
    createdAt: getTodayISO(-2, 14, 0),
    services: [
      {
        id: 'as-2',
        serviceId: 'srv-3',
        serviceTitle: 'Комплексний манікюр з покриттям',
        masterId: 'mst-2',
        masterName: 'Анна Мельник',
        startTime: getTodayISO(0, 11, 0),
        endTime: getTodayISO(0, 12, 45),
        price: 850,
      },
    ],
  },
  {
    id: 'apt-3',
    clientId: 'cli-3',
    clientName: 'Марія Кравченко',
    clientPhone: '+380 63 333 22 11',
    startTime: getTodayISO(0, 14, 0),
    endTime: getTodayISO(0, 16, 50),
    status: 'confirmed',
    notificationStatus: 'pending',
    totalPrice: 3200,
    notes: 'Airtouch тонування перламутр',
    createdAt: getTodayISO(0, 8, 30),
    services: [
      {
        id: 'as-3',
        serviceId: 'srv-2',
        serviceTitle: 'Складне фарбування (Airtouch / Balayage)',
        masterId: 'mst-1',
        masterName: 'Олена Ковальчук',
        startTime: getTodayISO(0, 14, 0),
        endTime: getTodayISO(0, 16, 50),
        price: 3200,
      },
    ],
  },
];
