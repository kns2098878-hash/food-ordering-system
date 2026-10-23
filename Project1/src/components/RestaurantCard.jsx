import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  return (
    <div className="restaurant-card">
      <img
        src={restaurant.image}
        alt={restaurant.name}
      />

      <h2>{restaurant.name}</h2>

      <p>{restaurant.location}</p>

      <p>⭐ {restaurant.rating}</p>

      <button
        onClick={() =>
          navigate(`/restaurants/${restaurant.id}/menu`)
        }
      >
        View Menu
      </button>
    </div>
  );
}

export default RestaurantCard;