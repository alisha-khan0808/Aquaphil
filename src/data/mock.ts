// Mock data shaped after the PRD's core data model. Replace with API calls
// once the Node.js backend is available.

export type Category = 'Domestic' | 'Commercial' | 'Spares';

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  spec: string;
  stages: number;
  uv: boolean;
  warrantyYears: number;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  description: string;
  tint: string;
  icon: string;
};

export type OrderStatus = 'Delivered' | 'Shipped' | 'In Progress' | 'Completed' | 'Placed';

export type OrderItem = { productId: string; qty: number };

export type Order = {
  id: string;
  kind: 'product';
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  address: string;
  status: OrderStatus;
  createdAt: string;
};

export type ServiceType = 'Installation' | 'Repair' | 'AMC';

export const SERVICE_STEPS = [
  'Requested',
  'Technician Assigned',
  'In Progress',
  'Completed',
  'Feedback',
] as const;
export type ServiceStatus = (typeof SERVICE_STEPS)[number];

export type TimelineEntry = { status: ServiceStatus; at: string; note?: string };

export type ServiceRequest = {
  id: string;
  kind: 'service';
  type: ServiceType;
  productName: string;
  preferredDate: string;
  slot: string;
  description: string;
  status: ServiceStatus;
  technicianId?: string;
  timeline: TimelineEntry[];
  createdAt: string;
};

export type Technician = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  jobs: number;
  initials: string;
};

export type AMC = {
  id: string;
  productName: string;
  startDate: string;
  renewalDueDate: string;
  isFreeYear: boolean;
  price: number;
  status: 'Active' | 'Renewal Due' | 'Expired';
};

export type ChatMessage = {
  id: string;
  from: 'me' | 'support';
  body: string;
  at: string;
};

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Aquaphil Pristine RO+UV',
    brand: 'Aquaphil',
    category: 'Domestic',
    spec: '7-stage RO+UV+UF · 8 L tank',
    stages: 7,
    uv: true,
    warrantyYears: 1,
    price: 12499,
    mrp: 17999,
    rating: 4.6,
    reviews: 1284,
    description:
      'Seven-stage purification with RO, UV and UF for TDS up to 2000 ppm. Mineral cartridge restores essential calcium and magnesium. Includes free installation and first-year AMC.',
    tint: '#E3F0FF',
    icon: 'water-pump',
  },
  {
    id: 'p2',
    name: 'Aquaphil Nova Alkaline',
    brand: 'Aquaphil',
    category: 'Domestic',
    spec: '8-stage RO+UV+Alkaline · 10 L tank',
    stages: 8,
    uv: true,
    warrantyYears: 2,
    price: 15999,
    mrp: 22499,
    rating: 4.7,
    reviews: 842,
    description:
      'Alkaline booster raises pH to 8–9.5. Smart LED indicators for filter life and tank full. Copper-infused final stage.',
    tint: '#E6FAF7',
    icon: 'cup-water',
  },
  {
    id: 'p3',
    name: 'Aquaphil Eco Mini',
    brand: 'Aquaphil',
    category: 'Domestic',
    spec: '5-stage RO · 6 L tank',
    stages: 5,
    uv: false,
    warrantyYears: 1,
    price: 7999,
    mrp: 10999,
    rating: 4.3,
    reviews: 516,
    description:
      'Compact wall-mount RO for small families. Saves up to 60% water versus conventional RO.',
    tint: '#FFF4E3',
    icon: 'water-outline',
  },
  {
    id: 'p4',
    name: 'Aquaphil Pro 25 LPH',
    brand: 'Aquaphil',
    category: 'Commercial',
    spec: '6-stage RO · 25 L/hr',
    stages: 6,
    uv: true,
    warrantyYears: 1,
    price: 28999,
    mrp: 36000,
    rating: 4.5,
    reviews: 213,
    description:
      'Built for offices, clinics and small restaurants. Stainless frame, high-flow membrane and auto-flush.',
    tint: '#EEE9FF',
    icon: 'office-building',
  },
  {
    id: 'p5',
    name: 'Aquaphil Industrial 100 LPH',
    brand: 'Aquaphil',
    category: 'Commercial',
    spec: '7-stage RO+UV · 100 L/hr',
    stages: 7,
    uv: true,
    warrantyYears: 2,
    price: 74999,
    mrp: 89999,
    rating: 4.4,
    reviews: 96,
    description:
      'Skid-mounted plant for schools, factories and hostels. Dual membranes and digital TDS meter.',
    tint: '#E9F7FF',
    icon: 'factory',
  },
  {
    id: 'p6',
    name: 'RO Membrane 80 GPD',
    brand: 'Aquaphil',
    category: 'Spares',
    spec: 'Fits all domestic models',
    stages: 1,
    uv: false,
    warrantyYears: 0,
    price: 1899,
    mrp: 2499,
    rating: 4.5,
    reviews: 2210,
    description: 'Genuine replacement membrane. Recommended every 12–18 months.',
    tint: '#F1F5F9',
    icon: 'filter',
  },
  {
    id: 'p7',
    name: 'Filter Change Kit',
    brand: 'Aquaphil',
    category: 'Spares',
    spec: 'Sediment + carbon + post-carbon',
    stages: 3,
    uv: false,
    warrantyYears: 0,
    price: 999,
    mrp: 1499,
    rating: 4.4,
    reviews: 1730,
    description: 'Complete 3-filter kit for scheduled six-monthly change.',
    tint: '#F1F5F9',
    icon: 'filter-variant',
  },
  {
    id: 'p8',
    name: 'UV Lamp 11W',
    brand: 'Aquaphil',
    category: 'Spares',
    spec: 'For RO+UV models',
    stages: 1,
    uv: true,
    warrantyYears: 0,
    price: 649,
    mrp: 899,
    rating: 4.2,
    reviews: 640,
    description: 'Genuine UV lamp. Replace yearly to keep disinfection effective.',
    tint: '#F1F5F9',
    icon: 'lightbulb-fluorescent-tube',
  },
];

export const technicians: Technician[] = [
  { id: 't1', name: 'Ravi Kumar', phone: '+919800000001', rating: 4.8, jobs: 642, initials: 'RK' },
  { id: 't2', name: 'Suresh Yadav', phone: '+919800000002', rating: 4.6, jobs: 389, initials: 'SY' },
];

export const initialOrders: Order[] = [
  {
    id: 'AQ-ORD-10421',
    kind: 'product',
    items: [{ productId: 'p1', qty: 1 }],
    total: 12499,
    paymentMethod: 'UPI',
    address: 'B-204, Green Park, New Delhi 110016',
    status: 'Delivered',
    createdAt: '2026-09-12T11:20:00',
  },
  {
    id: 'AQ-ORD-10587',
    kind: 'product',
    items: [{ productId: 'p7', qty: 1 }],
    total: 999,
    paymentMethod: 'Cash on Delivery',
    address: 'B-204, Green Park, New Delhi 110016',
    status: 'Shipped',
    createdAt: '2026-10-17T16:05:00',
  },
];

export const initialServices: ServiceRequest[] = [
  {
    id: 'AQ-SRV-2291',
    kind: 'service',
    type: 'Repair',
    productName: 'Aquaphil Pristine RO+UV',
    preferredDate: '2026-10-21',
    slot: '10 AM – 12 PM',
    description: 'Water flow is slow and taste has changed.',
    status: 'In Progress',
    technicianId: 't1',
    timeline: [
      { status: 'Requested', at: '2026-10-19T09:12:00' },
      { status: 'Technician Assigned', at: '2026-10-19T10:01:00', note: 'Ravi Kumar assigned' },
      { status: 'In Progress', at: '2026-10-20T10:30:00', note: 'Technician on the way' },
    ],
    createdAt: '2026-10-19T09:12:00',
  },
  {
    id: 'AQ-SRV-2187',
    kind: 'service',
    type: 'AMC',
    productName: 'Kent Grand (old purifier)',
    preferredDate: '2026-10-05',
    slot: '4 – 6 PM',
    description: 'Scheduled filter change.',
    status: 'Completed',
    technicianId: 't2',
    timeline: [
      { status: 'Requested', at: '2026-10-03T08:40:00' },
      { status: 'Technician Assigned', at: '2026-10-03T09:15:00', note: 'Suresh Yadav assigned' },
      { status: 'In Progress', at: '2026-10-05T16:10:00' },
      { status: 'Completed', at: '2026-10-05T17:05:00', note: 'Sediment & carbon filters replaced' },
    ],
    createdAt: '2026-10-03T08:40:00',
  },
  {
    id: 'AQ-SRV-2104',
    kind: 'service',
    type: 'Installation',
    productName: 'Aquaphil Pristine RO+UV',
    preferredDate: '2026-09-14',
    slot: '2 PM – 4 PM',
    description: 'New purifier installation.',
    status: 'Feedback',
    technicianId: 't2',
    timeline: [
      { status: 'Requested', at: '2026-09-12T11:25:00' },
      { status: 'Technician Assigned', at: '2026-09-12T12:10:00' },
      { status: 'In Progress', at: '2026-09-14T14:05:00' },
      { status: 'Completed', at: '2026-09-14T15:00:00', note: 'Installed and TDS tested at 82 ppm' },
      { status: 'Feedback', at: '2026-09-14T18:30:00', note: 'Rated 5★' },
    ],
    createdAt: '2026-09-12T11:25:00',
  },
];

export const initialAMCs: AMC[] = [
  {
    id: 'AQ-AMC-551',
    productName: 'Aquaphil Pristine RO+UV',
    startDate: '2026-09-14',
    renewalDueDate: '2027-09-14',
    isFreeYear: true,
    price: 2499,
    status: 'Active',
  },
  {
    id: 'AQ-AMC-318',
    productName: 'Kent Grand (old purifier)',
    startDate: '2025-11-02',
    renewalDueDate: '2026-11-02',
    isFreeYear: false,
    price: 2999,
    status: 'Renewal Due',
  },
];

export const initialChat: ChatMessage[] = [
  {
    id: 'm1',
    from: 'support',
    body: 'Hi! Welcome to Aquaphil support 👋 How can we help you today?',
    at: '2026-10-20T09:00:00',
  },
];

export const TIME_SLOTS = ['8 – 10 AM', '10 AM – 12 PM', '12 – 2 PM', '2 – 4 PM', '4 – 6 PM', '6 – 8 PM'];

export const productById = (id: string) => products.find((p) => p.id === id);
export const technicianById = (id?: string) => technicians.find((t) => t.id === id);

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatTime = (iso: string) => {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
};
