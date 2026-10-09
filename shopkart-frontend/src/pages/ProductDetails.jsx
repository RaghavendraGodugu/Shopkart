import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const HeartIcon = ({ className, filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const TruckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="13" x="2" y="6" rx="2"/><path d="M18 19h.01M6 19h.01M18 10V6h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1M6 19a2 2 0 1 1-2-2M18 19a2 2 0 1 1-2-2M14 19h2M18 10h-2"/>
  </svg>
);

const RefreshCcwIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/>
  </svg>
);

const ShieldCheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { cartItems, addToCart } = useCart();
  const inCart = cartItems.find((item) => item.product?._id === id);

  useEffect(() => {
    const fetchProductAndWishlist = async () => {
      try {
        setLoading(true);

        const productRes = await api.get(`/products/${id}`);

        if (productRes.data.success) {
          setProduct(productRes.data.product);
        } else {
          setError("Product not found");
        }

        // Wishlist is optional — a 401 (guest) must not break the page.
        try {
          const wishlistRes = await api.get("/wishlist");
          if (wishlistRes.data.success) {
            const wList = wishlistRes.data.wishlist || [];
            // Backend returns populated products directly (no { product } wrapper)
            const found = wList.some(
              (item) => (item._id || item.product?._id)?.toString() === id
            );
            setIsWishlisted(found);
          }
        } catch (wishlistErr) {
          if (wishlistErr.response?.status !== 401) {
            console.error("Wishlist fetch error:", wishlistErr);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndWishlist();
  }, [id]);

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${id}`);
      } else {
        await api.post(`/wishlist/${id}`);
      }
      setIsWishlisted(!isWishlisted);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-10 max-w-md w-full text-center shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-4 font-serif">!</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Notice</h2>
            <p className="text-slate-500 mb-6">{error || "Product not found"}</p>
            <button onClick={() => navigate("/products")} className="btn-primary">
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex text-sm font-medium text-slate-500 mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li><button onClick={() => navigate("/home")} className="hover:text-blue-600 transition-colors">Home</button></li>
            <li><span className="mx-1.5 md:mx-2 text-slate-300">/</span></li>
            <li><button onClick={() => navigate("/products")} className="hover:text-blue-600 transition-colors">Products</button></li>
            <li><span className="mx-1.5 md:mx-2 text-slate-300">/</span></li>
            <li><span className="text-slate-800 line-clamp-1">{product.name}</span></li>
          </ol>
        </nav>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2 relative bg-slate-50 flex items-center justify-center p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-200">
            <button
              onClick={handleWishlistToggle}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border border-slate-100 text-slate-400 hover:text-pink-500 hover:scale-110 active:scale-95 transition-all z-10"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <HeartIcon className={`w-6 h-6 ${isWishlisted ? "text-pink-500" : ""}`} filled={isWishlisted} />
            </button>
            
            <div className="w-full max-w-md aspect-square relative">
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-contain rounded-xl ${isOutOfStock ? 'opacity-70 grayscale-[20%]' : ''}`}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x600/f8fafc/94a3b8?text=Image+Not+Found";
                }}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="mb-2 inline-flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest border border-slate-200">
                {product.category}
              </span>
              
              {isOutOfStock ? (
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider border border-red-100">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider border border-amber-100">
                  Only {product.stock} Left
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider border border-emerald-100">
                  In Stock
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4 tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-end gap-3 mb-8 pb-8 border-b border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
              <p className="text-sm font-medium text-slate-500 mb-1">
                (incl. of all taxes)
              </p>
            </div>

            <div className="prose prose-slate prose-sm sm:prose-base mb-10 max-w-none text-slate-600 leading-relaxed">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="mt-auto mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-100 rounded-xl p-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 shrink-0">
                  <TruckIcon className="w-5 h-5"/>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Fast</p>
                  <p className="text-sm font-medium text-slate-900">Delivery</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 shrink-0">
                  <RefreshCcwIcon className="w-5 h-5"/>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">14 Days</p>
                  <p className="text-sm font-medium text-slate-900">Return</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 shrink-0">
                  <ShieldCheckIcon className="w-5 h-5"/>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">1 Year</p>
                  <p className="text-sm font-medium text-slate-900">Warranty</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {inCart ? (
                <button
                  onClick={() => navigate("/cart")}
                  className="btn-secondary h-12 text-base font-semibold bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  View in Cart
                </button>
              ) : (
                <button
                  onClick={() => addToCart(product._id, 1)}
                  disabled={isOutOfStock}
                  className={`btn-primary h-12 text-base font-semibold shadow-sm shadow-blue-500/20 ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed border outline-none border-slate-200 hover:bg-slate-200' : ''}`}
                >
                  {isOutOfStock ? 'Sold Out' : 'Add to Cart — ₹' + Number(product.price).toLocaleString("en-IN")}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
