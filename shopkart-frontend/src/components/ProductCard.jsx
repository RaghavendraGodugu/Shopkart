import { Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const HeartIcon = ({ className, filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export default function ProductCard({ product, isWishlisted, onWishlistUpdate }) {
  const { cartItems, addToCart } = useCart();
  
  const inCart = cartItems.find((item) => item.product?._id === product._id);

  // Status computation for UI badging
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const inStock = product.stock > 5;

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${product._id}`);
      } else {
        await api.post(`/wishlist/${product._id}`);
      }
      
      onWishlistUpdate();
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  const badgeConfig = {
    out: { bg: "bg-red-100/90 text-red-700 border-red-200", label: "Out of Stock" },
    low: { bg: "bg-amber-100/90 text-amber-700 border-amber-200", label: "Low Stock" },
    in: { bg: "bg-emerald-100/90 text-emerald-700 border-emerald-200", label: "In Stock" }
  };

  const badge = isOutOfStock ? badgeConfig.out : isLowStock ? badgeConfig.low : badgeConfig.in;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link to={`/products/${product._id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-70 grayscale-[30%]' : ''}`}
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/400x400/f8fafc/94a3b8?text=Image+Not+Found";
            }}
          />
        </Link>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border backdrop-blur-md shadow-sm ${badge.bg} uppercase tracking-wider`}>
            {badge.label}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 text-slate-500 hover:text-pink-500 hover:scale-110 active:scale-95 transition-all z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon 
            className={`w-5 h-5 transition-colors ${isWishlisted ? "text-pink-500" : ""}`} 
            filled={isWishlisted} 
          />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
            {product.category}
          </p>
          <Link to={`/products/${product._id}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug h-[42px]" title={product.name}>
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <p className="text-lg font-bold tracking-tight text-slate-900">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
          
          <div className="text-xs font-medium text-slate-500 text-right">
            {isLowStock && <span className="text-amber-600 mb-0.5 block hidden sm:block">Only {product.stock} left</span>}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {inCart ? (
            <Link 
              to="/cart" 
              className="btn-secondary text-sm h-10 flex items-center justify-center bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 py-0"
            >
              View in Cart
            </Link>
          ) : (
            <button
              onClick={() => addToCart(product._id, 1)}
              disabled={isOutOfStock}
              className={`btn-primary text-sm h-10 flex items-center justify-center py-0 ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed border outline-none border-slate-200 hover:bg-slate-200' : ''}`}
            >
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
