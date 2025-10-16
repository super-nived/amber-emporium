// LocalStorage utilities for GoldLeaf Market

export const STORAGE_KEYS = {
  TERMS_AGREED: 'goldleaf_terms_agreed',
  THEME: 'goldleaf_theme',
  PRODUCTS: 'goldleaf_products',
  CHATS: 'goldleaf_chats',
} as const;

// Terms & Conditions
export const hasAgreedToTerms = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.TERMS_AGREED) === 'true';
};

export const setTermsAgreed = (agreed: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.TERMS_AGREED, agreed.toString());
};

// Theme
export const getTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

// Products
export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: 'Cigarette' | 'Beer' | 'Wine' | 'Other';
  providerName: string;
  providerId?: string;
  providerLocation: string;
  googleMapsUrl?: string;
  description: string;
  imageUrl: string;
  createdAt: number;
}

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!stored) return getMockProducts();
  return JSON.parse(stored);
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  products.unshift(newProduct);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return newProduct;
};

// Chat messages
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'provider';
  timestamp: number;
}

export const getChat = (productId: string): ChatMessage[] => {
  const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
  if (!chats) return [];
  const allChats = JSON.parse(chats);
  return allChats[productId] || [];
};

export const addChatMessage = (productId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): void => {
  const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
  const allChats = chats ? JSON.parse(chats) : {};
  
  if (!allChats[productId]) allChats[productId] = [];
  
  const newMessage: ChatMessage = {
    ...message,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  
  allChats[productId].push(newMessage);
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
};

// Mock initial products
const getMockProducts = (): Product[] => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Marlboro Gold Premium',
      price: 12.99,
      quantity: 50,
      category: 'Cigarette',
      providerName: 'Premium Tobacco Co.',
      providerLocation: 'Downtown District',
      googleMapsUrl: 'https://maps.google.com',
      description: 'Premium quality cigarettes with smooth gold blend',
      imageUrl: '/placeholder.svg',
      createdAt: Date.now() - 86400000,
    },
    {
      id: '2',
      name: 'Corona Extra Beer',
      price: 8.50,
      quantity: 100,
      category: 'Beer',
      providerName: 'Beverage Warehouse',
      providerLocation: 'East Side',
      description: 'Refreshing Mexican lager, perfect for any occasion',
      imageUrl: '/placeholder.svg',
      createdAt: Date.now() - 172800000,
    },
    {
      id: '3',
      name: 'Château Margaux 2015',
      price: 450.00,
      quantity: 12,
      category: 'Wine',
      providerName: 'Fine Wines & Spirits',
      providerLocation: 'Luxury Quarter',
      googleMapsUrl: 'https://maps.google.com',
      description: 'Exceptional Bordeaux vintage, full-bodied with complex notes',
      imageUrl: '/placeholder.svg',
      createdAt: Date.now() - 259200000,
    },
    {
      id: '4',
      name: 'Davidoff Classic',
      price: 15.99,
      quantity: 30,
      category: 'Cigarette',
      providerName: 'Luxury Tobacco House',
      providerLocation: 'Central Plaza',
      description: 'Distinguished blend for the refined smoker',
      imageUrl: '/placeholder.svg',
      createdAt: Date.now() - 345600000,
    },
    {
      id: '5',
      name: 'Heineken Premium',
      price: 7.99,
      quantity: 80,
      category: 'Beer',
      providerName: 'City Beer Depot',
      providerLocation: 'Market Street',
      description: 'Classic Dutch premium lager with crisp taste',
      imageUrl: '/placeholder.svg',
      createdAt: Date.now() - 432000000,
    },
    {
      id: '6',
      name: 'Moët & Chandon Champagne',
      price: 89.99,
      quantity: 25,
      category: 'Wine',
      providerName: 'Elite Beverages',
      providerLocation: 'Uptown',
      googleMapsUrl: 'https://maps.google.com',
      description: 'Luxurious champagne for celebrations',
      imageUrl: '/placeholder.svg',
      createdAt: Date.now() - 518400000,
    },
  ];

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  return mockProducts;
};
