'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem, Order, TownshipOption, Promotion } from '@/lib/types';
import { MOCK_TOWNSHIPS, DEFAULT_PROMOTIONS } from '@/lib/mockData';
import { translations, Language, TranslationSchema } from '@/lib/translations';
import { getStorefrontRepository } from '@/lib/repository/StorefrontRepository';
import {
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  getItemQuantity,
  calculatePricing,
  validatePromoCode,
} from '@/lib/cart/CartEngine';
import {
  generateOrderId,
  formatOrderDate,
  resolveOrder as resolveOrderLifecycle,
  completePayment as completePaymentLifecycle,
} from '@/lib/order/OrderLifecycleService';

interface StoreContextType {
  isMounted: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
  products: Product[];
  productsLoading: boolean;
  refreshProducts: () => Promise<void>;
  promotions: Promotion[];
  promotionsLoading: boolean;
  refreshPromotions: () => Promise<void>;
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
  appliedPromo: Promotion | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartTotal: number;
  getProductQuantity: (productId: string, sizeName?: string) => number;
  incrementProduct: (productId: string, sizeName?: string) => void;
  decrementProduct: (productId: string, sizeName?: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  getOrder: (id: string, phone?: string) => Order | undefined;
  fetchOrderById: (id: string) => Promise<Order | undefined>;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_CART: CartItem[] = [];

const emptySubscribe = () => () => {};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('pretty_corner_lang') as Language;
        if (savedLang === 'en' || savedLang === 'my') return savedLang;
      } catch {}
    }
    return 'en';
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [promotions, setPromotions] = useState<Promotion[]>(DEFAULT_PROMOTIONS);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('pretty_corner_cart');
        if (savedCart) return JSON.parse(savedCart);
      } catch {}
    }
    return INITIAL_CART;
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTownship, setSelectedTownship] = useState<TownshipOption>(MOCK_TOWNSHIPS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [manualDiscount, setManualDiscount] = useState<number>(0);
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);

  const repo = useMemo(() => getStorefrontRepository(), []);
  const t = translations[language];

  const refreshPromotions = useCallback(async () => {
    setPromotionsLoading(true);
    try {
      const data = await repo.getPromotions();
      setPromotions(data);
    } catch (err) {
      console.warn('Failed to load promotions:', err);
    } finally {
      setPromotionsLoading(false);
    }
  }, [repo]);

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const fetched = await repo.getProducts();
      setProducts(fetched);
    } catch (err) {
      console.warn('Failed to load products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    let ignore = false;
    repo.getProducts()
      .then((fetched) => {
        if (!ignore) {
          setProducts(fetched);
          setProductsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load products:', err);
        if (!ignore) setProductsLoading(false);
      });

    repo.getPromotions()
      .then((data) => {
        if (!ignore) {
          setPromotions(data);
          setPromotionsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load promotions:', err);
        if (!ignore) setPromotionsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [repo]);

  useEffect(() => {
    try {
      localStorage.removeItem('pretty_corner_orders');
    } catch {}
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
    const product = products.find((p) => p.id === productId || p.slug === productId);
    if (!product) return;

    const updated = addCartItem(cart, product, sizeName, quantity);
    saveCartToStorage(updated);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    const updated = updateCartItemQuantity(cart, itemId, delta);
    saveCartToStorage(updated);
  };

  const removeFromCart = (itemId: string) => {
    const updated = removeCartItem(cart, itemId);
    saveCartToStorage(updated);
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
    return getItemQuantity(cart, productId, sizeName);
  };

  const incrementProduct = (productId: string, sizeName?: string) => {
    addToCart(productId, sizeName, 1);
  };

  const decrementProduct = (productId: string, sizeName?: string) => {
    const product = products.find((p) => p.id === productId || p.slug === productId);
    if (!product) return;
    const chosenSize = sizeName || product.sizes?.[0]?.name || '';
    const itemId = chosenSize ? `${product.id}-${chosenSize}` : product.id;
    updateCartQuantity(itemId, -1);
  };

  // Pricing calculations delegated to pure CartEngine
  const pricing = useMemo(() => {
    return calculatePricing(cart, appliedPromo, 0, manualDiscount);
  }, [cart, appliedPromo, manualDiscount]);

  const cartCount = isMounted ? pricing.itemCount : 0;
  const cartSubtotal = pricing.subtotal;
  const discount = pricing.discountAmount;
  const cartTotal = pricing.grandTotal;

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const res = validatePromoCode(code, promotions, language);
    if (res.success && res.promo) {
      setAppliedPromo(res.promo);
    }
    return { success: res.success, message: res.message };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setManualDiscount(0);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const orderId = generateOrderId();
    const formattedDate = formatOrderDate();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: formattedDate,
    };

    setOrders((prev) => [
      newOrder,
      ...prev.filter((o) => o.id.toUpperCase() !== orderId.toUpperCase()),
    ]);

    // Persist via repository
    void repo.createOrder(orderData, orderId, formattedDate).then((saved) => {
      if (saved) {
        setOrders((prev) => [
          saved,
          ...prev.filter(
            (o) =>
              o.id.toUpperCase() !== orderId.toUpperCase() &&
              o.id.toUpperCase() !== saved.id.toUpperCase()
          ),
        ]);
      }
    });

    return newOrder;
  };

  const getOrder = (id: string, phone?: string): Order | undefined => {
    const cleanId = id.trim().toUpperCase();
    const cleanPhone = (phone || id).trim().replace(/[\s-]/g, '');
    return orders.find((o) => {
      const matchId = o.id.trim().toUpperCase() === cleanId;
      const orderPhone = o.phone.replace(/[\s-]/g, '');
      const matchPhone =
        cleanPhone.length >= 7 &&
        (orderPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone));
      return matchId || matchPhone;
    });
  };

  const fetchOrderById = async (ref: string): Promise<Order | undefined> => {
    const resolved = await resolveOrderLifecycle(ref, orders, repo);
    if (resolved) {
      setOrders((prev) => [
        resolved,
        ...prev.filter((o) => o.id.toUpperCase() !== resolved.id.toUpperCase()),
      ]);
      return resolved;
    }
    return undefined;
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
      void completePaymentLifecycle(cleanId, repo);
    } else {
      void repo.updatePaymentStatus(cleanId, status);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        isMounted,
        language,
        setLanguage,
        t,
        products,
        productsLoading,
        refreshProducts,
        promotions,
        promotionsLoading,
        refreshPromotions,
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
        setDiscount: setManualDiscount,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        cartTotal,
        getProductQuantity,
        incrementProduct,
        decrementProduct,
        createOrder,
        getOrder,
        fetchOrderById,
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
