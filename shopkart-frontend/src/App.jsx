import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutPayment from "./pages/CheckoutPayment";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

function App() {
  return (
    <Routes>

      {/* =========================================
          DEFAULT
      ========================================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* =========================================
          AUTHENTICATION
      ========================================= */}

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =========================================
          HOME
      ========================================= */}

      <Route
        path="/home"
        element={<Home />}
      />

      {/* =========================================
          PRODUCTS
      ========================================= */}

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      {/* =========================================
          WISHLIST
      ========================================= */}

      <Route
        path="/wishlist"
        element={<Wishlist />}
      />

      {/* =========================================
          CART
      ========================================= */}

      <Route
        path="/cart"
        element={<Cart />}
      />

      {/* =========================================
          CHECKOUT
      ========================================= */}

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/checkout/payment"
        element={<CheckoutPayment />}
      />

      {/* =========================================
          ORDER SUCCESS
      ========================================= */}

      <Route
        path="/order-success/:id"
        element={<OrderSuccess />}
      />
      <Route
  path="/orders"
  element={<Orders />}
/>
<Route
  path="/orders/:id"
  element={<OrderDetails />}
/>

      {/* =========================================
          404
      ========================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;