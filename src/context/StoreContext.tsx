'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, Coupon, DeliveryZone } from '@/types';
import { calculateOrderTotals, CalculationResult } from '@/lib/orders/calculator';

export interface CartLineItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface StoreContextType {
  cart: CartLineItem[];
  wishlist: Product[];
  appliedCoupon: Coupon | null;
  selectedDeliveryZone: DeliveryZone | null;
  isCartOpen: boolean;
  quickViewProduct: Product | null;
  totals: CalculationResult;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (lineItemId: string) => void;
  updateCartQuantity: (lineItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (coupon: Coupon | null) => void;
  setDeliveryZone: (zone: DeliveryZone | null) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<DeliveryZone | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Restore cart and wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('kl_cart');
      const savedWishlist = localStorage.getItem('kl_wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (err) {
      console.error('Failed to load local storage:', err);
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('kl_cart', JSON.stringify(cart));
      localStorage.setItem('kl_wishlist', JSON.stringify(wishlist));
    } catch (err) {
      console.error('Failed to save to local storage:', err);
    }
  }, [cart, wishlist, isLoaded]);

  // Recalculate totals whenever cart, coupon, or delivery zone changes
  const totals = calculateOrderTotals({
    items: cart.map(item => ({
      variant_id: item.variant.id,
      unit_price: item.variant.price,
      quantity: item.quantity,
    })),
    coupon: appliedCoupon,
    deliveryRate: selectedDeliveryZone?.rates?.[0] || null,
  });

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.variant.id === variant.id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        const newQty = Math.min(variant.stock_quantity, updated[existingIdx].quantity + quantity);
        updated[existingIdx].quantity = newQty;
        return updated;
      }
      return [
        ...prev,
        {
          id: `cart-${product.id}-${variant.id}`,
          product,
          variant,
          quantity: Math.min(variant.stock_quantity, quantity),
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (lineItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== lineItemId));
  };

  const updateCartQuantity = (lineItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === lineItemId) {
          const maxStock = item.variant.stock_quantity || 99;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  const applyCoupon = (coupon: Coupon | null) => {
    setAppliedCoupon(coupon);
  };

  const setDeliveryZone = (zone: DeliveryZone | null) => {
    setSelectedDeliveryZone(zone);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        appliedCoupon,
        selectedDeliveryZone,
        isCartOpen,
        quickViewProduct,
        totals,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        setDeliveryZone,
        setIsCartOpen,
        setQuickViewProduct,
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
