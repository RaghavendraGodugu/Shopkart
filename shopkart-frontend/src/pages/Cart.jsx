import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const ShoppingBagIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const Trash2Icon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const ShieldCheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    loading,
    error,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    refreshCart,
  } = useCart();

  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [removingProduct, setRemovingProduct] = useState(null);

  // Refetch on mount: CartProvider loads once at app start (often as a
  // guest → 401 → empty). After login this page would otherwise show a
  // stale empty cart until a full reload.
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const formatPrice = (price) => Number(price || 0).toLocaleString("en-IN");

  const handleIncrease = async (item) => {
    const productId = item.product?._id;
    if (!productId) return;
    const currentQuantity = item.quantity;
    const stock = Number(item.product?.stock || 0);

    if (currentQuantity >= stock) return;

    try {
      setUpdatingProduct(productId);
      await updateQuantity(productId, currentQuantity + 1);
    } finally {
      setUpdatingProduct(null);
    }
  };

  const handleDecrease = async (item) => {
    const productId = item.product?._id;
    if (!productId) return;
    const currentQuantity = item.quantity;

    if (currentQuantity <= 1) return;

    try {
      setUpdatingProduct(productId);
      await updateQuantity(productId, currentQuantity - 1);
    } finally {
      setUpdatingProduct(null);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setRemovingProduct(productId);
      await removeFromCart(productId);
    } finally {
      setRemovingProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-10 max-w-md w-full text-center shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-4 font-serif">!</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to load cart</h2>
            <p className="text-slate-500 mb-6">{error}</p>
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-24 h-24 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center text-blue-100 mb-6 relative">
            <ShoppingBagIcon className="w-12 h-12 text-slate-300" />
            <div className="absolute -bottom-2 -right-2 bg-slate-100 border-4 border-slate-50 text-slate-400 w-10 h-10 rounded-full flex items-center justify-center font-bold">0</div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Your cart is empty</h1>
          <p className="text-slate-500 max-w-sm text-center mb-8">
            Looks like you haven't added anything to your cart yet. Let's fix that!
          </p>
          <Link to="/products" className="btn-primary max-w-xs shadow-md shadow-blue-500/20">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Shopping Cart</h1>
            <p className="text-sm font-medium text-slate-500 mt-2">
              You have <span className="text-slate-900 font-bold">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span> in your cart
            </p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 hidden sm:block">
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 space-y-4">
            {cartItems.map((item) => {
              const product = item.product;
              // Product may have been deleted → populate yields null.
              // Skip such entries instead of crashing the whole page.
              if (!product) return null;
              const productId = product._id;
              const isUpdating = updatingProduct === productId;
              const isRemoving = removingProduct === productId;
              
              const stock = Number(product.stock || 0);
              const quantity = Number(item.quantity || 1);
              const itemTotal = Number(product.price || 0) * quantity;
              const isLowStock = stock > 0 && stock <= 5;
              const isOutOfStock = stock === 0;

              return (
                <div key={productId} className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-6 transition-opacity ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}>
                  
                  {/* Image */}
                  <div className="shrink-0 w-full sm:w-32 h-40 sm:h-32 bg-slate-50 rounded-xl relative overflow-hidden border border-slate-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-70 grayscale-[30%]' : ''}`}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                          {product.category}
                        </p>
                        <Link to={`/products/${productId}`} className="hover:text-blue-600 transition-colors">
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="mt-2">
                          <p className="text-lg font-extrabold text-slate-900">
                            ₹{formatPrice(product.price)}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">price per item</p>
                        </div>
                      </div>
                      
                      {/* Subtotal shown on wide screens top right */}
                      <div className="hidden sm:block text-right">
                        <p className="text-lg font-extrabold text-slate-900">₹{formatPrice(itemTotal)}</p>
                        <p className="text-xs font-semibold text-slate-400">total</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-5 flex items-center justify-between sm:justify-start gap-6 border-t border-slate-50 mt-4">
                      {/* Quantity Control */}
                      <div className="flex items-center">
                        <p className="text-sm font-semibold text-slate-500 mr-3 hidden sm:block">Qty</p>
                        <div className="flex items-center h-10 rounded-lg border border-slate-200 bg-white">
                          <button
                            onClick={() => handleDecrease(item)}
                            disabled={quantity <= 1 || isUpdating || isRemoving}
                            className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-10 h-full flex items-center justify-center border-x border-slate-200 text-sm font-bold text-slate-900 bg-slate-50">
                            {isUpdating ? <span className="w-3 h-3 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></span> : quantity}
                          </span>
                          <button
                            onClick={() => handleIncrease(item)}
                            disabled={quantity >= stock || isUpdating || isRemoving}
                            className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(productId)}
                        disabled={isRemoving || isUpdating}
                        className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>

                      {/* Subtotal shown on small screens inline */}
                      <div className="sm:hidden text-right block">
                        <p className="text-lg font-bold text-slate-900">₹{formatPrice(itemTotal)}</p>
                      </div>
                    </div>
                    
                    {/* Stock Warning Box */}
                    {isLowStock && (
                      <p className="text-xs font-semibold text-amber-600 mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5">
                        <FilterIcon className="w-3 h-3" />
                        Hurry! Only {stock} {stock === 1 ? 'item' : 'items'} left in stock.
                      </p>
                    )}
                  </div>

                </div>
              );
            })}
            
            <div className="hidden sm:block mt-6">
              <Link to="/products" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
                <span aria-hidden="true" className="mr-1.5">←</span> Continue Shopping
              </Link>
            </div>
            <div className="sm:hidden text-center mt-6">
              <Link to="/products" className="inline-flex btn-secondary justify-center items-center">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Order Summary</h2>

              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-slate-100">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Items ({totalItems})</span>
                  <span className="font-bold text-slate-900">₹{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-slate-500">
                  <span className="font-medium">Delivery Charges</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between text-slate-500">
                  <span className="font-medium">Taxes</span>
                  <span className="font-bold text-slate-900">Incl. in price</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Total Amount</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">including VAT</p>
                </div>
                <span className="text-3xl font-extrabold text-blue-600 tracking-tight">
                  ₹{formatPrice(subtotal)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="btn-primary h-14 text-[15px] shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-center gap-4 text-slate-400">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <p className="text-xs font-medium">Safe & Secure Checkout</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
