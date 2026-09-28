import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <Routes>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Authentication */}
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      {/* Home */}
      <Route
        path="/home"
        element={<Home />}
      />

      {/* Products */}
      <Route
        path="/products"
        element={<Products />}
      />

      {/* Product Details */}
      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

export default App;