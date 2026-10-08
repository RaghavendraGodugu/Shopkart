import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const { cartItems, addToCart } = useCart();

  const isOutOfStock = product.stock === 0;

  // =====================================================
  // CART STATE
  // =====================================================

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartError, setCartError] = useState("");

  // =====================================================
  // WISHLIST STATE
  // =====================================================

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState("");

  // =====================================================
  // CHECK CART
  // =====================================================

  const cartItem = cartItems.find(
    (item) =>
      String(item.product?._id) === String(product._id)
  );

  const isInCart = Boolean(cartItem);

  // =====================================================
  // CHECK WISHLIST
  // =====================================================

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const response = await api.get("/wishlist");

        const wishlist = response.data.wishlist || [];

        const exists = wishlist.some(
          (wishlistProduct) =>
            String(wishlistProduct._id) ===
            String(product._id)
        );

        setIsWishlisted(exists);
      } catch (error) {
        console.error(
          "Wishlist check error:",
          error.response?.data || error
        );
      }
    };

    if (product?._id) {
      checkWishlist();
    }
  }, [product?._id]);

  // =====================================================
  // WISHLIST TOGGLE
  // =====================================================

  const handleWishlistToggle = async (event) => {
    event.stopPropagation();

    if (wishlistLoading) {
      return;
    }

    try {
      setWishlistLoading(true);
      setWishlistError("");

      if (isWishlisted) {
        // REMOVE FROM WISHLIST
        const response = await api.delete(
          `/wishlist/${product._id}`
        );

        console.log(
          "Wishlist remove:",
          response.data
        );

        if (response.data.success !== false) {
          setIsWishlisted(false);

          // Tell Navbar / other components
          window.dispatchEvent(
            new Event("wishlistUpdated")
          );
        }
      } else {
        // ADD TO WISHLIST
        const response = await api.post(
          `/wishlist/${product._id}`
        );

        console.log(
          "Wishlist add:",
          response.data
        );

        if (response.data.success !== false) {
          setIsWishlisted(true);

          window.dispatchEvent(
            new Event("wishlistUpdated")
          );
        }
      }
    } catch (error) {
      console.error(
        "Wishlist toggle error:",
        error.response?.data || error
      );

      setWishlistError(
        error.response?.data?.message ||
          "Unable to update wishlist."
      );

      setTimeout(() => {
        setWishlistError("");
      }, 2500);
    } finally {
      setWishlistLoading(false);
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async (event) => {
    event.stopPropagation();

    if (isOutOfStock || addingToCart) {
      return;
    }

    try {
      setAddingToCart(true);
      setCartError("");

      const result = await addToCart(product._id);

      if (!result?.success) {
        setCartError(
          result?.message ||
            "Unable to add product to cart."
        );

        setTimeout(() => {
          setCartError("");
        }, 2500);
      }
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      setCartError(
        error.response?.data?.message ||
          "Unable to add product to cart."
      );

      setTimeout(() => {
        setCartError("");
      }, 2500);
    } finally {
      setAddingToCart(false);
    }
  };

  // =====================================================
  // GO TO CART
  // =====================================================

  const handleGoToCart = (event) => {
    event.stopPropagation();

    navigate("/cart");
  };

  // =====================================================
  // PRODUCT DETAILS
  // =====================================================

  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">

      {/* =================================================
          PRODUCT IMAGE
      ================================================= */}

      <div className="relative aspect-square overflow-hidden bg-gray-50">

        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x600/f3f4f6/6b7280?text=ShopKart";
          }}
        />

        {/* STOCK BADGE */}

        <div className="absolute left-3 top-3">
          {isOutOfStock ? (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              Out of stock
            </span>
          ) : (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
              {product.stock} left
            </span>
          )}
        </div>

        {/* =================================================
            WISHLIST BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          title={
            isWishlisted
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
          aria-label={
            isWishlisted
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border bg-white text-xl shadow-sm transition ${
            isWishlisted
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          {wishlistLoading ? (
            <span className="text-xs text-gray-400">
              ...
            </span>
          ) : isWishlisted ? (
            "♥"
          ) : (
            "♡"
          )}
        </button>

      </div>

      {/* =================================================
          PRODUCT INFORMATION
      ================================================= */}

      <div className="p-5">

        {/* CATEGORY */}

        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-blue-600">
          {product.category}
        </p>

        {/* NAME */}

        <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-semibold text-gray-900">
          {product.name}
        </h3>

        {/* PRICE */}

        <p className="mt-3 text-xl font-bold text-gray-900">
          ₹
          {Number(product.price).toLocaleString(
            "en-IN"
          )}
        </p>

        {/* STOCK */}

        <p className="mt-2 text-sm text-gray-500">
          {isOutOfStock
            ? "Currently unavailable"
            : `${product.stock} units available`}
        </p>

        {/* =================================================
            ERROR MESSAGES
        ================================================= */}

        {cartError && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {cartError}
          </div>
        )}

        {wishlistError && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {wishlistError}
          </div>
        )}

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="mt-5 flex gap-2">

          {/* CART */}

          {isInCart ? (
            <button
              type="button"
              onClick={handleGoToCart}
              className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              ✓ Go to Cart
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                isOutOfStock || addingToCart
              }
              className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                isOutOfStock
                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                  : addingToCart
                  ? "cursor-wait bg-blue-400 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {addingToCart
                ? "Adding..."
                : isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          )}

          {/* WISHLIST */}

          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            title={
              isWishlisted
                ? "Remove from Wishlist"
                : "Add to Wishlist"
            }
            aria-label={
              isWishlisted
                ? "Remove from Wishlist"
                : "Add to Wishlist"
            }
            className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border text-xl transition ${
              isWishlisted
                ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                : "border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            {wishlistLoading ? (
              <span className="text-xs text-gray-400">
                ...
              </span>
            ) : isWishlisted ? (
              "♥"
            ) : (
              "♡"
            )}
          </button>

        </div>

        {/* =================================================
            VIEW DETAILS
        ================================================= */}

        <button
          type="button"
          onClick={handleViewDetails}
          className="mt-2.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          View Details
        </button>

      </div>
    </div>
  );
}