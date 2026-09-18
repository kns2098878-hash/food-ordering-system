import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {

  const [user, setUser] = useState(null);


  useEffect(() => {

    const savedUser = localStorage.getItem("user");

    if (savedUser) {

      const data = JSON.parse(savedUser);

      // supports both old and new login storage
      setUser(data.user || data);

    }

  }, []);



  return (
    <main>

      <h1>My Dashboard</h1>


      <div className="dashboard-container">


        <div className="dashboard-card">

          <h2>Profile</h2>


          <p>
            Name: {user?.name || "Not available"}
          </p>


          <p>
            Email: {user?.email || "Not available"}
          </p>


          <p>
            Phone: {user?.phone || "Not available"}
          </p>


          <Link to="/profile">
            <button>
              View Profile
            </button>
          </Link>


        </div>



        <div className="dashboard-card">

          <h2>My Orders</h2>

          <p>
            View your order history and status.
          </p>


          <Link to="/orders">
            <button>
              View Orders
            </button>
          </Link>

        </div>



        <div className="dashboard-card">

          <h2>My Reservations</h2>

          <p>
            View your upcoming and past reservations.
          </p>


          <Link to="/reservations">
            <button>
              View Reservations
            </button>
          </Link>

        </div>


      </div>


    </main>
  );
}


export default Dashboard;