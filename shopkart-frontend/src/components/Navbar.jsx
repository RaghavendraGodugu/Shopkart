import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const ShoppingBagIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const HeartIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const LogOutIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { totalItems, refreshCart } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    try {
      const response = await api.get("/wishlist");
      if (response.data.success) {
        setWishlistCount(response.data.wishlist?.length || 0);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist count:", error);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetchWishlistCount();
    window.addEventListener("wishlistUpdated", fetchWishlistCount);
    return () => window.removeEventListener("wishlistUpdated", fetchWishlistCount);
  }, []);

  // Refresh cart on mount so the badge is correct after login
  // (CartProvider fetches once at app start, often as a guest).
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const NavLink = ({ to, icon, label, count, badgeColor }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive 
            ? "bg-slate-100 text-blue-600" 
            : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
        }`}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
        {count !== undefined && (
          <span className={`min-w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold leading-none px-1.5 ml-1 ${
            count > 0 ? badgeColor : "bg-slate-100 text-slate-500"
          }`}>
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-700 transition">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
              Shop<span className="text-blue-600">Kart</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink 
              to="/products"
              label="Products"
            />
            
            <NavLink 
              to="/wishlist" 
              icon={<HeartIcon className="w-4 h-4" />} 
              label="Wishlist" 
              count={wishlistCount}
              badgeColor="bg-pink-100 text-pink-600"
            />
            
            <NavLink 
              to="/cart" 
              icon={<ShoppingBagIcon className="w-4 h-4" />} 
              label="Cart" 
              count={totalItems}
              badgeColor="bg-blue-100 text-blue-600"
            />
            
            <NavLink 
              to="/orders" 
              icon={<PackageIcon className="w-4 h-4" />} 
              label="Orders" 
            />

            {/* Separator */}
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

            {/* User Profile / Logout */}
            <div className="flex items-center gap-4 ml-1">
              {user && (
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">
                    {(user.fullName || "Shopper").split(' ')[0]}
                  </p>
                  <p className="text-xs text-slate-500">Customer</p>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="p-2 sm:px-4 sm:py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 border border-transparent hover:border-red-100"
                title="Logout"
              >
                <LogOutIcon className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
