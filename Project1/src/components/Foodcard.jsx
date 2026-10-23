function FoodCard({ item, onAddToCart }) {
  return (
    <div className="food-card">
      <div className="food-info">
        <h3>{item.item_name}</h3>

        <p>{item.description}</p>

        <strong>₹{item.price}</strong>

        <p>
          {item.is_vegetarian ? "🟢 Vegetarian" : "🔴 Non-Vegetarian"}
        </p>

        {!item.is_available && (
          <span>Currently unavailable</span>
        )}
      </div>

      <button
        onClick={() => onAddToCart(item)}
        disabled={!item.is_available}
      >
        {item.is_available ? "Add to Cart" : "Unavailable"}
      </button>
    </div>
  );
}

export default FoodCard;