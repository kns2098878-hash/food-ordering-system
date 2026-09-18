import { useState } from "react";

function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: "Sample Restaurant",
      description: "Delicious food and great service.",
    },
    {
      id: 2,
      name: "Food Paradise",
      description: "Fresh and tasty meals.",
    },
  ]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function addRestaurant(e) {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      alert("Please fill all fields.");
      return;
    }

    const newRestaurant = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
    };

    setRestaurants([...restaurants, newRestaurant]);

    setName("");
    setDescription("");
  }

  function deleteRestaurant(id) {
    setRestaurants(
      restaurants.filter((restaurant) => restaurant.id !== id)
    );
  }

  return (
    <main>
      <h1>Manage Restaurants</h1>

      <h2>Add Restaurant</h2>

      <form onSubmit={addRestaurant}>
        <input
          type="text"
          placeholder="Restaurant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Add Restaurant
        </button>
      </form>

      <h2>Restaurants</h2>

      {restaurants.map((restaurant) => (
        <div key={restaurant.id}>
          <h3>{restaurant.name}</h3>

          <p>{restaurant.description}</p>

          <button
            onClick={() => deleteRestaurant(restaurant.id)}
          >
            Delete
          </button>

          <hr />
        </div>
      ))}
    </main>
  );
}

export default AdminRestaurants;