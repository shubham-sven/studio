'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, getArtworkById } from '@/lib/data';
import { useAuth } from './auth-context';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_ITEM'; payload: { artworkId: string; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_ITEM':
      if (!state.cart) return state;
      const existingItem = state.cart.items.find(
        item => item.artworkId === action.payload.artworkId
      );
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.cart.items.map(item =>
          item.artworkId === action.payload.artworkId
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        newItems = [
          ...state.cart.items,
          {
            id: `cart-item-${Date.now()}`,
            artworkId: action.payload.artworkId,
            quantity: action.payload.quantity || 1,
            addedAt: new Date().toISOString(),
          },
        ];
      }
      return {
        ...state,
        cart: {
          ...state.cart,
          items: newItems,
          updatedAt: new Date().toISOString(),
        },
      };
    case 'REMOVE_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(item => item.id !== action.payload),
          updatedAt: new Date().toISOString(),
        },
      };
    case 'UPDATE_QUANTITY':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map(item =>
            item.id === action.payload.cartItemId
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    case 'CLEAR_CART':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [],
          updatedAt: new Date().toISOString(),
        },
      };
    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addToCart: (artworkId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      dispatch({ type: 'SET_CART', payload: null });
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // In a real app, this would fetch from Firebase
      // For now, we'll use localStorage for persistence
      const savedCart = localStorage.getItem(`cart-${user.id}`);
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        dispatch({ type: 'SET_CART', payload: cart });
      } else {
        // Create empty cart
        const emptyCart: Cart = {
          id: `cart-${user.id}`,
          userId: user.id,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dispatch({ type: 'SET_CART', payload: emptyCart });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveCart = async (cart: Cart) => {
    try {
      localStorage.setItem(`cart-${cart.userId}`, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const addToCart = async (artworkId: string, quantity: number = 1) => {
    if (!user || !state.cart) {
      dispatch({ type: 'SET_ERROR', payload: 'Please log in to add items to cart' });
      return;
    }

    dispatch({ type: 'ADD_ITEM', payload: { artworkId, quantity } });

    // Save to localStorage
    if (state.cart) {
      const updatedCart = {
        ...state.cart,
        items: state.cart.items.map(item =>
          item.artworkId === artworkId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ).concat(
          state.cart.items.some(item => item.artworkId === artworkId)
            ? []
            : [{
                id: `cart-item-${Date.now()}`,
                artworkId,
                quantity,
                addedAt: new Date().toISOString(),
              }]
        ),
        updatedAt: new Date().toISOString(),
      };
      await saveCart(updatedCart);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!state.cart) return;

    dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
    const updatedCart = {
      ...state.cart,
      items: state.cart.items.filter(item => item.id !== cartItemId),
      updatedAt: new Date().toISOString(),
    };
    await saveCart(updatedCart);
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!state.cart) return;

    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
    const updatedCart = {
      ...state.cart,
      items: state.cart.items.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      ),
      updatedAt: new Date().toISOString(),
    };
    await saveCart(updatedCart);
  };

  const clearCart = async () => {
    if (!state.cart) return;

    dispatch({ type: 'CLEAR_CART' });
    const updatedCart = {
      ...state.cart,
      items: [],
      updatedAt: new Date().toISOString(),
    };
    await saveCart(updatedCart);
  };

  const getCartTotal = (): number => {
    if (!state.cart) return 0;
    return state.cart.items.reduce((total, item) => {
      const artwork = getArtworkById(item.artworkId);
      if (!artwork) return total;
      return total + (item.quantity * artwork.price);
    }, 0);
  };

  const getCartItemCount = (): number => {
    if (!state.cart) return 0;
    return state.cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
