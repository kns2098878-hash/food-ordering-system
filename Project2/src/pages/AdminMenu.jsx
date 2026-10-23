import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Leaf, Sparkles, Flame } from "lucide-react";
import { getRestaurants, getRestaurantMenu, createAdminMenuItem, deleteAdminMenuItem } from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminMenu() {
  const { showToast } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [isVeg, setIsVeg] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getRestaurants()
      .then((data) => {
        setRestaurants(data);
        if (data.length > 0) {
          setSelectedRestId(data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedRestId) {
      fetchMenu(selectedRestId);
    }
  }, [selectedRestId]);

  const fetchMenu = (restId) => {
    setLoading(true);
    getRestaurantMenu(restId)
      .then((items) => {
        setMenuItems(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    try {
      setSubmitting(true);
      await createAdminMenuItem({
        restaurant_id: Number(selectedRestId),
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        discount_price: discountPrice ? Number(discountPrice) : null,
        is_vegetarian: isVeg,
        is_spicy: isSpicy,
        is_popular: isPopular,
        image_url: imageUrl.trim() || null
      });
      showToast("Menu item created!", "success");
      setName("");
      setDescription("");
      setPrice("");
      setDiscountPrice("");
      setShowAddModal(false);
      fetchMenu(selectedRestId);
    } catch (err) {
      showToast(err.message || "Failed to add menu item.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id) => {
    const confirmDel = window.confirm("Are you sure you want to delete this menu dish?");
    if (!confirmDel) return;

    try {
      await deleteAdminMenuItem(id);
      showToast("Menu item removed.", "info");
      fetchMenu(selectedRestId);
    } catch (err) {
      showToast(err.message || "Failed to delete item.", "error");
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <Link to="/admin" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "6px" }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", fontFamily: "var(--font-serif)" }}>
            Menu Management
          </h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary btn-sm">
          <Plus size={16} /> Add Menu Dish
        </button>
      </div>

      {/* Select Restaurant */}
      <div className="foodie-card" style={{ padding: "20px", marginBottom: "28px" }}>
        <label className="form-label">Select Restaurant Menu to Edit</label>
        <select
          className="form-select"
          value={selectedRestId}
          onChange={(e) => setSelectedRestId(e.target.value)}
        >
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>{r.name} ({r.cuisine_type})</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: "80px", borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="foodie-card" style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No menu items added for this restaurant yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="foodie-card"
              style={{
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"}
                  alt={item.name}
                  style={{ width: "54px", height: "54px", borderRadius: "8px", objectFit: "cover" }}
                />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700" }}>{item.name}</h4>
                    {item.is_vegetarian && <span className="badge badge-veg"><Leaf size={10} /> Veg</span>}
                    {item.is_popular && <span className="badge badge-warning"><Sparkles size={10} /> Popular</span>}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--primary-600)", fontWeight: "700" }}>
                    ₹{Number(item.price).toFixed(2)}
                    {item.discount_price && (
                      <span style={{ color: "var(--text-muted)", textDecoration: "line-through", marginLeft: "6px", fontSize: "0.78rem" }}>
                        ₹{Number(item.discount_price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="btn-secondary btn-sm"
                style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD MENU DISH MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "32px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "20px" }}>
              Add Dish to Menu
            </h2>

            <form onSubmit={handleCreateItem}>
              <div className="form-group">
                <label className="form-label">Dish Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Crispy Honey Chili Potato"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Appetizing description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Standard Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Price (₹, Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Unsplash or direct URL)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" }}>
                  <input type="checkbox" checked={isVeg} onChange={(e) => setIsVeg(e.target.checked)} style={{ accentColor: "var(--primary-600)" }} />
                  <span>Vegetarian</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" }}>
                  <input type="checkbox" checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} style={{ accentColor: "var(--primary-600)" }} />
                  <span>Spicy</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" }}>
                  <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} style={{ accentColor: "var(--primary-600)" }} />
                  <span>Popular</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add to Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMenu;
