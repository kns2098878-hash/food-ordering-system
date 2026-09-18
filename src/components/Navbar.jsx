import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {

  const { cart } = useCart();
  const navigate = useNavigate();

  const user = localStorage.getItem("user");


  function logout() {

    localStorage.removeItem("user");

    navigate("/login");

  }


  return (

    <nav>

      <div className="navbar-brand">
        <Link to="/">
          🍴 Foodie
        </Link>
      </div>


      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>


        <Link to="/restaurants">
          Restaurants
        </Link>


        <Link to="/cart">
          🛒 Cart ({cart.length})
        </Link>


        <Link to="/reservation">
          🪑 Reservation
        </Link>


        {user ? (

          <>

            <Link to="/dashboard">
              Dashboard
            </Link>


            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </>

        ) : (

          <Link to="/login">
            Login
          </Link>

        )}

      </div>

    </nav>

  );

}


export default Navbar;