import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);

        setProduct(response.data.product);
      } catch (err) {
        console.error("Product details error:", err);

        setError(
          err.response?.data?.message ||
            "Something went wrong while loading the product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

            <p className="mt-4 text-sm text-gray-500">
              Loading product...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <Navbar />

        <main className="mx-auto max-w-3xl px-5 py-16 text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900">
              Product not found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error || "This product could not be found."}
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back to Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:py-14">

        {/* Back */}
        <Link
          to="/products"
          className="mb-8 inline-flex text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          ← Back to Products
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="grid md:grid-cols-2">

            {/* Image */}
            <div className="min-h-[350px] bg-gray-50 md:min-h-[550px]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/800x800/f3f4f6/6b7280?text=ShopKart";
                }}
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                {product.category}
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-5 text-3xl font-bold text-gray-900">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>

              <div className="my-7 h-px bg-gray-100"></div>

              <p className="text-sm leading-7 text-gray-600">
                {product.description}
              </p>

              {/* Stock */}
              <div className="mt-7">
                {isOutOfStock ? (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    Out of stock
                  </div>
                ) : (
                  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {product.stock} units available
                  </div>
                )}
              </div>

              {/* Add to Cart */}
              <button
                disabled={isOutOfStock}
                className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Cart functionality will be available in the next lab.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}