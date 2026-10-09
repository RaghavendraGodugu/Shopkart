import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import { useLocation } from "react-router-dom";

function Products() {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [wishlistParams, setWishlistParams] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    location.state?.category || ""
  );

  const [loading, setLoading] = useState(true);

  // Keep category in sync when navigating from Home category cards
  // (location.state changes without remounting this component).
  useEffect(() => {
    if (location.state?.category !== undefined) {
      setCategory(location.state.category || "");
    }
  }, [location.state?.category]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch products first (public). Fetch wishlist separately so a
      // 401 on wishlist (guest user) doesn't wipe out the product list.
      const productsRes = await api.get("/products", {
        params: { search, category },
      });

      if (productsRes.data.success) {
        setProducts(productsRes.data.products || []);
      }

      try {
        const wishlistRes = await api.get("/wishlist");
        if (wishlistRes.data.success) {
          const list = wishlistRes.data.wishlist || [];
          // Backend returns populated products directly.
          const wIds = list.map((item) => item._id || item.product?._id).filter(Boolean);
          setWishlistParams(wIds);
        }
      } catch (wishlistError) {
        // Guests / expired sessions simply see no wishlist hearts.
        if (wishlistError.response?.status !== 401) {
          console.error("Wishlist fetch error:", wishlistError);
        }
        setWishlistParams([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, category]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header section with search & filter */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Our Collection</h1>
              <p className="text-sm text-slate-500 mt-1">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
            
            <div className="w-full md:w-auto">
              <SearchBar
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-100 h-96 animate-pulse p-4 flex flex-col">
                <div className="w-full h-48 bg-slate-100 rounded-xl mb-4"></div>
                <div className="w-16 h-3 bg-slate-100 rounded-full mb-3"></div>
                <div className="w-3/4 h-5 bg-slate-200 rounded-lg mb-2"></div>
                <div className="w-1/2 h-5 bg-slate-200 rounded-lg mb-4"></div>
                <div className="mt-auto flex justify-between items-center border-t border-slate-50 pt-4 mb-4">
                  <div className="w-1/3 h-6 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="w-full h-10 bg-slate-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm mt-10">
            <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-4xl mb-4 text-slate-300 border border-slate-100">
              🔍
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No products found</h2>
            <p className="text-slate-500 mb-6">
              We couldn't find anything matching "{search}" in {category || 'all categories'}.
            </p>
            <button 
              onClick={() => { setSearch(''); setCategory(''); }}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={wishlistParams.includes(product._id)}
                onWishlistUpdate={fetchData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
