// C:\Users\User\Downloads\canwear-project-updated\CanWearProject\client\src\context\CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const defaultShippingInfo = {
  fullName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "USA"
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("canwear-cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [shippingInfo, setShippingInfo] = useState(() => {
    const saved = localStorage.getItem("canwear-shipping-info");
    return saved ? { ...defaultShippingInfo, ...JSON.parse(saved) } : defaultShippingInfo;
  });

  useEffect(() => {
    localStorage.setItem("canwear-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("canwear-shipping-info", JSON.stringify(shippingInfo));
  }, [shippingInfo]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const updateShippingInfo = (patch) => {
    setShippingInfo((prev) => ({ ...prev, ...patch }));
  };

  const clearCart = () => setCart([]);
  const resetShippingInfo = () => setShippingInfo(defaultShippingInfo);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 80 || subtotal === 0 ? 0 : 8;
    const total = subtotal + shipping;

    return {
      subtotal,
      shipping,
      total
    };
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totals,
        shippingInfo,
        updateShippingInfo,
        resetShippingInfo
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}