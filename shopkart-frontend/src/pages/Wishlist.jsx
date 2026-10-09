import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import WishlistCard from "../components/WishlistCard";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/wishlist");

      // Backend returns populated products directly:
      // { success: true, wishlist: [{ _id, name, ... }, ...] }
      // Be tolerant of a { product } wrapper just in case.
      const raw = response.data.wishlist || [];
      const products = raw.map((item) => item.product || item);

      setWishlist(products);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);

      if (error.response?.status === 401) {
        setError("Please login to view your wishlist.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load wishlist."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);

      setWishlist((currentWishlist) =>
        currentWishlist.filter(
          (product) => product._id !== productId
        )
      );

      // Keep the Navbar badge in sync.
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Remove wishlist error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to remove product."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-10 max-w-md w-full text-center shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-4 font-serif">!</div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">My Wishlist</h1>
            <p className="text-slate-500 mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <button onClick={fetchWishlist} className="btn-primary">
                Try Again
              </button>
              <Link to="/products" className="btn-secondary text-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">ShopKart</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Wishlist</h1>
            <p className="text-sm text-slate-500 mt-2">
              {wishlist.length === 0
                ? "Save products you love."
                : `${wishlist.length} ${
                    wishlist.length === 1
                      ? "product"
                      : "products"
                  } saved`}
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 hidden sm:block"
          >
            Continue Shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-4xl mb-4 text-slate-300 border border-slate-100">
              ♡
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h2>

            <p className="text-slate-500 mb-6">
              Products you save will appear here.
            </p>

            <Link
              to="/products"
              className="btn-primary max-w-xs mx-auto"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={removeFromWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
