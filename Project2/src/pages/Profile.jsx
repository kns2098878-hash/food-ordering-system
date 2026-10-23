import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Phone, Mail, MapPin, Plus, Trash2, Key, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAddresses, createAddress, deleteAddress } from "../services/api";

function Profile() {
  const { user, updateUserProfile, showToast } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrTitle, setAddrTitle] = useState("Home");
  const [addrLine, setAddrLine] = useState("");
  const [city, setCity] = useState("Chennai");
  const [postalCode, setPostalCode] = useState("600017");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }
    loadAddresses();
  }, [user]);

  const loadAddresses = () => {
    getAddresses()
      .then((data) => setAddresses(data))
      .catch(() => {});
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = { name, phone };
      if (newPassword.trim()) payload.password = newPassword.trim();
      await updateUserProfile(payload);
      setNewPassword("");
    } catch {
      // error handled in context
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!addrLine.trim()) return;

    try {
      await createAddress({
        title: addrTitle,
        address_line1: addrLine.trim(),
        city,
        postal_code: postalCode,
      });
      showToast("Address added successfully!", "success");
      setAddrLine("");
      setShowAddressForm(false);
      loadAddresses();
    } catch (err) {
      showToast(err.message || "Failed to add address.", "error");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      showToast("Address removed.", "info");
      loadAddresses();
    } catch (err) {
      showToast(err.message || "Failed to delete address.", "error");
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: "800px" }}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: "800", fontFamily: "var(--font-serif)", marginBottom: "32px" }}>
        Customer Account & Profile
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Personal Details */}
        <div className="foodie-card" style={{ padding: "32px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px" }}>
            Personal Information
          </h3>

          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ""}
                  disabled
                  style={{ backgroundColor: "var(--bg-surface)", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Update Password (Optional)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Leave blank to keep current"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Address Book */}
        <div className="foodie-card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Saved Delivery Addresses</h3>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="btn-secondary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={16} /> {showAddressForm ? "Cancel" : "Add Address"}
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleCreateAddress} style={{
              backgroundColor: "var(--bg-surface)",
              padding: "20px",
              borderRadius: "var(--radius-md)",
              marginBottom: "24px",
              border: "1px solid var(--border-warm)"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label className="form-label">Address Title</label>
                  <select className="form-select" value={addrTitle} onChange={(e) => setAddrTitle(e.target.value)}>
                    <option value="Home">Home</option>
                    <option value="Work / Office">Work / Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Postal Pincode</label>
                  <input
                    type="text"
                    className="form-input"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address & Landmark</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 12 Burkit Road, Flat 4B, Emerald Residency"
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary btn-sm">Save Address</button>
            </form>
          )}

          {addresses.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No delivery addresses saved yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {addresses.map((a) => (
                <div key={a.id} style={{
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-warm)",
                  backgroundColor: "var(--bg-surface)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}>
                  <div>
                    <strong style={{ fontSize: "0.95rem" }}>{a.title}</strong>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      {a.address_line1}, {a.city} - {a.postal_code}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(a.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-light)" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
