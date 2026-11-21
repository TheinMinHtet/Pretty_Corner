'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, TownshipOption } from '@/lib/types';
import { MOCK_TOWNSHIPS } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';
import {
  createStorefrontOrderApi,
  fetchStorefrontOrders,
  fetchStorefrontProducts,
  updateStorefrontOrderPaymentApi,
} from '@/lib/api';

interface StoreContextType {
  isMounted: boolean;
  products: Product[];
  productsLoading: boolean;
  refreshProducts: () => Promise<void>;
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
  fetchOrderById: (id: string) => Promise<Order | undefined>;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTownship, setSelectedTownship] = useState<TownshipOption>(MOCK_TOWNSHIPS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

  // Fetch live products from Supabase with fallback to MOCK_PRODUCTS
  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            slug,
            name,
            badge,
            price,
            stock_quantity,
            description,
            benefits,
            usage,
            main_image,
            gallery,
            is_active,
            categories (
              slug,
              name
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error || !data || data.length === 0) {
          return;
        }

        const mapped: Product[] = data.map((row: any) => {
          const categorySlug = row.categories?.slug || 'skincare';
          const categoryName = row.categories?.name || 'Skincare';
          const galleryList = Array.isArray(row.gallery) && row.gallery.length > 0
            ? row.gallery
            : [row.main_image];

          return {
            id: row.slug || row.id,
            slug: row.slug,
            name: row.name,
            category: categorySlug,
            subcategory: categoryName,
            badge: row.badge || undefined,
            price: row.price,
            stockQuantity: row.stock_quantity,
            image: row.main_image,
            gallery: galleryList,
            description: row.description || '',
            benefits: Array.isArray(row.benefits) ? row.benefits : [],
            usage: row.usage || '',
            inStock: (row.stock_quantity ?? 0) > 0,
          };
        });

        if (mapped.length > 0) {
          setProducts(mapped);
        }
      } catch (err) {
        console.warn('Failed to fetch products from Supabase, using mock fallback:', err);
      }
    }

    loadLiveProducts();
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const list = await fetchStorefrontProducts();
      if (list !== null) {
        setProducts(list);
      }
    } catch (error) {
      console.warn('Failed to fetch products from shared API:', error);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const list = await fetchStorefrontOrders();
      if (list !== null) {
        setOrders(list);
      }
    } catch (error) {
      console.warn('Failed to fetch orders from shared API:', error);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem('pretty_corner_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      localStorage.removeItem('pretty_corner_orders');
    } catch {
      // fallback to empty cart
    }

    void refreshProducts();
    void refreshOrders();
  }, [refreshProducts, refreshOrders]);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    try {
      localStorage.setItem('pretty_corner_cart', JSON.stringify(updatedCart));
    } catch { }
  };

  const addToCart = (productId: string, sizeName?: string, quantity: number = 1) => {
    const product = products.find((p) => p.id === productId || p.slug === productId);
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
      } catch { }
      return [];
    });
  }, []);

  const getProductQuantity = (productId: string, sizeName?: string): number => {
    if (!isMounted) return 0;
    if (sizeName) {
      const item = cart.find((i) => (i.productId === productId || i.productId === productId.toLowerCase()) && i.size === sizeName);
      return item ? item.quantity : 0;
    }
    return cart
      .filter((i) => i.productId === productId || i.productId === productId.toLowerCase())
      .reduce((sum, i) => sum + i.quantity, 0);
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

    setOrders((prev) => [
      newOrder,
      ...prev.filter((o) => o.id.toUpperCase() !== orderId.toUpperCase()),
    ]);

    void createStorefrontOrderApi(orderData).then((savedOrder) => {
      if (savedOrder) {
        setOrders((prev) => [
          savedOrder,
          ...prev.filter(
            (o) =>
              o.id.toUpperCase() !== orderId.toUpperCase() &&
              o.id.toUpperCase() !== savedOrder.id.toUpperCase()
          ),
        ]);
      } else if (supabase) {
        (async () => {
          try {
            await supabase.from('orders').insert({
              id: orderId,
              customer_name: orderData.customerName,
              phone: orderData.phone,
              delivery_address: orderData.deliveryAddress,
              landmark_note: orderData.landmarkNote || null,
              total_amount: orderData.total,
              payment_method: orderData.paymentMethod,
              payment_status: orderData.paymentStatus,
              fulfillment_status: orderData.fulfillmentStatus,
              payment_slip_url: null,
            });
          } catch (err) {
            console.warn('Failed to insert order into Supabase:', err);
          }
        })();
      }
    });

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

  const fetchOrderById = async (id: string): Promise<Order | undefined> => {
    const cleanId = id.trim().toUpperCase();
    const local = orders.find((o) => o.id.trim().toUpperCase() === cleanId);
    if (local) return local;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .ilike('id', cleanId)
        .single();

      if (error || !data) return undefined;

      const dateObj = new Date(data.created_at);
      const day = dateObj.getDate().toString().padStart(2, '0');
      const formattedDate = `${day} Nov ${dateObj.getFullYear()} · ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const mappedOrder: Order = {
        id: data.id,
        customerName: data.customer_name,
        phone: data.phone,
        deliveryAddress: data.delivery_address,
        landmarkNote: data.landmark_note || undefined,
        total: data.total_amount,
        subtotal: data.total_amount,
        paymentMethod: data.payment_method,
        paymentStatus: data.payment_status as any,
        fulfillmentStatus: data.fulfillment_status as any,
        createdAt: formattedDate,
        items: (data.order_items || []).map((it: any) => ({
          id: it.id,
          productId: it.product_id || it.product_name,
          name: it.product_name,
          price: it.unit_price,
          quantity: it.quantity,
          image: it.product_image || '/assets/dew-drop-serum.png',
        })),
      };

      setOrders((prev) => [mappedOrder, ...prev.filter((o) => o.id.toUpperCase() !== cleanId)]);
      return mappedOrder;
    } catch {
      return undefined;
    }
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

    // Sync status update to Supabase
    if (supabase) {
      supabase
        .from('orders')
        .update({
          payment_status: status,
          fulfillment_status: status === 'paid' ? 'confirmed' : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', cleanId)
        .then(() => { });
    }

    if (status === 'paid') {
      clearCart();
    }
    void updateStorefrontOrderPaymentApi(orderId, status);
  };

  return (
    <StoreContext.Provider
      value={{
        isMounted,
        products,
        productsLoading,
        refreshProducts,
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
