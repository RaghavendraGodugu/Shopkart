import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    totalItems,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove error when user starts correcting field
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const fullName = formData.fullName.trim();
    const phone = formData.phone.trim();
    const addressLine1 = formData.addressLine1.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    if (!fullName) {
      newErrors.fullName = "Full name is required";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!addressLine1) {
      newErrors.addressLine1 = "Address is required";
    }

    if (!city) {
      newErrors.city = "City is required";
    }

    if (!state) {
      newErrors.state = "State is required";
    }

    if (!pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Pincode must contain 6 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    // Don't make backend request if validation fails
    if (!validateForm()) {
      return;
    }

    navigate("/checkout/payment", {
      state: {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine1: formData.addressLine1.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
      },
    });
  };

  // -----------------------------------------------
  // Empty cart protection
  // -----------------------------------------------
  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mb-6">
              Add some products before proceeding to checkout.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Checkout
            </h1>

            <p className="text-gray-500 mt-2">
              Enter your shipping details and review your order.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ----------------------------------- */}
            {/* SHIPPING FORM */}
            {/* ----------------------------------- */}

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border p-6">

                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Shipping Information
                </h2>

                <div className="space-y-5">

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
                        errors.fullName
                          ? "border-red-500"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />

                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      maxLength={10}
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
                        errors.phone
                          ? "border-red-500"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />

                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>

                    <textarea
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="House number, street, area"
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition resize-none ${
                        errors.addressLine1
                          ? "border-red-500"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />

                    {errors.addressLine1 && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>

                  {/* City + State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
                          errors.city
                            ? "border-red-500"
                            : "border-gray-300 focus:border-black"
                        }`}
                      />

                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
                          errors.state
                            ? "border-red-500"
                            : "border-gray-300 focus:border-black"
                        }`}
                      />

                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
                        errors.pincode
                          ? "border-red-500"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />

                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pincode}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* ----------------------------------- */}
            {/* ORDER SUMMARY */}
            {/* ----------------------------------- */}

            <div>
              <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-6">

                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 max-h-80 overflow-y-auto">

                  {cartItems.map((item) => {
                    const product = item.product;

                    if (!product) return null;

                    return (
                      <div
                        key={product._id}
                        className="flex gap-3"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>

                          <p className="text-sm font-medium text-gray-900">
                            ₹
                            {(
                              Number(product.price) *
                              Number(item.quantity)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                </div>

                <div className="border-t my-6" />

                <div className="flex justify-between text-gray-600 mb-3">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between text-gray-600 mb-3">
                  <span>Subtotal</span>
                  <span>
                    ₹{Number(subtotal).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 mb-5">
                  <span>Delivery</span>
                  <span className="text-green-600">
                    Free
                  </span>
                </div>

                <div className="border-t pt-5">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-gray-900">
                      ₹{Number(subtotal).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full mt-6 bg-black text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  Proceed to Payment
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back to Cart
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;