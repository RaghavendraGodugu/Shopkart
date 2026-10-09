import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, subtotal, totalItems } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const formatPrice = (price) => Number(price || 0).toLocaleString("en-IN");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const fullName = formData.fullName.trim();
    const phone = formData.phone.trim();
    const addressLine1 = formData.addressLine1.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    if (!fullName) newErrors.fullName = "Full name is required";
    
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }

    if (!addressLine1) newErrors.addressLine1 = "Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";

    if (!pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Pincode must contain 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) return;

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

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Add some products before proceeding to checkout.</p>
            <button onClick={() => navigate("/products")} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex text-sm font-medium text-slate-500 mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li><Link to="/cart" className="hover:text-blue-600 transition-colors">Cart</Link></li>
            <li><span className="mx-1.5 md:mx-2 text-slate-300">/</span></li>
            <li><span className="text-blue-600 font-bold">Shipping Info</span></li>
            <li><span className="mx-1.5 md:mx-2 text-slate-300">/</span></li>
            <li><span className="text-slate-400">Payment</span></li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Shipping Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-2xl font-bold text-slate-900">Delivery Address</h2>
                <p className="text-slate-500 text-sm mt-1">Please enter your shipping details correctly.</p>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className={`input-field ${errors.fullName ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      className={`input-field ${errors.phone ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="form-label">Address (House No, Building, Street, Area)</label>
                  <textarea
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="e.g. Flat 101, XYZ Apartments, ABC Road..."
                    rows={3}
                    className={`input-field resize-none ${errors.addressLine1 ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.addressLine1}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6 digits"
                      maxLength={6}
                      className={`input-field ${errors.pincode ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.pincode}</p>}
                  </div>

                  <div className="md:col-span-1">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City/Town"
                      className={`input-field ${errors.city ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                    />
                    {errors.city && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.city}</p>}
                  </div>

                  <div className="md:col-span-1">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className={`input-field ${errors.state ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                    />
                    {errors.state && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.state}</p>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center sm:hidden">
               <Link to="/cart" className="text-sm font-semibold text-slate-500 hover:text-slate-900 border-b border-transparent hover:border-slate-400">
                Cancel
              </Link>
            </div>
          </div>

          {/* Order Summary & Cart Preview */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-24 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-lg">Order Summary</h3>
              </div>

              {/* Items Preview */}
              <div className="max-h-60 overflow-y-auto p-6 border-b border-slate-100 bg-white">
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    return (
                      <div key={product._id} className="flex gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-lg border border-slate-100 p-1 shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded shadow-sm" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">{product.name}</h4>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs font-medium text-slate-500 text-blue-600">Qty: {item.quantity}</p>
                            <p className="text-sm font-bold text-slate-900">
                              ₹{formatPrice(Number(product.price) * Number(item.quantity))}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Totals */}
              <div className="p-6 bg-slate-50/50">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Items Total ({totalItems})</span>
                    <span className="text-slate-900">₹{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Delivery</span>
                    <span className="text-green-600 font-bold tracking-wide">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-5 border-t border-slate-200 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Total payable</h3>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">including all taxes</p>
                  </div>
                  <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
                    ₹{formatPrice(subtotal)}
                  </span>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="btn-primary h-14 text-[15px] shadow-sm shadow-blue-500/20"
                >
                  Continue to Payment
                </button>

                <div className="mt-4 text-center hidden sm:block">
                  <Link to="/cart" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                     Back to cart
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
