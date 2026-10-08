import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    loading,
    error,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [updatingProduct, setUpdatingProduct] =
    useState(null);

  const [removingProduct, setRemovingProduct] =
    useState(null);

  // ======================================================
  // FORMAT PRICE
  // ======================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  };

  // ======================================================
  // INCREASE QUANTITY
  // ======================================================

  const handleIncrease = async (item) => {
    const productId = item.product._id;

    const currentQuantity = item.quantity;

    const stock = Number(
      item.product.stock || 0
    );

    if (currentQuantity >= stock) {
      return;
    }

    try {
      setUpdatingProduct(productId);

      await updateQuantity(
        productId,
        currentQuantity + 1
      );
    } finally {
      setUpdatingProduct(null);
    }
  };

  // ======================================================
  // DECREASE QUANTITY
  // ======================================================

  const handleDecrease = async (item) => {
    const productId = item.product._id;

    const currentQuantity = item.quantity;

    if (currentQuantity <= 1) {
      return;
    }

    try {
      setUpdatingProduct(productId);

      await updateQuantity(
        productId,
        currentQuantity - 1
      );
    } finally {
      setUpdatingProduct(null);
    }
  };

  // ======================================================
  // REMOVE PRODUCT
  // ======================================================

  const handleRemove = async (productId) => {
    try {
      setRemovingProduct(productId);

      await removeFromCart(productId);
    } finally {
      setRemovingProduct(null);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-10">

          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            <div className="space-y-4 lg:col-span-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>

            <div className="h-64 animate-pulse rounded-2xl bg-white" />

          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 py-16">

        <div className="mx-auto max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            !
          </div>

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Unable to load your cart
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  // ======================================================
  // EMPTY CART
  // ======================================================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 py-16">

        <div className="mx-auto max-w-xl text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-sm">
            🛒
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Looks like you haven't added anything
            to your cart yet.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Start Shopping
          </Link>

        </div>
      </div>
    );
  }

  // ======================================================
  // CART PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Your Cart
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>

        </div>
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ==================================================
              CART ITEMS
          ================================================== */}

          <div className="space-y-4 lg:col-span-2">

            {cartItems.map((item) => {
              const product = item.product;

              const productId = product._id;

              const isUpdating =
                updatingProduct === productId;

              const isRemoving =
                removingProduct === productId;

              const stock = Number(
                product.stock || 0
              );

              const quantity = Number(
                item.quantity || 1
              );

              const itemTotal =
                Number(product.price || 0) *
                quantity;

              return (
                <div
                  key={productId}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
                >

                  <div className="flex gap-4">

                    {/* PRODUCT IMAGE */}

                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:h-36 sm:w-36">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/400x400/f3f4f6/6b7280?text=ShopKart";
                        }}
                      />

                    </div>

                    {/* PRODUCT DETAILS */}

                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                        {product.category}
                      </p>

                      <h2 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900 sm:text-lg">
                        {product.name}
                      </h2>

                      <p className="mt-2 text-lg font-bold text-gray-900">
                        ₹{formatPrice(product.price)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {stock} units available
                      </p>

                    </div>

                  </div>

                  {/* ==================================================
                      CONTROLS
                  ================================================== */}

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                    {/* QUANTITY */}

                    <div className="flex items-center rounded-lg border border-gray-200">

                      <button
                        onClick={() =>
                          handleDecrease(item)
                        }
                        disabled={
                          quantity <= 1 ||
                          isUpdating ||
                          isRemoving
                        }
                        className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                      >
                        −
                      </button>

                      <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-200 px-3 text-sm font-semibold text-gray-900">
                        {isUpdating
                          ? "..."
                          : quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleIncrease(item)
                        }
                        disabled={
                          quantity >= stock ||
                          isUpdating ||
                          isRemoving
                        }
                        className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                      >
                        +
                      </button>

                    </div>

                    {/* TOTAL + REMOVE */}

                    <div className="flex items-center gap-4">

                      <p className="text-sm font-bold text-gray-900">
                        ₹{formatPrice(itemTotal)}
                      </p>

                      <button
                        onClick={() =>
                          handleRemove(productId)
                        }
                        disabled={
                          isRemoving ||
                          isUpdating
                        }
                        className="text-sm font-medium text-red-500 transition hover:text-red-700 disabled:text-gray-300"
                      >
                        {isRemoving
                          ? "Removing..."
                          : "Remove"}
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

            {/* CONTINUE SHOPPING */}

            <Link
              to="/products"
              className="inline-flex text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              ← Continue Shopping
            </Link>

          </div>

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <div className="lg:col-span-1">

            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Items
                  </span>

                  <span className="font-medium text-gray-900">
                    {totalItems}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹{formatPrice(subtotal)}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-medium text-green-600">
                    Free
                  </span>

                </div>

              </div>

              <div className="my-6 border-t border-gray-100" />

              <div className="flex items-center justify-between">

                <span className="font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  ₹{formatPrice(subtotal)}
                </span>

              </div>

              {/* CHECKOUT */}

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Proceed to Checkout
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Secure checkout
              </p>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}