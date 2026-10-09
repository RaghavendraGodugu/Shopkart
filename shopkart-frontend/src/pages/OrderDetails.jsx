import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH ORDER DETAILS
  // ==================================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/orders/${id}`);

        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError(
            response.data.message ||
              "Unable to load order details"
          );
        }
      } catch (err) {
        console.error(
          "Fetch order details error:",
          err
        );

        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);

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
              Loading order details...
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

            <Link
              to="/orders"
              className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Back to My Orders
            </Link>

          </div>

        </div>
      </div>
    );
  }

  // ==================================================
  // ORDER DETAILS
  // ==================================================

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="px-4 py-10 flex-1">

        <div className="mx-auto max-w-4xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-6">

          <Link
            to="/orders"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to My Orders
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Order Details
          </h1>

          <p className="mt-2 break-all font-mono text-sm text-gray-500">
            Order ID: {order._id}
          </p>

        </div>

        {/* ==========================================
            ORDER STATUS
        ========================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Order Date
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
                Payment: {order.paymentStatus}
              </span>

              <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
                Order: {order.status}
              </span>

            </div>

          </div>

        </div>

        {/* ==========================================
            PRODUCTS
        ========================================== */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Products
          </h2>

          <div className="mt-6 space-y-5">

            {order.items?.map((item, index) => (
              <div
                key={`${item.product}-${index}`}
                className="flex flex-col gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0 sm:flex-row sm:items-center"
              >

                {/* PRODUCT IMAGE */}

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/100x100/f3f4f6/6b7280?text=ShopKart";
                    }}
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                    No Image
                  </div>
                )}

                {/* PRODUCT INFO */}

                <div className="flex-1">

                  <h3 className="font-semibold text-gray-900">
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

                {/* ITEM TOTAL */}

                <div className="text-left sm:text-right">

                  <p className="text-xs text-gray-400">
                    Item Total
                  </p>

                  <p className="text-lg font-bold text-gray-900">
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

              </div>
            ))}

          </div>

          {/* TOTAL */}

          <div className="mt-6 border-t border-gray-100 pt-5">

            <div className="flex items-center justify-between">

              <span className="text-lg font-semibold text-gray-900">
                Total Amount
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

        {/* ==========================================
            SHIPPING ADDRESS
        ========================================== */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Delivery Address
          </h2>

          <div className="mt-5 space-y-1 text-sm leading-6 text-gray-600">

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

        {/* ==========================================
            PAYMENT INFORMATION
        ========================================== */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Payment Information
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">

              <span className="text-sm text-gray-500">
                Payment Status
              </span>

              <span className="font-semibold text-green-600">
                {order.paymentStatus}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-sm text-gray-500">
                Order Status
              </span>

              <span className="font-semibold text-blue-600">
                {order.status}
              </span>

            </div>

            {order.razorpayPaymentId && (
              <div className="flex flex-col gap-1">

                <span className="text-sm text-gray-500">
                  Razorpay Payment ID
                </span>

                <span className="break-all font-mono text-xs text-gray-700">
                  {order.razorpayPaymentId}
                </span>

              </div>
            )}

            {order.razorpayOrderId && (
              <div className="flex flex-col gap-1">

                <span className="text-sm text-gray-500">
                  Razorpay Order ID
                </span>

                <span className="break-all font-mono text-xs text-gray-700">
                  {order.razorpayOrderId}
                </span>

              </div>
            )}

          </div>

        </div>

        {/* ==========================================
            ACTIONS
        ========================================== */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          <Link
            to="/orders"
            className="flex-1 rounded-lg bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Back to My Orders
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

export default OrderDetails;