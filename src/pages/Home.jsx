import { Link } from "react-router-dom";

function Home() {
  const foods = [
  {
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800",
    name: "Chicken Biryani",
    desc: "Spicy and delicious biryani",
    price: "₹180",
  },

  {
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    name: "Pizza",
    desc: "Cheesy Italian delight",
    price: "₹250",
  },

  {
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    name: "Burger",
    desc: "Fresh and juicy burgers",
    price: "₹150",
  },

  {
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800",
    name: "Pasta",
    desc: "Creamy Italian pasta",
    price: "₹220",
  },

  {
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
    name: "Paneer Tikka",
    desc: "Grilled spicy paneer",
    price: "₹200",
  },

  {
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    name: "Cheese Sandwich",
    desc: "Fresh and cheesy sandwich",
    price: "₹120",
  },

  {
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
    name: "Chinese Noodles",
    desc: "Hot and spicy noodles",
    price: "₹170",
  },

  {
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
    name: "South Indian Meals",
    desc: "Traditional delicious meals",
    price: "₹150",
  },
];


  return (
    <main>

      {/* HERO */}
      <section className="hero-section">

        <div className="hero-content">

          <h1>
            🍴 Welcome to Foodie
          </h1>

          <p>
            Delicious food and easy table reservations
            at your fingertips.
          </p>


          <div className="hero-buttons">

            <Link to="/restaurants">
              <button>
                Order Food 🍽️
              </button>
            </Link>


            <Link to="/reservation">
              <button className="reserve-btn">
                Reserve Table 🪑
              </button>
            </Link>

          </div>

        </div>

      </section>



      {/* FOOD CARDS */}

      <section className="food-section">

        <h2>
          Popular Dishes 🍴
        </h2>


        <div className="food-cards">

          {foods.map((food,index)=>(

            <div className="food-card" key={index}>


              <img
                src={food.image}
                alt={food.name}
              />


              <h3>
                {food.name}
              </h3>


              <p>
                {food.desc}
              </p>


              <b>
                {food.price}
              </b>


            </div>

          ))}

        </div>


      </section>




      {/* FEATURES */}

      <section className="features-section">

        <h2>
          Why Choose Foodie?
        </h2>


        <div className="feature-cards">


          <div className="feature-card">
            🚀
            <h3>
              Fast Ordering
            </h3>
            <p>
              Quick and easy food ordering.
            </p>
          </div>



          <div className="feature-card">
            🪑
            <h3>
              Easy Reservations
            </h3>
            <p>
              Book your favourite table instantly.
            </p>
          </div>



          <div className="feature-card">
            ⭐
            <h3>
              Best Restaurants
            </h3>
            <p>
              Explore top restaurants and dishes.
            </p>
          </div>


        </div>

      </section>


    </main>
  );
}


export default Home;