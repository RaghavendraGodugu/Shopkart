import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { refreshCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH ORDER
  // ==================================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        // Get the order from backend
        const response = await api.get(`/orders/${id}`);

        if (response.data.success) {
          setOrder(response.data.order);

          // Backend clears the database cart
          // after successful payment verification.
          // Refresh the frontend cart once.
          await refreshCart();
        } else {
          setError(
            response.data.message ||
              "Unable to load order"
          );
        }
      } catch (err) {
        console.error("Fetch order error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your order"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }

    // IMPORTANT:
    // Do not add refreshCart here.
    // CartContext recreates refreshCart on render,
    // which can otherwise cause an infinite loop.
  }, [id]);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

            <p className="mt-4 text-gray-500">
              Loading your order...
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4">

          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
              !
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              Unable to load order
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error || "Order not found"}
            </p>

            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="mt-6 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Go to My Orders
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ==================================================
  // SUCCESS PAGE
  // ==================================================

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="px-4 py-10 flex-1">

        <div className="mx-auto max-w-3xl">

        {/* ==================================================
            SUCCESS HEADER
        ================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

          {/* Success Icon */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <span className="text-4xl text-green-600">
              ✓
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-gray-500">
            Thank you for shopping with ShopKart.
          </p>

          {/* Order ID */}

          <div className="mt-5 rounded-lg bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="mt-1 break-all font-mono text-sm font-semibold text-gray-900">
              {order._id}
            </p>

          </div>

          {/* Payment + Order Status */}

          <div className="mt-4 flex flex-wrap justify-center gap-2">

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Payment: {order.paymentStatus}
            </span>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Status: {order.status}
            </span>

          </div>

        </div>

        {/* ==================================================
            ORDER DETAILS
        ================================================== */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Order Details
          </h2>

          <div className="mt-6 space-y-5">

            {order.items.map((item, index) => (
              <div
                key={`${item.product}-${index}`}
                className="flex items-center gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
              >

                {/* Product Image */}

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/100x100/f3f4f6/6b7280?text=ShopKart";
                    }}
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                    No Image
                  </div>
                )}

                {/* Product Information */}

                <div className="flex-1">

                  <h3 className="font-medium text-gray-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    ₹
                    {Number(
                      item.price
                    ).toLocaleString("en-IN")}{" "}
                    × {item.quantity}
                  </p>

                </div>

                {/* Item Total */}

                <p className="font-semibold text-gray-900">
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString("en-IN")}
                </p>

              </div>
            ))}

          </div>

          {/* Total */}

          <div className="mt-6 border-t border-gray-100 pt-5">

            <div className="flex items-center justify-between">

              <span className="text-lg font-semibold text-gray-900">
                Total
              </span>

              <span className="text-2xl font-bold text-gray-900">
                ₹
                {Number(
                  order.totalAmount
                ).toLocaleString("en-IN")}
              </span>

            </div>

          </div>

        </div>

        {/* ==================================================
            SHIPPING ADDRESS
        ================================================== */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Delivery Address
          </h2>

          <div className="mt-4 space-y-1 text-sm leading-6 text-gray-600">

            <p className="font-semibold text-gray-900">
              {order.shippingAddress?.fullName}
            </p>

            <p>
              {order.shippingAddress?.phone}
            </p>

            <p>
              {order.shippingAddress?.addressLine1}
            </p>

            <p>
              {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.state}
            </p>

            <p>
              {order.shippingAddress?.pincode}
            </p>

          </div>

        </div>

        {/* ==================================================
            ACTION BUTTONS
        ================================================== */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          <Link
            to="/orders"
            className="flex-1 rounded-lg bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            View My Orders
          </Link>

          <Link
            to="/products"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

      </div>

    </div>
  );
}

export default OrderSuccess;