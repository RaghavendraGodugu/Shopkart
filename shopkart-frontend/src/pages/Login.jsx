import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, skip straight to home.
  useEffect(() => {
    let cancelled = false;
    api
      .get("/customers/me")
      .then((res) => {
        const customer = res.data?.customer || (res.data?._id ? res.data : null);
        if (!cancelled && customer) {
          navigate("/home", { replace: true });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/customers/login", formData);
      if (response.data.success) {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative px-4 py-12">
      {/* Abstract Background Design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-100/50 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-3xl mb-4 shadow-lg shadow-blue-600/20">
            S
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Shop<span className="text-blue-600">Kart</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Welcome back to your favourite store</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Sign in to your account</h2>
          
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex justify-center items-center h-12 text-[15px]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600 text-sm">
              New to ShopKart?{" "}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
