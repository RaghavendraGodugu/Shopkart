import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/customers/me");
        // Backend returns { success: true, customer: {...} }
        // Be tolerant of legacy/flat shapes too.
        const customer =
          response.data?.customer ||
          (response.data?._id ? response.data : null);
        if (response.data?.success !== false && customer) {
          setUser(customer);
        } else {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
          
          {/* Abstract geometric shapes */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute top-32 right-32 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="max-w-2xl animate-fade-in">
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20 mb-6">
                🎉 Welcome back, {(user?.fullName || "Shopper").split(' ')[0]}
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
                Discover your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">favorite thing.</span>
              </h1>
              
              <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
                Explore our curated collection of electronics, fashion, books, and home essentials. Quality products perfectly suited for your everyday life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="inline-flex justify-center items-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-sm">
                  Shop Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </Link>
                <Link to="/orders" className="inline-flex justify-center items-center px-6 py-3.5 text-base font-semibold text-white bg-white/10 hover:bg-white/20 ring-1 ring-white/20 rounded-lg transition-all backdrop-blur-sm">
                  Track Orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Shop by Category</h2>
              <p className="text-slate-500 mt-1">Find exactly what you're looking for</p>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
              View all products <span aria-hidden="true" className="ml-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/products" state={{ category: "Electronics" }} className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 aspect-[4/3] flex items-center justify-center p-6 transition hover:shadow-md hover:border-blue-200">
              <div className="absolute inset-0 bg-blue-50/50 group-hover:bg-blue-50/80 transition-colors z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">Electronics</h3>
              </div>
            </Link>
            
            <Link to="/products" state={{ category: "Fashion" }} className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 aspect-[4/3] flex items-center justify-center p-6 transition hover:shadow-md hover:pink-200">
              <div className="absolute inset-0 bg-pink-50/50 group-hover:bg-pink-50/80 transition-colors z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-pink-600 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-pink-700">Fashion</h3>
              </div>
            </Link>
            
            <Link to="/products" state={{ category: "Books" }} className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 aspect-[4/3] flex items-center justify-center p-6 transition hover:shadow-md hover:border-amber-200">
              <div className="absolute inset-0 bg-amber-50/50 group-hover:bg-amber-50/80 transition-colors z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-amber-600 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-amber-700">Books</h3>
              </div>
            </Link>

            <Link to="/products" state={{ category: "Home" }} className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 aspect-[4/3] flex items-center justify-center p-6 transition hover:shadow-md hover:border-emerald-200">
              <div className="absolute inset-0 bg-emerald-50/50 group-hover:bg-emerald-50/80 transition-colors z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-emerald-600 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">Home</h3>
              </div>
            </Link>
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
              View all categories <span aria-hidden="true" className="ml-1">→</span>
            </Link>
          </div>
        </div>

        {/* Info/Trust Section */}
        <div className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="px-6 py-4 md:py-0">
                <div className="mx-auto w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">Free Delivery</h3>
                <p className="text-sm text-slate-500">Free delivery on all orders over ₹499 within India.</p>
              </div>
              <div className="px-6 py-4 md:py-0">
                <div className="mx-auto w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">Secure Payments</h3>
                <p className="text-sm text-slate-500">Fast and secure checkout via Razorpay with all major cards.</p>
              </div>
              <div className="px-6 py-4 md:py-0">
                <div className="mx-auto w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">Easy Returns</h3>
                <p className="text-sm text-slate-500">Not satisfied? Return within 14 days for a full refund.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-xl mb-6">
            S
          </div>
          <p className="text-sm font-medium mb-2">Shop<span className="text-blue-500">Kart</span> Platform</p>
          <p className="text-sm text-slate-500">© 2024 ShopKart Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
