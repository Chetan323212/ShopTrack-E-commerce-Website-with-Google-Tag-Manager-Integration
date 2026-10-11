import React, { createContext, useContext, useState, useEffect } from "react";
import {
  trackAddToCart,
  trackRemoveFromCart,
  trackViewCart,
} from "../utils/gtm";
import { apiSyncCart, apiGetCart } from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart and wishlist from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("aura_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("aura_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aura_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Storage write failed", e);
    }

    // Try syncing to Express backend if user token exists
    try {
      const savedUser = localStorage.getItem("aura_user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.token) {
          apiSyncCart(cart, promoCode, discountPercent, user.token).catch(() => {});
        }
      }
    } catch (e) {
      // Non-blocking
    }
  }, [cart, promoCode, discountPercent]);

  useEffect(() => {
    try {
      localStorage.setItem("aura_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }, [wishlist]);

  // Toast notification helper
  const showToast = (message, type = "success") => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1, selectedColor = "") => {
    setCart((prevCart) => {
      const productId = product.slug || product.id || product._id;
      const existingIndex = prevCart.findIndex(
        (item) =>
          (item.product.slug === productId ||
            item.product.id === productId ||
            item.product._id === productId) &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor }];
      }
    });

    // GA4 & GTM Event
    trackAddToCart(product, quantity, selectedColor);
    showToast(`Added "${product.name}" to your cart!`);
  };

  // Remove item from cart
  const removeFromCart = (productId, selectedColor) => {
    const itemToRemove = cart.find(
      (item) =>
        (item.product.slug === productId ||
          item.product.id === productId ||
          item.product._id === productId) &&
        (!selectedColor || item.selectedColor === selectedColor)
    );

    if (itemToRemove) {
      trackRemoveFromCart(itemToRemove.product, itemToRemove.quantity);
    }

    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            (item.product.slug === productId ||
              item.product.id === productId ||
              item.product._id === productId) &&
            (!selectedColor || item.selectedColor === selectedColor)
          )
      )
    );
    showToast("Item removed from cart", "info");
  };

  // Update item quantity
  const updateQuantity = (productId, selectedColor, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          (item.product.slug === productId ||
            item.product.id === productId ||
            item.product._id === productId) &&
          (!selectedColor || item.selectedColor === selectedColor)
        ) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setPromoCode("");
  };

  // Apply promo coupon
  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "AURA20") {
      setDiscountPercent(20);
      setPromoCode("AURA20");
      showToast("Coupon 'AURA20' applied! 20% discount granted 🎉");
      return { success: true, message: "20% discount applied!" };
    } else if (cleanCode === "WELCOME10") {
      setDiscountPercent(10);
      setPromoCode("WELCOME10");
      showToast("Coupon 'WELCOME10' applied! 10% discount granted 🎉");
      return { success: true, message: "10% discount applied!" };
    } else {
      showToast("Invalid promo code. Try 'AURA20'", "error");
      return { success: false, message: "Invalid code" };
    }
  };

  // Toggle wishlist
  const toggleWishlist = (product) => {
    const productId = product.slug || product.id || product._id;
    const isPresent = wishlist.some(
      (p) => p.slug === productId || p.id === productId || p._id === productId
    );

    if (isPresent) {
      setWishlist((prev) =>
        prev.filter(
          (p) => p.slug !== productId && p.id !== productId && p._id !== productId
        )
      );
      showToast(`Removed "${product.name}" from wishlist`, "info");
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to wishlist ❤️`);
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(
      (p) => p.slug === productId || p.id === productId || p._id === productId
    );
  };

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.0;
  const estimatedTax = (subtotal - discountAmount) * 0.08;
  const grandTotal = Math.max(
    0,
    subtotal - discountAmount + shipping + (subtotal > 0 ? estimatedTax : 0)
  );

  // Toggle cart drawer with GA4 tracking
  const handleOpenCart = (open) => {
    setIsCartOpen(open);
    if (open && cart.length > 0) {
      trackViewCart(cart, grandTotal);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discountPercent,
        discountAmount,
        shipping,
        estimatedTax,
        grandTotal,
        promoCode,
        applyPromoCode,
        isCartOpen,
        setIsCartOpen: handleOpenCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
