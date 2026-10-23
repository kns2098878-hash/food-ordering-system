import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, CalendarDays, Users } from "lucide-react";
import { getAdminReservations, updateAdminReservationStatus } from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminReservations() {
  const { showToast } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    setLoading(true);
    getAdminReservations()
      .then((data) => {
        setReservations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleStatusChange = async (resId, newStatus) => {
    try {
      setUpdatingId(resId);
      await updateAdminReservationStatus(resId, newStatus, "Status updated by admin console");
      showToast(`Reservation updated to ${newStatus}`, "success");
      fetchReservations();
    } catch (err) {
      showToast(err.message || "Failed to update reservation.", "error");
    } finally {
      setUpdatingId(null);
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
            Table Bookings Management
          </h1>
        </div>
        <button onClick={fetchReservations} className="btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: "100px", borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <div className="foodie-card" style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No table bookings recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {reservations.map((r) => (
            <div
              key={r.id}
              className="foodie-card"
              style={{
                padding: "20px 24px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>{r.restaurant_name}</h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--primary-700)", fontWeight: "700" }}>
                    {r.reservation_code}
                  </span>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "16px", marginBottom: "6px" }}>
                  <span>Guest: <strong>{r.customer_name || `User #${r.user_id}`}</strong> ({r.customer_phone || "No phone"})</span>
                  <span>Date: {r.date || r.reservation_date} at {r.time || r.reservation_time}</span>
                  <span>Party: {r.guests || r.party_size} Guests</span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--text-dark)", fontWeight: "600" }}>
                  Allocated: {r.table_name || `Table ${r.table_number || "Default"}`} ({r.section || "indoor"})
                  {r.special_requests && <span> • <em>Note: {r.special_requests}</em></span>}
                </div>
              </div>

              {/* Status Select Control */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>Status:</span>
                <select
                  className="form-select"
                  value={r.status}
                  disabled={updatingId === r.id}
                  onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "var(--radius-md)", fontSize: "0.85rem" }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReservations;
