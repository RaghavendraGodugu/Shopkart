import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

// ======================================================
// CREATE CONTEXT
// ======================================================

const CartContext = createContext(null);

// ======================================================
// CART PROVIDER
// ======================================================

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ====================================================
  // FETCH CART
  // ====================================================

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      if (response.data.success) {
        setCartItems(response.data.cart || []);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);

      if (err.response?.status !== 401) {
        setError(
          err.response?.data?.message ||
            "Failed to load cart"
        );
      }

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ====================================================
  // INITIAL CART LOAD
  // ====================================================

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ====================================================
  // ADD TO CART
  // ====================================================

  const addToCart = async (productId) => {
    try {
      setError("");

      const response = await api.post(
        `/cart/${productId}`
      );

      if (response.data.success) {
        // Update cart
        setCartItems(response.data.cart || []);

        // Backend returns product with updated stock
        const updatedProduct =
          response.data.updatedProduct;

        // Notify Products page,
        // Product Details page,
        // Navbar, etc.
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: {
              product: updatedProduct,
            },
          })
        );

        return {
          success: true,

          message:
            response.data.message ||
            "Product added to cart",

          updatedProduct,
        };
      }

      return {
        success: false,

        message:
          response.data.message ||
          "Failed to add product",
      };
    } catch (err) {
      console.error(
        "Add to cart error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to add product to cart";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // ====================================================
  // UPDATE CART QUANTITY
  // ====================================================

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    try {
      setError("");

      const response = await api.patch(
        `/cart/${productId}`,
        {
          quantity,
        }
      );

      if (response.data.success) {
        // Update cart
        setCartItems(response.data.cart || []);

        // Backend returns updated product
        const updatedProduct =
          response.data.updatedProduct;

        // Notify other components about
        // the new stock value
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: {
              product: updatedProduct,
            },
          })
        );

        return {
          success: true,

          message:
            response.data.message ||
            "Quantity updated",

          updatedProduct,
        };
      }

      return {
        success: false,

        message:
          response.data.message ||
          "Failed to update quantity",
      };
    } catch (err) {
      console.error(
        "Update cart quantity error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to update quantity";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // ====================================================
  // REMOVE FROM CART
  // ====================================================

  const removeFromCart = async (productId) => {
    try {
      setError("");

      const response = await api.delete(
        `/cart/${productId}`
      );

      if (response.data.success) {
        // Update cart
        setCartItems(response.data.cart || []);

        // Backend returns product with
        // restored stock
        const updatedProduct =
          response.data.updatedProduct;

        // Notify other components
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: {
              product: updatedProduct,
            },
          })
        );

        return {
          success: true,

          message:
            response.data.message ||
            "Product removed from cart",

          updatedProduct,
        };
      }

      return {
        success: false,

        message:
          response.data.message ||
          "Failed to remove product",
      };
    } catch (err) {
      console.error(
        "Remove from cart error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to remove product";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // ====================================================
  // REFRESH CART
  // ====================================================

  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  // ====================================================
  // TOTAL ITEM COUNT
  //
  // Example:
  //
  // Product A × 2
  // Product B × 3
  //
  // totalItems = 5
  // ====================================================

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        return (
          total +
          Number(item.quantity || 0)
        );
      },
      0
    );
  }, [cartItems]);

  // ====================================================
  // SUBTOTAL
  // ====================================================

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        const price = Number(
          item.product?.price || 0
        );

        const quantity = Number(
          item.quantity || 0
        );

        return (
          total +
          price * quantity
        );
      },
      0
    );
  }, [cartItems]);

  // ====================================================
  // CART ITEM COUNT
  //
  // Number of different products
  // ====================================================

  const cartItemCount =
    cartItems.length;

  // ====================================================
  // CLEAR ERROR
  // ====================================================

  const clearError = () => {
    setError("");
  };

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value = {
    // Cart
    cartItems,

    // States
    loading,
    error,

    // Calculations
    totalItems,
    cartItemCount,
    subtotal,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,

    // Utility
    refreshCart,
    clearError,
  };

  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}