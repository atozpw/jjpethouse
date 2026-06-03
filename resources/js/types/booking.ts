export type PetType = 'Anjing' | 'Kucing' | 'Other' | string;

export type ServiceCategory =
  | 'grooming'
  | 'boarding'
  | 'clinic'
  | 'shop'
  | 'playground'
  | 'delivery'
  | 'petlove'
  | 'petsitter'
  | 'training'
  | 'cremation'
  | 'pettaxi'
  | string;

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  type: 'main' | 'additional' | 'extra' | string;
  petType?: PetType[];
  specialties?: string[];
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  image: string;
  duration: string;
  rating: number;
  active: boolean;
  url?: string;
  requiresAddress?: boolean;
  requiresPickup?: boolean;
  requiresSchedule?: boolean;
  availableModes?: ('Home Visit' | 'Walk In' | 'Delivery' | string)[];
  branchRequired?: boolean;
  requiresPeople?: boolean;
  item?: ServiceItem[];
  scheduleType?: 'range' | 'single';
}

export interface Branch {
  id: string;
  name: string;
  city: 'Jakarta' | 'Bali' | 'Lombok' | string;
  address: string;
  phone: string;
  services: ServiceCategory[];
}

export interface LocationBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: {
    weekday: string;
    weekend: string;
  };
  services: string[];
  bookingservices?: string[];
  image: string;
  coordinates: {
    lat?: number;
    lng?: number;
  };
  featured?: boolean;
}

export interface BookingPerson {
  name: string;
  specialty: string;
  specialties: string[];
  image: string;
  branchId: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
