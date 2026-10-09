import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders");

        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          setError(
            response.data.message ||
              "Unable to load orders"
          );
        }
      } catch (err) {
        console.error("Fetch orders error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ================================================
  // LOADING
  // ================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

            <p className="mt-4 text-gray-500">
              Loading your orders...
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ================================================
  // ERROR
  // ================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4">

          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
              !
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              Unable to load orders
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ================================================
  // NO ORDERS
  // ================================================

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="px-4 py-10 flex-1">

          <div className="mx-auto max-w-4xl">

            <h1 className="text-3xl font-bold text-gray-900">
              My Orders
            </h1>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
                📦
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                No orders yet
              </h2>

              <p className="mt-2 text-gray-500">
                Your completed orders will appear here.
              </p>

              <Link
                to="/products"
                className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Start Shopping
              </Link>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // ================================================
  // ORDERS
  // ================================================

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="px-4 py-10 flex-1">

        <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View and track your ShopKart orders.
          </p>

        </div>

        {/* ORDER LIST */}

        <div className="space-y-5">

          {orders.map((order) => {

            const firstItem = order.items?.[0];

            const totalItems =
              order.items?.reduce(
                (total, item) =>
                  total + Number(item.quantity || 0),
                0
              ) || 0;

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >

                {/* TOP */}

                <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center md:justify-between">

                  <div>

                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-semibold text-gray-900">
                      {order._id}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Payment: {order.paymentStatus}
                    </span>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {order.status}
                    </span>

                  </div>

                </div>

                {/* ORDER ITEM */}

                <div className="mt-5 flex items-center gap-4">

                  {firstItem?.image ? (
                    <img
                      src={firstItem.image}
                      alt={firstItem.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100">
                      📦
                    </div>
                  )}

                  <div className="min-w-0 flex-1">

                    <h2 className="font-semibold text-gray-900">
                      {firstItem?.name ||
                        "Order Items"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {totalItems}{" "}
                      {totalItems === 1
                        ? "item"
                        : "items"}
                    </p>

                    {order.items?.length > 1 && (
                      <p className="text-sm text-gray-400">
                        +{" "}
                        {order.items.length - 1}{" "}
                        more product
                        {order.items.length - 1 ===
                        1
                          ? ""
                          : "s"}
                      </p>
                    )}

                  </div>

                  {/* TOTAL */}

                  <div className="text-right">

                    <p className="text-xs text-gray-400">
                      Total
                    </p>

                    <p className="text-xl font-bold text-gray-900">
                      ₹
                      {Number(
                        order.totalAmount
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>

                {/* BUTTON */}

                <div className="mt-5 border-t border-gray-100 pt-5">

                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    View Order Details
                  </Link>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      </div>

    </div>
  );
}

export default Orders;