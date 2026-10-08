import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cartItems, addToCart } = useCart();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cart state
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState("");

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);

        setProduct(response.data.product);
      } catch (err) {
        console.error("Product details error:", err);

        setError(
          err.response?.data?.message ||
            "Something went wrong while loading the product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =====================================================
  // CHECK WISHLIST
  // =====================================================

  useEffect(() => {
    const checkWishlist = async () => {
      if (!product?._id) return;

      try {
        const response = await api.get("/wishlist");

        console.log("Wishlist response:", response.data);

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

        // Don't block the product page if wishlist
        // checking fails.
      }
    };

    checkWishlist();
  }, [product?._id]);

  // =====================================================
  // CART
  // =====================================================

  const cartItem = cartItems.find(
    (item) =>
      String(item.product?._id) ===
      String(product?._id)
  );

  const isInCart = Boolean(cartItem);

  // =====================================================
  // WISHLIST TOGGLE
  // =====================================================

  const handleWishlistToggle = async () => {
    if (!product?._id || wishlistLoading) {
      return;
    }

    try {
      setWishlistLoading(true);
      setWishlistError("");

      if (isWishlisted) {
        // ===============================================
        // REMOVE
        // ===============================================

        const response = await api.delete(
          `/wishlist/${product._id}`
        );

        console.log(
          "Remove wishlist response:",
          response.data
        );

        if (response.data.success !== false) {
          setIsWishlisted(false);

          window.dispatchEvent(
            new Event("wishlistUpdated")
          );
        }
      } else {
        // ===============================================
        // ADD
        // ===============================================

        const response = await api.post(
          `/wishlist/${product._id}`
        );

        console.log(
          "Add wishlist response:",
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
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      setWishlistError(
        error.response?.data?.message ||
          "Unable to update wishlist."
      );

      setTimeout(() => {
        setWishlistError("");
      }, 3000);
    } finally {
      setWishlistLoading(false);
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) {
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");
      setCartError("");

      const result = await addToCart(product._id);

      if (result.success) {
        setCartMessage("Added to cart");

        setTimeout(() => {
          setCartMessage("");
        }, 2000);
      } else {
        setCartError(
          result.message ||
            "Unable to add product to cart"
        );

        setTimeout(() => {
          setCartError("");
        }, 3000);
      }
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      setCartError(
        "Unable to add product to cart"
      );

      setTimeout(() => {
        setCartError("");
      }, 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  // =====================================================
  // GO TO CART
  // =====================================================

  const handleGoToCart = () => {
    navigate("/cart");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

            <p className="mt-4 text-sm text-gray-500">
              Loading product...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PRODUCT ERROR
  // =====================================================

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <Navbar />

        <main className="mx-auto max-w-3xl px-5 py-16 text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">

            <h1 className="text-xl font-semibold text-gray-900">
              Product not found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error ||
                "This product could not be found."}
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back to Products
            </button>

          </div>
        </main>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:py-14">

        {/* Back */}

        <Link
          to="/products"
          className="mb-8 inline-flex text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          ← Back to Products
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="grid md:grid-cols-2">

            {/* =================================================
                IMAGE
            ================================================= */}

            <div className="min-h-[350px] bg-gray-50 md:min-h-[550px]">

              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/800x800/f3f4f6/6b7280?text=ShopKart";
                }}
              />

            </div>

            {/* =================================================
                DETAILS
            ================================================= */}

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                {product.category}
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-5 text-3xl font-bold text-gray-900">
                ₹
                {Number(product.price).toLocaleString(
                  "en-IN"
                )}
              </p>

              <div className="my-7 h-px bg-gray-100"></div>

              <p className="text-sm leading-7 text-gray-600">
                {product.description}
              </p>

              {/* =================================================
                  STOCK
              ================================================= */}

              <div className="mt-7">

                {isOutOfStock ? (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    Out of stock
                  </div>
                ) : (
                  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {product.stock} units available
                  </div>
                )}

              </div>

              {/* =================================================
                  CART MESSAGE
              ================================================= */}

              {cartMessage && (
                <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  ✓ {cartMessage}
                </div>
              )}

              {cartError && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {cartError}
                </div>
              )}

              {/* =================================================
                  WISHLIST ERROR
              ================================================= */}

              {wishlistError && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {wishlistError}
                </div>
              )}

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="mt-6 flex items-center gap-3">

                {/* CART */}

                {isInCart ? (
                  <button
                    onClick={handleGoToCart}
                    className="flex-1 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    ✓ Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={
                      isOutOfStock ||
                      addingToCart
                    }
                    className={`flex-1 rounded-lg px-5 py-3.5 text-sm font-semibold text-white transition ${
                      isOutOfStock
                        ? "cursor-not-allowed bg-gray-300"
                        : addingToCart
                        ? "cursor-wait bg-blue-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {addingToCart
                      ? "Adding..."
                      : isOutOfStock
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                )}

                {/* =================================================
                    WISHLIST
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
                  className={`flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg border text-2xl transition ${
                    isWishlisted
                      ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                      : "border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  {wishlistLoading ? (
                    <span className="text-sm text-gray-400">
                      ...
                    </span>
                  ) : isWishlisted ? (
                    "♥"
                  ) : (
                    "♡"
                  )}
                </button>

              </div>

              <p className="mt-3 text-center text-xs text-gray-400">
                {wishlistLoading
                  ? "Updating wishlist..."
                  : isWishlisted
                  ? "Saved to your wishlist"
                  : "Add this product to your wishlist"}
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}