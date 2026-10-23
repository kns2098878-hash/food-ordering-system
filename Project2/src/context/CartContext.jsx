import { createContext, useContext, useState, useEffect } from "react";
import { validateCoupon } from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("foodie_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [restaurant, setRestaurant] = useState(() => {
    try {
      const stored = localStorage.getItem("foodie_cart_restaurant");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem("foodie_cart", JSON.stringify(cart));
    if (cart.length === 0) {
      setRestaurant(null);
      localStorage.removeItem("foodie_cart_restaurant");
      setCoupon(null);
    }
  }, [cart]);

  useEffect(() => {
    if (restaurant) {
      localStorage.setItem("foodie_cart_restaurant", JSON.stringify(restaurant));
    }
  }, [restaurant]);

  const addToCart = (item, qty = 1, restInfo = null, notes = "") => {
    const effectivePrice = Number(item.discount_price ?? item.price);

    // If item from another restaurant, reset cart with new restaurant
    if (restInfo && restaurant && restaurant.id !== restInfo.id) {
      const confirmSwitch = window.confirm(
        `Your cart contains items from "${restaurant.name}". Would you like to clear your cart to add items from "${restInfo.name}"?`
      );
      if (!confirmSwitch) return false;
      setCart([{ ...item, price: effectivePrice, quantity: qty, notes }]);
      setRestaurant(restInfo);
      setCoupon(null);
      return true;
    }

    if (restInfo && !restaurant) {
      setRestaurant(restInfo);
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        if (notes) updated[existingIndex].notes = notes;
        return updated;
      }
      return [...prev, { ...item, price: effectivePrice, quantity: qty, notes }];
    });
    return true;
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setRestaurant(null);
    setCoupon(null);
    localStorage.removeItem("foodie_cart");
    localStorage.removeItem("foodie_cart_restaurant");
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const deliveryFee = cart.length > 0 ? (restaurant?.delivery_fee ?? 30.0) : 0.0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;

  const discountAmount = coupon ? coupon.discount_amount : 0.0;
  const total = Math.max(0, Math.round((subtotal + tax + deliveryFee - discountAmount) * 100) / 100);

  const applyPromoCode = async (code) => {
    try {
      const res = await validateCoupon(code, subtotal);
      if (res.valid) {
        setCoupon({
          code: res.code,
          discount_amount: res.discount_amount,
          discount_type: res.discount_type,
        });
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || "Invalid coupon." };
    }
  };

  const removePromoCode = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        restaurant,
        coupon,
        subtotal,
        deliveryFee,
        tax,
        discountAmount,
        total,
        totalItemsCount: cart.reduce((c, i) => c + i.quantity, 0),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
