import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantMenu } from "../services/api";
import { useCart } from "../context/CartContext";
import StatusMessage from "../components/StatusMessage";

function RestaurantMenu() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRestaurantMenu(id)
      .then((data) => {
        setMenu(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main>
        <h1>Restaurant Menu</h1>
        <StatusMessage
          type="loading"
          message="Loading menu..."
        />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Restaurant Menu</h1>
        <StatusMessage
          type="error"
          message={error}
        />
      </main>
    );
  }

  if (menu.length === 0) {
    return (
      <main>
        <h1>Restaurant Menu</h1>
        <StatusMessage
          type="empty"
          message="No menu items available."
        />
      </main>
    );
  }

  return (
    <main>
      <h1>Restaurant Menu</h1>

      <div className="menu-container">
        {menu.map((item) => (
          <div className="menu-card" key={item.id}>

            <h2>{item.name}</h2>

            <p className="description">
              {item.description}
            </p>

            <h3>₹{item.price}</h3>

            <p>🔴 Non-Vegetarian</p>

            <p className="available">
              ✅ Available
            </p>

            <button onClick={() => addToCart(item)}>
              Add to Cart
            </button>

          </div>
        ))}
      </div>
    </main>
  );
}

export default RestaurantMenu;