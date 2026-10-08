function WishlistCard({ product, onRemove }) {
  return (
    <div className="wishlist-card">

      <div className="wishlist-image-container">

        <img
          src={product.image}
          alt={product.name}
          className="wishlist-image"
          onError={(event) => {
            event.currentTarget.src =
              "https://placehold.co/600x500/f5f5f5/777?text=ShopKart";
          }}
        />

        <button
          className="wishlist-remove-icon"
          onClick={() => onRemove(product._id)}
          title="Remove from wishlist"
        >
          ♥
        </button>

      </div>

      <div className="wishlist-card-content">

        <span className="wishlist-category">
          {product.category}
        </span>

        <h2>{product.name}</h2>

        {product.description && (
          <p className="wishlist-description">
            {product.description}
          </p>
        )}

        <div className="wishlist-bottom">

          <span className="wishlist-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          <button
            className="wishlist-remove-button"
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