'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, TownshipOption } from '@/lib/types';
import { MOCK_PRODUCTS, INITIAL_ORDERS, MOCK_TOWNSHIPS } from '@/lib/mockData';
import { translations, Language, TranslationSchema } from '@/lib/translations';

interface StoreContextType {
  isMounted: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  selectedTownship: TownshipOption;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedTownship: (township: TownshipOption) => void;
  addToCart: (productId: string, sizeName?: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  discount: number;
  setDiscount: (discount: number) => void;
  cartTotal: number;
  getProductQuantity: (productId: string, sizeName?: string) => number;
  incrementProduct: (productId: string, sizeName?: string) => void;
  decrementProduct: (productId: string, sizeName?: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  getOrder: (id: string, phone?: string) => Order | undefined;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_CART: CartItem[] = [
  {
    id: 'dew-drop-serum-30ml',
    productId: 'dew-drop-serum',
    name: 'Dew Drop Serum',
    size: '30 ml',
    price: 28000,
    quantity: 1,
    image: '/assets/dew-drop-serum.png',
  },
  {
    id: 'cloud-soft-cream-50g',
    productId: 'cloud-soft-cream',
    name: 'Cloud Soft Cream',
    size: '50 g',
    price: 32000,
    quantity: 1,
    image: '/assets/cloud-soft-cream.png',
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedTownship, setSelectedTownship] = useState<TownshipOption>(MOCK_TOWNSHIPS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

  // Persist cart and language or load from localStorage if client-side
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLang = localStorage.getItem('pretty_corner_lang') as Language;
      if (savedLang === 'en' || savedLang === 'my') {
        setLanguageState(savedLang);
      }
      const savedCart = localStorage.getItem('pretty_corner_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      // Ensure orders are not stored on local device
      localStorage.removeItem('pretty_corner_orders');
    } catch {
      // fallback to initial
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('pretty_corner_lang', lang);
    } catch {}
  };

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    try {
      localStorage.setItem('pretty_corner_cart', JSON.stringify(updatedCart));
    } catch {}
  };

  const addToCart = (productId: string, sizeName?: string, quantity: number = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const chosenSize = sizeName
      ? product.sizes?.find((s) => s.name === sizeName) || product.sizes?.[0]
      : product.sizes?.[0];

    const sizeLabel = chosenSize?.name || '';
    const itemPrice = chosenSize?.price || product.price;
    const itemId = sizeLabel ? `${product.id}-${sizeLabel}` : product.id;
    const existingIndex = cart.findIndex((item) => item.id === itemId);

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [
        ...cart,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          size: sizeLabel,
          price: itemPrice,
          quantity,
          image: product.image,
        },
      ];
    }
    saveCartToStorage(updatedCart);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    saveCartToStorage(updatedCart);
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    saveCartToStorage(updatedCart);
  };

  const clearCart = useCallback(() => {
    setCart((prev) => {
      if (prev.length === 0) return prev;
      try {
        localStorage.setItem('pretty_corner_cart', JSON.stringify([]));
      } catch {}
      return [];
    });
  }, []);

  const getProductQuantity = (productId: string, sizeName?: string): number => {
    if (!isMounted) return 0;
    if (sizeName) {
      const item = cart.find((i) => i.productId === productId && i.size === sizeName);
      return item ? item.quantity : 0;
    }
    return cart
      .filter((i) => i.productId === productId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const incrementProduct = (productId: string, sizeName?: string) => {
    addToCart(productId, sizeName, 1);
  };

  const decrementProduct = (productId: string, sizeName?: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const chosenSize = sizeName || product.sizes?.[0]?.name || '';
    const itemId = chosenSize ? `${product.id}-${chosenSize}` : product.id;
    updateCartQuantity(itemId, -1);
  };

  const cartCount = isMounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotal = Math.max(0, cartSubtotal - discount);

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearShort = date.getFullYear().toString().slice(-2);
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const orderId = `PC-${yearShort}${month}${day}-${randomSeq}`;

    const formattedDate = `${day} Nov ${date.getFullYear()} · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: formattedDate,
    };

    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id.toUpperCase() !== orderId.toUpperCase())]);
    return newOrder;
  };

  const getOrder = (id: string, phone?: string): Order | undefined => {
    const cleanId = id.trim().toUpperCase();
    const found = orders.find((o) => o.id.trim().toUpperCase() === cleanId);
    if (!found) return undefined;
    if (phone && phone.trim()) {
      const cleanPhone = phone.replace(/[\s-]/g, '');
      const orderPhone = found.phone.replace(/[\s-]/g, '');
      if (orderPhone !== cleanPhone && !orderPhone.endsWith(cleanPhone) && !cleanPhone.endsWith(orderPhone)) {
        return undefined;
      }
    }
    return found;
  };

  const updatePaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    const cleanId = orderId.trim().toUpperCase();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id.toUpperCase() === cleanId) {
          return {
            ...o,
            paymentStatus: status,
            fulfillmentStatus: status === 'paid' ? 'confirmed' : o.fulfillmentStatus,
          };
        }
        return o;
      })
    );
    if (status === 'paid') {
      clearCart();
    }
  };

  const t = translations[language];

  return (
    <StoreContext.Provider
      value={{
        isMounted,
        language,
        setLanguage,
        t,
        products,
        cart,
        orders,
        selectedTownship,
        searchQuery,
        setSearchQuery,
        setSelectedTownship,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        discount,
        setDiscount,
        cartTotal,
        getProductQuantity,
        incrementProduct,
        decrementProduct,
        createOrder,
        getOrder,
        updatePaymentStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
