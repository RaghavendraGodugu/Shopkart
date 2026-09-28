import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/customers/me");

        // Supports both:
        // response.data
        // and { customer: {...} }
        const customer = response.data?.customer || response.data;

        setUser(customer);
      } catch (error) {
        console.error("Authentication error:", error);

        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Loading screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

          <p className="mt-4 text-sm text-gray-500">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      {/* Navbar */}
      <Navbar user={user} />

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:py-14">

        {/* Welcome Section */}
        <section className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-600">
            ShopKart Account
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Welcome, {user.fullName}
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Your account is active and you're successfully signed in to
            ShopKart.
          </p>
        </section>

        {/* Account Card */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Card Header */}
          <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your registered customer details.
            </p>
          </div>

          {/* Information */}
          <div className="divide-y divide-gray-100">

            {/* Name */}
            <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Full Name
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Your registered name
                </p>
              </div>

              <p className="text-sm font-medium text-gray-800 sm:text-right">
                {user.fullName}
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Email Address
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Your account email
                </p>
              </div>

              <p className="break-all text-sm font-medium text-gray-800 sm:text-right">
                {user.email}
              </p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Phone Number
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Your registered phone
                </p>
              </div>

              <p className="text-sm font-medium text-gray-800 sm:text-right">
                {user.phone}
              </p>
            </div>

          </div>
        </section>

        {/* Authentication Status */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                You're securely signed in
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Your session is authenticated using the secure HttpOnly
                authentication cookie.
              </p>
            </div>

          </div>

        </section>

        {/* Simple Next Step */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-6 sm:p-8">

          <h3 className="text-sm font-semibold text-blue-900">
            Welcome to ShopKart
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-800/70">
            Your authentication setup is complete. Product browsing,
            shopping cart, wishlist and orders will be added in the upcoming
            ShopKart labs.
          </p>

        </section>

      </main>

    </div>
  );
}