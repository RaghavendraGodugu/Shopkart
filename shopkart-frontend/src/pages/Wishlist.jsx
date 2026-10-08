import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
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

      console.log("Wishlist response:", response.data);

      setWishlist(response.data.wishlist || []);
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
      <div className="wishlist-page">
        <div className="wishlist-container">
          <h1>My Wishlist</h1>

          <div className="wishlist-loading">
            Loading your wishlist...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <h1>My Wishlist</h1>

          <div className="wishlist-error">
            <p>{error}</p>

            <button onClick={fetchWishlist}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">

        <div className="wishlist-header">
          <div>
            <span className="wishlist-label">
              SHOPKART
            </span>

            <h1>My Wishlist</h1>

            <p>
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
            className="continue-shopping"
          >
            Continue Shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-heart">
              ♡
            </div>

            <h2>Your wishlist is empty</h2>

            <p>
              Products you save will appear here.
            </p>

            <Link
              to="/products"
              className="shop-products-button"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
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