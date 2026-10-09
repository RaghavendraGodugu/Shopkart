import { Link } from "react-router-dom";

function WishlistCard({ product, onRemove }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link to={`/products/${product._id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.src =
                "https://placehold.co/600x500/f8fafc/94a3b8?text=ShopKart";
            }}
          />
        </Link>

        <button
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 text-pink-500 hover:scale-110 active:scale-95 transition-all"
          onClick={() => onRemove(product._id)}
          title="Remove from wishlist"
        >
          ♥
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
          {product.category}
        </span>

        <Link to={`/products/${product._id}`} className="block hover:text-blue-600 transition-colors">
          <h2 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug" title={product.name}>
            {product.name}
          </h2>
        </Link>

        {product.description && (
          <p className="text-sm text-slate-500 line-clamp-2 mt-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          <button
            className="text-sm font-semibold text-slate-400 hover:text-red-600 transition-colors"
            onClick={() => onRemove(product._id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;
