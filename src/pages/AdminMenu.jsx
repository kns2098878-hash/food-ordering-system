import { useState } from "react";

function AdminMenu() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Paneer Biryani",
      price: 250,
      category: "Vegetarian",
    },
    {
      id: 2,
      name: "Chicken Biryani",
      price: 280,
      category: "Non-Vegetarian",
    },
  ]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Vegetarian");

  const [editingId, setEditingId] = useState(null);

  function saveItem(e) {
    e.preventDefault();

    if (!name.trim() || !price) {
      alert("Please fill all fields.");
      return;
    }

    if (editingId) {
      setItems(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: name.trim(),
                price: Number(price),
                category,
              }
            : item
        )
      );

      setEditingId(null);
    } else {
      setItems([
        ...items,
        {
          id: Date.now(),
          name: name.trim(),
          price: Number(price),
          category,
        },
      ]);
    }

    setName("");
    setPrice("");
    setCategory("Vegetarian");
  }

  function editItem(item) {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
  }

  function deleteItem(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <main>
      <h1>Manage Menu</h1>

      <h2>{editingId ? "Edit Item" : "Add Item"}</h2>

      <form onSubmit={saveItem}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Price"
          min="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <br />
        <br />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">
            Non-Vegetarian
          </option>
        </select>

        <br />
        <br />

        <button type="submit">
          {editingId ? "Update Item" : "Add Item"}
        </button>
      </form>

      <h2>Menu Items</h2>

      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>

          <p>₹{item.price}</p>

          <p>{item.category}</p>

          <button onClick={() => editItem(item)}>
            Edit
          </button>

          <button onClick={() => deleteItem(item.id)}>
            Delete
          </button>

          <hr />
        </div>
      ))}
    </main>
  );
}

export default AdminMenu;