import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category) {
        params.category = category;
      }

      const response = await api.get("/products", {
        params,
      });

      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Products error:", err);

      setError(
        "Something went wrong while loading products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:py-14">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-600">
            ShopKart Store
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Discover Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Browse our collection and find something you'll love.
          </p>
        </div>

        {/* Search */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />

        {/* Product count */}
        {!loading && !error && (
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"} found
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

              <p className="mt-4 text-sm text-gray-500">
                Loading products...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-red-700">
              Unable to load products
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={fetchProducts}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
              🔍
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or category filter.
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

      </main>

    </div>
  );
}