import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../services/api";
import StatusMessage from "../components/StatusMessage";

function Restaurants() {

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    getRestaurants()
      .then((data) => {
        setRestaurants(data);
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
        <h1>Restaurants</h1>

        <StatusMessage
          type="loading"
          message="Loading restaurants..."
        />

      </main>
    );
  }



  if (error) {
    return (
      <main>
        <h1>Restaurants</h1>

        <StatusMessage
          type="error"
          message={error}
        />

      </main>
    );
  }



  if (restaurants.length === 0) {
    return (
      <main>
        <h1>Restaurants</h1>

        <StatusMessage
          type="empty"
          message="No restaurants found."
        />

      </main>
    );
  }



  return (

    <main>

      <h1>Restaurants</h1>


      <div className="restaurants-container">


        {restaurants.map((restaurant) => (

          <div
            className="restaurant-card"
            key={restaurant.id}
          >


            {restaurant.image && (

              <img
                src={restaurant.image}
                alt={restaurant.name}
              />

            )}



            <h2>
              {restaurant.name}
            </h2>



            <p>
              📍 {restaurant.location}
            </p>



            <p>
              ⭐ {restaurant.rating}
            </p>



            <Link
              to={`/restaurants/${restaurant.id}/menu`}
            >

              <button>
                View Menu
              </button>

            </Link>


          </div>

        ))}


      </div>


    </main>

  );
}


export default Restaurants;