import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <main>
      <h1>Admin Dashboard</h1>

      <div>
        <Link to="/admin/menu">
          <button>Manage Menu</button>
        </Link>
      </div>

      <br />

      <div>
        <Link to="/admin/orders">
          <button>View Orders</button>
        </Link>
      </div>

      <br />

      <div>
        <Link to="/admin/reservations">
          <button>View Reservations</button>
        </Link>
      </div>

      <br />

      <div>
        <Link to="/admin/restaurants">
          <button>Manage Restaurants</button>
        </Link>
      </div>
    </main>
  );
}

export default AdminDashboard;