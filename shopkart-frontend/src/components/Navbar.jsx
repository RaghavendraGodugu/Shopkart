import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useCart } from "../context/CartContext";


export default function Navbar({ user }) {
  const navigate = useNavigate();

  // ======================================================
  // CART
  // ======================================================

  const { totalItems } = useCart();

  // ======================================================
  // WISHLIST
  // ======================================================

  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    try {
      const response = await api.get("/wishlist");

      if (response.data.success) {
        const wishlist =
          response.data.wishlist || [];

        setWishlistCount(wishlist.length);
      }
    } catch (error) {
      console.error(
        "Failed to fetch wishlist count:",
        error
      );

      setWishlistCount(0);
    }
  };

  // Fetch wishlist when Navbar loads
  useEffect(() => {
    fetchWishlistCount();
  }, []);

  // Listen for wishlist changes
  useEffect(() => {
    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );
    };
  }, []);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login", {
        replace: true,
      });
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">

        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/home"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          Shop<span className="text-blue-600">Kart</span>
        </Link>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <div className="flex items-center gap-3 sm:gap-6">

          {/* HOME */}

          <Link
            to="/home"
            className="hidden text-sm font-medium text-gray-600 transition hover:text-blue-600 sm:block"
          >
            Home
          </Link>

          {/* PRODUCTS */}

          <Link
            to="/products"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            Products
          </Link>

          {/* ==================================================
              WISHLIST
          ================================================== */}

          <Link
            to="/wishlist"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            <span>Wishlist</span>

            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
              {wishlistCount}
            </span>
          </Link>

          {/* ==================================================
              CART
          ================================================== */}

          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            <span>Cart</span>

            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
              {totalItems}
            </span>
          </Link>
          <Link
  to="/orders"
  className="text-sm font-medium text-gray-700 hover:text-black"
>
  My Orders
</Link>

          {/* ==================================================
              USER
          ================================================== */}

          {user && (
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-gray-800">
                {user.fullName}
              </p>

              <p className="text-xs text-gray-400">
                Customer
              </p>
            </div>
          )}

          {/* ==================================================
              LOGOUT
          ================================================== */}

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}