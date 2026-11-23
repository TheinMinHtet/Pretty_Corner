'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem, Order, TownshipOption, Promotion, SocialChannel, SocialLinksMap } from '@/lib/types';
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
  LineItemPricing,
  CartPricingSummary,
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
  socialLinks: SocialLinksMap;
  socialChannels: SocialChannel[];
  refreshSocialChannels: () => Promise<void>;
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
  pricing: CartPricingSummary;
  lineItemsPricing: LineItemPricing[];
  promoSubtotal: number;
  nonPromoSubtotal: number;
  getProductQuantity: (productId: string, sizeName?: string) => number;
  incrementProduct: (productId: string, sizeName?: string) => void;
  decrementProduct: (productId: string, sizeName?: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  getOrder: (id: string, phone?: string) => Order | undefined;
  fetchOrderById: (id: string) => Promise<Order | undefined>;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  activePendingOrderId: string | null;
  setActivePendingOrderId: (orderId: string | null) => void;
  cancelOrder: (orderId: string) => void;
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
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(true);
  const [socialChannels, setSocialChannels] = useState<SocialChannel[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinksMap>({
    facebook: 'https://facebook.com/prettycornermm',
    tiktok: 'https://www.tiktok.com/@prettycorner',
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('pretty_corner_cart');
        if (savedCart) return JSON.parse(savedCart);
      } catch {}
    }
    return INITIAL_CART;
  });
  const [orders, setOrdersState] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pretty_corner_orders');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const setOrders = useCallback((updater: Order[] | ((prev: Order[]) => Order[])) => {
    setOrdersState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('pretty_corner_orders', JSON.stringify(next.slice(0, 50)));
        } catch {}
      }
      return next;
    });
  }, []);
  const [selectedTownship, setSelectedTownship] = useState<TownshipOption>(MOCK_TOWNSHIPS[0]);
  const [activePendingOrderId, setActivePendingOrderIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('pretty_corner_active_pending_order') || null;
      } catch {}
    }
    return null;
  });

  const setActivePendingOrderId = useCallback((id: string | null) => {
    setActivePendingOrderIdState(id);
    if (typeof window !== 'undefined') {
      try {
        if (id) {
          localStorage.setItem('pretty_corner_active_pending_order', id);
        } else {
          localStorage.removeItem('pretty_corner_active_pending_order');
        }
      } catch {}
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [manualDiscount, setManualDiscount] = useState<number>(0);
  const [appliedPromo, setAppliedPromoState] = useState<Promotion | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('pretty_corner_applied_promo');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const setAppliedPromo = useCallback((promo: Promotion | null) => {
    setAppliedPromoState(promo);
    if (typeof window !== 'undefined') {
      try {
        if (promo) {
          sessionStorage.setItem('pretty_corner_applied_promo', JSON.stringify(promo));
        } else {
          sessionStorage.removeItem('pretty_corner_applied_promo');
        }
      } catch {}
    }
  }, []);

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

  const refreshSocialChannels = useCallback(async () => {
    try {
      const channels = await repo.getSocialChannels();
      if (Array.isArray(channels) && channels.length > 0) {
        setSocialChannels(channels);
        const fb = channels.find(
          (c) => c.id === 'facebook' || c.platform.toLowerCase() === 'facebook'
        );
        const tt = channels.find(
          (c) => c.id === 'tiktok' || c.platform.toLowerCase() === 'tiktok'
        );
        setSocialLinks({
          facebook: fb?.url || 'https://facebook.com/prettycornermm',
          tiktok: tt?.url || 'https://www.tiktok.com/@prettycorner',
        });
      }
    } catch (err) {
      console.warn('Failed to refresh social channels:', err);
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

    repo.getSocialChannels()
      .then((channels) => {
        if (!ignore && Array.isArray(channels) && channels.length > 0) {
          setSocialChannels(channels);
          const fb = channels.find(
            (c) => c.id === 'facebook' || c.platform.toLowerCase() === 'facebook'
          );
          const tt = channels.find(
            (c) => c.id === 'tiktok' || c.platform.toLowerCase() === 'tiktok'
          );
          setSocialLinks({
            facebook: fb?.url || 'https://facebook.com/prettycornermm',
            tiktok: tt?.url || 'https://www.tiktok.com/@prettycorner',
          });
        }
      })
      .catch((err) => {
        console.warn('Failed to load social channels:', err);
      });

    return () => {
      ignore = true;
    };
  }, [repo]);


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
    const normalizedId = productId.toLowerCase();
    // 1. If item already exists in cart, directly increment it
    const existing = cart.find((i) => {
      const match = i.productId?.toLowerCase() === normalizedId || i.id?.toLowerCase() === normalizedId;
      if (sizeName) return match && i.size === sizeName;
      return match;
    });

    if (existing) {
      updateCartQuantity(existing.id, 1);
      return;
    }

    // 2. Otherwise add new product entry
    addToCart(productId, sizeName, 1);
  };

  const decrementProduct = (productId: string, sizeName?: string) => {
    const normalizedId = productId.toLowerCase();
    // 1. Find directly in cart
    const existing = cart.find((i) => {
      const match = i.productId?.toLowerCase() === normalizedId || i.id?.toLowerCase() === normalizedId;
      if (sizeName) return match && i.size === sizeName;
      return match;
    });

    if (existing) {
      updateCartQuantity(existing.id, -1);
      return;
    }

    // 2. Fallback to products catalog lookup
    const product = products.find((p) => p.id?.toLowerCase() === normalizedId || p.slug?.toLowerCase() === normalizedId);
    if (!product) return;
    const chosenSize = sizeName || product.sizes?.[0]?.name || '';
    const itemId = chosenSize ? `${product.id}-${chosenSize}` : product.id;
    updateCartQuantity(itemId, -1);
  };

  // Pricing calculations delegated to pure CartEngine with catalog product awareness
  const pricing = useMemo(() => {
    return calculatePricing(cart, appliedPromo, 0, manualDiscount, products);
  }, [cart, appliedPromo, manualDiscount, products]);

  const cartCount = isMounted ? pricing.itemCount : 0;
  const cartSubtotal = pricing.subtotal;
  const discount = pricing.discountAmount;
  const cartTotal = pricing.grandTotal;
  const lineItemsPricing = pricing.lineItems;
  const promoSubtotal = pricing.promoSubtotal;
  const nonPromoSubtotal = pricing.nonPromoSubtotal;

  // Auto-ingest coupon from URL query param ?promo=CODE
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const search = window.location.search;
      if (!search) return;
      const params = new URLSearchParams(search);
      const codeParam = params.get('promo');
      if (codeParam && codeParam.trim()) {
        const cleanCode = codeParam.trim().toUpperCase();
        if (!appliedPromo || appliedPromo.code.toUpperCase() !== cleanCode) {
          const match = promotions.find(
            (p) =>
              p.active !== false &&
              p.isOutOfStock !== true &&
              p.code.trim().toUpperCase() === cleanCode
          );
          if (match) {
            setAppliedPromo(match);
          }
        }
      }
    } catch {}
  }, [promotions, appliedPromo, setAppliedPromo]);

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const res = validatePromoCode(code, promotions, language, cart, products);
    if (res.success && res.promo) {
      setAppliedPromo(res.promo);
    }
    return { success: res.success, message: res.message };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setManualDiscount(0);
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const orderId = generateOrderId();
    const formattedDate = formatOrderDate();

    const orderSubmissionWithPromo = {
      ...orderData,
      promoCode: appliedPromo?.code,
      appliedPromotionId: appliedPromo?.id,
    };

    // Authoritative Ingress: await server persistence before confirming
    const saved = await repo.createOrder(orderSubmissionWithPromo, orderId, formattedDate);

    setOrders((prev) => [
      saved,
      ...prev.filter(
        (o) =>
          o.id.toUpperCase() !== orderId.toUpperCase() &&
          o.id.toUpperCase() !== saved.id.toUpperCase()
      ),
    ]);

    // If Cash on Delivery, clear the cart immediately upon verified order creation
    if (orderData.paymentMethod === 'Cash on Delivery') {
      clearCart();
    }

    if (orderData.paymentMethod !== 'Cash on Delivery') {
      setActivePendingOrderId(saved.id || orderId);
    }

    return saved;
  };

  const cancelOrder = useCallback((orderId: string) => {
    const cleanId = orderId.trim().toUpperCase();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id.toUpperCase() === cleanId) {
          return {
            ...o,
            paymentStatus: 'cancelled',
            fulfillmentStatus: 'cancelled',
          };
        }
        return o;
      })
    );
    setActivePendingOrderIdState((current) => {
      if (current?.toUpperCase() === cleanId) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('pretty_corner_active_pending_order');
          } catch {}
        }
        return null;
      }
      return current;
    });
    void repo.updatePaymentStatus(cleanId, 'cancelled');
  }, [repo, setOrders]);

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

    if (status === 'paid' || status === 'cancelled') {
      setActivePendingOrderIdState((current) => {
        if (current?.toUpperCase() === cleanId) {
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('pretty_corner_active_pending_order');
            } catch {}
          }
          return null;
        }
        return current;
      });
    }

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
        socialLinks,
        socialChannels,
        refreshSocialChannels,
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
        pricing,
        lineItemsPricing,
        promoSubtotal,
        nonPromoSubtotal,
        getProductQuantity,
        incrementProduct,
        decrementProduct,
        createOrder,
        getOrder,
        fetchOrderById,
        updatePaymentStatus,
        activePendingOrderId,
        setActivePendingOrderId,
        cancelOrder,
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
