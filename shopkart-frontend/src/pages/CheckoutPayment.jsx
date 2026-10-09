import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function CheckoutPayment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, subtotal } = useCart();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const shippingAddress =
    location.state?.shippingAddress;

  // ------------------------------------------------
  // Protect payment page
  // ------------------------------------------------
  useEffect(() => {
    if (!shippingAddress) {
      navigate("/checkout", { replace: true });
    }
  }, [shippingAddress, navigate]);

  // ------------------------------------------------
  // Load Razorpay Checkout script
  // ------------------------------------------------
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () =>
          resolve(true)
        );

        existingScript.addEventListener("error", () =>
          resolve(false)
        );

        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // ------------------------------------------------
  // Handle Razorpay payment
  // ------------------------------------------------
  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError("");

      // ----------------------------------------------
      // 1. Load Razorpay
      // ----------------------------------------------
      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        setError(
          "Unable to load Razorpay. Please check your internet connection and try again."
        );

        setProcessing(false);
        return;
      }

      // ----------------------------------------------
      // 2. Create ShopKart + Razorpay order
      // ----------------------------------------------
      const response = await api.post(
        "/orders/create-payment-order",
        {
          shippingAddress,
        }
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Unable to create payment order"
        );

        setProcessing(false);
        return;
      }

      const {
        shopKartOrderId,
        razorpayOrderId,
        amount,
        currency,
        key,
      } = response.data;

      console.log(
        "ShopKart Order ID:",
        shopKartOrderId
      );

      console.log(
        "Razorpay Order ID:",
        razorpayOrderId
      );

      console.log(
        "Razorpay Amount:",
        amount
      );

      // ----------------------------------------------
      // 3. Razorpay Checkout configuration
      // ----------------------------------------------
      const options = {
        key: key,

        amount: amount,

        currency: currency,

        name: "ShopKart",

        description: "ShopKart Order Payment",

        order_id: razorpayOrderId,

        // --------------------------------------------
        // Payment success callback
        // --------------------------------------------
        handler: async function (paymentResponse) {
          try {
            setProcessing(true);
            setError("");

            console.log(
              "Razorpay payment response:",
              paymentResponse
            );

            // ----------------------------------------
            // 4. Verify payment on backend
            // ----------------------------------------
            const verifyResponse = await api.post(
              "/orders/verify-payment",
              {
                shopKartOrderId,

                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,
              }
            );

            if (verifyResponse.data.success) {
              console.log(
                "Payment verified successfully"
              );

              // --------------------------------------
              // 5. Go to order success page
              // --------------------------------------
              navigate(
                `/order-success/${shopKartOrderId}`,
                {
                  replace: true,
                }
              );
            } else {
              setError(
                verifyResponse.data.message ||
                  "Payment verification failed"
              );
            }
          } catch (verificationError) {
            console.error(
              "Payment verification error:",
              verificationError
            );

            setError(
              verificationError.response?.data
                ?.message ||
                "Payment verification failed"
            );
          } finally {
            setProcessing(false);
          }
        },

        // --------------------------------------------
        // Customer information
        // --------------------------------------------
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },

        // --------------------------------------------
        // Additional information
        // --------------------------------------------
        notes: {
          shopKartOrderId,
        },

        // --------------------------------------------
        // Razorpay appearance
        // --------------------------------------------
        theme: {
          color: "#111827",
        },

        // --------------------------------------------
        // Razorpay modal closed
        // --------------------------------------------
        modal: {
          ondismiss: function () {
            setProcessing(false);

            setError(
              "Payment was cancelled. Your cart is still safe."
            );
          },
        },
      };

      // ----------------------------------------------
      // 6. Create Razorpay instance
      // ----------------------------------------------
      const razorpay =
        new window.Razorpay(options);

      // ----------------------------------------------
      // 7. Payment failed
      // ----------------------------------------------
      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setProcessing(false);

          setError(
            response.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      // ----------------------------------------------
      // 8. Open Razorpay
      // ----------------------------------------------
      razorpay.open();
    } catch (error) {
      console.error(
        "Create payment order error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to start payment"
      );

      setProcessing(false);
    }
  };

  // ------------------------------------------------
  // No shipping address
  // ------------------------------------------------
  if (!shippingAddress) {
    return null;
  }

  // ------------------------------------------------
  // PAGE
  // ------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="px-4 py-8 flex-1">

        <div className="mx-auto max-w-5xl">

        {/* PAGE HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Payment
          </h1>

          <p className="mt-2 text-gray-500">
            Review your order and complete your secure
            payment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ==========================================
              LEFT SIDE
          ========================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* SHIPPING ADDRESS */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Address
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/checkout")
                  }
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>

              </div>

              <div className="space-y-1 text-sm text-gray-600">

                <p className="font-semibold text-gray-900">
                  {shippingAddress.fullName}
                </p>

                <p>
                  {shippingAddress.phone}
                </p>

                <p>
                  {shippingAddress.addressLine1}
                </p>

                <p>
                  {shippingAddress.city},{" "}
                  {shippingAddress.state}
                </p>

                <p>
                  {shippingAddress.pincode}
                </p>

              </div>

            </div>

            {/* ORDER REVIEW */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                Order Review
              </h2>

              <div className="space-y-4">

                {cartItems.map((item) => {
                  const product = item.product;

                  if (!product) {
                    return null;
                  }

                  return (
                    <div
                      key={product._id}
                      className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/100x100/f3f4f6/6b7280?text=ShopKart";
                        }}
                      />

                      <div className="min-w-0 flex-1">

                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                      </div>

                      <p className="font-semibold text-gray-900">
                        ₹
                        {(
                          Number(product.price) *
                          Number(item.quantity)
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* ERROR MESSAGE */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                <p className="text-sm text-red-700">
                  {error}
                </p>

              </div>
            )}

          </div>

          {/* ==========================================
              RIGHT SIDE - PAYMENT SUMMARY
          ========================================== */}

          <div>

            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-gray-900">
                Payment Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Items
                  </span>

                  <span className="font-medium text-gray-900">
                    {cartItems.length}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹
                    {Number(subtotal).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-medium text-green-600">
                    Free
                  </span>

                </div>

              </div>

              <div className="my-6 border-t border-gray-100" />

              <div className="flex items-center justify-between">

                <span className="font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-gray-900">
                  ₹
                  {Number(subtotal).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {/* PAY BUTTON */}

              <button
                type="button"
                onClick={handlePayment}
                disabled={processing}
                className="mt-6 w-full rounded-lg bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing
                  ? "Processing..."
                  : "Pay Securely"}
              </button>

              <p className="mt-4 text-center text-xs text-gray-400">
                🔒 Secure payment powered by Razorpay
              </p>

            </div>

          </div>

        </div>
      </div>

      </div>
    </div>
  );
}

export default CheckoutPayment;