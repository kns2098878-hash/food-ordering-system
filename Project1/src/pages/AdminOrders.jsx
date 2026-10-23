import { useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "Rahul",
      total: 530,
      status: "Pending",
    },
    {
      id: 2,
      customer: "Priya",
      total: 280,
      status: "Preparing",
    },
  ]);

  function changeStatus(id, status) {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  }

  return (
    <main>
      <h1>Manage Orders</h1>

      {orders.map((order) => (
        <div key={order.id}>
          <h2>Order #{order.id}</h2>

          <p>Customer: {order.customer}</p>

          <p>Total: ₹{order.total}</p>

          <p>Status: {order.status}</p>

          <select
            value={order.status}
            onChange={(e) =>
              changeStatus(order.id, e.target.value)
            }
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">
              Out for Delivery
            </option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <hr />
        </div>
      ))}
    </main>
  );
}

export default AdminOrders;