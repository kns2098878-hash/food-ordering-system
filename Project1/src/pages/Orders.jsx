import { useEffect, useState } from "react";
import { getOrders } from "../services/api";
import StatusMessage from "../components/StatusMessage";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main>
        <h1>My Orders</h1>

        <StatusMessage
          type="loading"
          message="Loading orders..."
        />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>My Orders</h1>

        <StatusMessage
          type="error"
          message={error}
        />
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main>
        <h1>My Orders</h1>

        <StatusMessage
          type="empty"
          message="You have no orders yet."
        />
      </main>
    );
  }

  return (
    <main className="orders-page">

      <div className="orders-header">
        <span className="orders-icon">🛍️</span>
        <h1>My Orders</h1>
        <p>Track all your delicious Foodie orders here.</p>
      </div>

      <div className="orders-container">

        {orders.map((order) => (

          <div className="order-card" key={order.id}>

            <div className="order-top">

              <div>
                <span className="order-label">
                  ORDER
                </span>

                <h2>
                  #ORD-{String(order.id).padStart(3, "0")}
                </h2>
              </div>

              <span
                className={`order-status ${String(
                  order.status
                ).toLowerCase()}`}
              >
                {order.status}
              </span>

            </div>


            {order.items && order.items.length > 0 && (

              <div className="ordered-items">

                {order.items.map((item, index) => (

                  <div
                    className="ordered-item"
                    key={item.id || index}
                  >

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="order-food-image"
                      />
                    ) : (
                      <div className="order-food-placeholder">
                        🍽️
                      </div>
                    )}

                    <div className="ordered-item-details">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <strong>
                        ₹
                        {Number(item.price).toFixed(2)}
                      </strong>

                    </div>

                  </div>

                ))}

              </div>

            )}


            <div className="order-details">

              <div className="order-detail">

                <span>💰 Total</span>

                <strong>
                  ₹
                  {Number(order.total_amount).toFixed(2)}
                </strong>

              </div>


              <div className="order-detail">

                <span>📅 Date</span>

                <strong>
                  {order.order_date}
                </strong>

              </div>

            </div>


            <div className="order-footer">

              <span>
                🍴 Thank you for ordering with Foodie!
              </span>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}

export default Orders;