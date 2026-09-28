import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const isOutOfStock = product.stock === 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x600/f3f4f6/6b7280?text=ShopKart";
          }}
        />

        {/* Stock Badge */}
        <div className="absolute left-3 top-3">
          {isOutOfStock ? (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              Out of stock
            </span>
          ) : (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
              {product.stock} left
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">

        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-blue-600">
          {product.category}
        </p>

        <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-semibold text-gray-900">
          {product.name}
        </h3>

        <p className="mt-3 text-xl font-bold text-gray-900">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {isOutOfStock
            ? "Currently unavailable"
            : `${product.stock} units available`}
        </p>

        <button
          onClick={() => navigate(`/products/${product._id}`)}
          className="mt-5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          View Details
        </button>

      </div>
    </div>
  );
}