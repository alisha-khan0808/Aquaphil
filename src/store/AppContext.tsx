import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  AMC,
  ChatMessage,
  initialAMCs,
  initialChat,
  initialOrders,
  initialServices,
  Order,
  OrderItem,
  productById,
  ServiceRequest,
  ServiceType,
} from '@/data/mock';

export type User = { name: string; phone: string; email: string };

type PersistedState = {
  onboarded: boolean;
  user: User | null;
  cart: OrderItem[];
  wishlist: string[];
  addresses: string[];
  orders: Order[];
  services: ServiceRequest[];
  amcs: AMC[];
  chat: ChatMessage[];
  notifications: { orders: boolean; service: boolean; amc: boolean; offers: boolean };
};

const defaults: PersistedState = {
  onboarded: false,
  user: null,
  cart: [],
  wishlist: [],
  addresses: ['B-204, Green Park, New Delhi 110016'],
  orders: initialOrders,
  services: initialServices,
  amcs: initialAMCs,
  chat: initialChat,
  notifications: { orders: true, service: true, amc: true, offers: false },
};

const STORAGE_KEY = 'aquaphil-state-v1';

type NewService = {
  type: ServiceType;
  productName: string;
  preferredDate: string;
  slot: string;
  description: string;
};

type AppContextValue = PersistedState & {
  ready: boolean;
  cartCount: number;
  cartTotal: number;
  completeOnboarding: () => void;
  login: (user: User) => void;
  logout: () => void;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  addAddress: (address: string) => void;
  placeOrder: (paymentMethod: string, address: string) => Order;
  bookService: (input: NewService) => ServiceRequest;
  renewAMC: (id: string) => void;
  rateService: (id: string, stars: number) => void;
  sendMessage: (body: string) => void;
  setNotification: (key: keyof PersistedState['notifications'], value: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const SUPPORT_REPLIES = [
  'Thanks for reaching out! A support agent will look into this right away.',
  'Got it. Could you share your order or service number so we can check?',
  'We have noted this. A technician can visit within 24 hours — would you like us to book it?',
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaults);
  const [ready, setReady] = useState(false);
  const replyIndex = useRef(0);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...defaults, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const update = useCallback((fn: (s: PersistedState) => Partial<PersistedState>) => {
    setState((s) => ({ ...s, ...fn(s) }));
  }, []);

  const addToCart = useCallback(
    (productId: string, qty = 1) =>
      update((s) => {
        const existing = s.cart.find((i) => i.productId === productId);
        return {
          cart: existing
            ? s.cart.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i))
            : [...s.cart, { productId, qty }],
        };
      }),
    [update]
  );

  const setQty = useCallback(
    (productId: string, qty: number) =>
      update((s) => ({
        cart:
          qty <= 0
            ? s.cart.filter((i) => i.productId !== productId)
            : s.cart.map((i) => (i.productId === productId ? { ...i, qty } : i)),
      })),
    [update]
  );

  const cartTotal = state.cart.reduce((sum, i) => sum + (productById(i.productId)?.price ?? 0) * i.qty, 0);
  const cartCount = state.cart.reduce((sum, i) => sum + i.qty, 0);

  const placeOrder = useCallback(
    (paymentMethod: string, address: string) => {
      const order: Order = {
        id: 'AQ-ORD-' + Math.floor(10000 + Math.random() * 89999),
        kind: 'product',
        items: state.cart,
        total: cartTotal,
        paymentMethod,
        address,
        status: 'Placed',
        createdAt: new Date().toISOString(),
      };
      update((s) => ({ orders: [order, ...s.orders], cart: [] }));
      return order;
    },
    [state.cart, cartTotal, update]
  );

  const bookService = useCallback(
    (input: NewService) => {
      const now = new Date().toISOString();
      const req: ServiceRequest = {
        id: 'AQ-SRV-' + Math.floor(1000 + Math.random() * 8999),
        kind: 'service',
        ...input,
        status: 'Requested',
        timeline: [{ status: 'Requested', at: now }],
        createdAt: now,
      };
      update((s) => ({ services: [req, ...s.services] }));
      return req;
    },
    [update]
  );

  const sendMessage = useCallback(
    (body: string) => {
      const mine: ChatMessage = { id: 'm' + Date.now(), from: 'me', body, at: new Date().toISOString() };
      update((s) => ({ chat: [...s.chat, mine] }));
      // Simulated support reply until the Socket.IO backend is wired up.
      setTimeout(() => {
        const reply = SUPPORT_REPLIES[replyIndex.current % SUPPORT_REPLIES.length];
        replyIndex.current += 1;
        update((s) => ({
          chat: [...s.chat, { id: 'm' + Date.now(), from: 'support', body: reply, at: new Date().toISOString() }],
        }));
      }, 1400);
    },
    [update]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      ready,
      cartCount,
      cartTotal,
      completeOnboarding: () => update(() => ({ onboarded: true })),
      login: (user) => update(() => ({ user })),
      logout: () => update(() => ({ user: null, cart: [] })),
      addToCart,
      setQty,
      removeFromCart: (id) => setQty(id, 0),
      toggleWishlist: (id) =>
        update((s) => ({
          wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id],
        })),
      addAddress: (address) => update((s) => ({ addresses: [...s.addresses, address] })),
      placeOrder,
      bookService,
      renewAMC: (id) =>
        update((s) => ({
          amcs: s.amcs.map((a) => {
            if (a.id !== id) return a;
            const next = new Date(a.renewalDueDate);
            next.setFullYear(next.getFullYear() + 1);
            return { ...a, status: 'Active', isFreeYear: false, renewalDueDate: next.toISOString().slice(0, 10) };
          }),
        })),
      rateService: (id, stars) =>
        update((s) => ({
          services: s.services.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'Feedback',
                  timeline: [...r.timeline, { status: 'Feedback', at: new Date().toISOString(), note: `Rated ${stars}★` }],
                }
              : r
          ),
        })),
      sendMessage,
      setNotification: (key, v) => update((s) => ({ notifications: { ...s.notifications, [key]: v } })),
    }),
    [state, ready, cartCount, cartTotal, update, addToCart, setQty, placeOrder, bookService, sendMessage]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
