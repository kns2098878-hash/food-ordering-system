import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit2, ArrowLeft, Star, MapPin } from "lucide-react";
import { getRestaurants, createAdminRestaurant, deleteAdminRestaurant } from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminRestaurants() {
  const { showToast } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("Biryani & Mughlai");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Chennai");
  const [phone, setPhone] = useState("+91 44 2434 8899");
  const [priceTier, setPriceTier] = useState("$$");
  const [deliveryFee, setDeliveryFee] = useState(30);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = () => {
    setLoading(true);
    getRestaurants()
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    try {
      setSubmitting(true);
      await createAdminRestaurant({
        name: name.trim(),
        cuisine_type: cuisine,
        address: address.trim(),
        city,
        phone,
        price_tier: priceTier,
        delivery_fee: Number(deliveryFee),
      });
      showToast("Restaurant onboarded successfully!", "success");
      setName("");
      setAddress("");
      setShowAddModal(false);
      fetchRestaurants();
    } catch (err) {
      showToast(err.message || "Failed to add restaurant.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDel = window.confirm("Are you sure you want to remove this restaurant?");
    if (!confirmDel) return;

    try {
      await deleteAdminRestaurant(id);
      showToast("Restaurant deleted successfully.", "info");
      fetchRestaurants();
    } catch (err) {
      showToast(err.message || "Failed to delete restaurant.", "error");
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
            Manage Restaurants
          </h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary btn-sm">
          <Plus size={16} /> Add Restaurant
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: "90px", borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="foodie-card"
              style={{
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700" }}>{r.name}</h3>
                  <span className="badge badge-primary">{r.cuisine_type}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", fontWeight: "700" }}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <span>{Number(r.rating).toFixed(1)}</span>
                  </div>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {r.address}, {r.city} • Fee: ₹{Number(r.delivery_fee).toFixed(0)} • {r.price_tier}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Link to={`/restaurants/${r.id}/menu`} className="btn-secondary btn-sm">
                  View Menu
                </Link>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="btn-secondary btn-sm"
                  style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD RESTAURANT MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "32px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "20px" }}>
              Add New Restaurant
            </h2>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Restaurant Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Copper Chimney Express"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Cuisine Type</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price Tier</label>
                  <select className="form-select" value={priceTier} onChange={(e) => setPriceTier(e.target.value)}>
                    <option value="$">$ (Budget)</option>
                    <option value="$$">$$ (Moderate)</option>
                    <option value="$$$">$$$ (Fine Dine)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Street and Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Restaurant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRestaurants;
