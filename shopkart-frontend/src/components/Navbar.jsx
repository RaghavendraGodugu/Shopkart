import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/home"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          Shop<span className="text-blue-600">Kart</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">

          <Link
            to="/home"
            className="hidden text-sm font-medium text-gray-600 transition hover:text-blue-600 sm:block"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            Products
          </Link>

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