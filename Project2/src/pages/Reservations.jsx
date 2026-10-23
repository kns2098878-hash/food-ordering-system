import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, Users, MapPin, AlertCircle, XCircle } from "lucide-react";
import { getReservations, cancelReservation } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Reservations() {
  const { user, showToast } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const fetchReservations = () => {
    setLoading(true);
    getReservations(user?.id)
      .then((data) => {
        setReservations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load reservations:", err);
        setLoading(false);
      });
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this dining reservation?");
    if (!confirmCancel) return;

    try {
      setCancellingId(id);
      await cancelReservation(id);
      showToast("Reservation cancelled successfully.", "info");
      fetchReservations();
    } catch (err) {
      showToast(err.message || "Failed to cancel reservation.", "error");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="badge badge-success">Confirmed</span>;
      case "completed":
        return <span className="badge badge-primary">Completed</span>;
      case "cancelled":
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: "860px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "800", fontFamily: "var(--font-serif)", marginBottom: "4px" }}>
            My Dining Bookings
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            View, track, and manage your restaurant table reservations.
          </p>
        </div>
        <Link to="/reservation" className="btn-primary btn-sm">
          Book New Table
        </Link>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: "130px", borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <div className="foodie-card" style={{ padding: "60px 20px", textAlign: "center" }}>
          <CalendarDays size={48} color="var(--primary-500)" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "8px" }}>No reservations found</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Reserve a table at Chennai's finest culinary spots without any wait time.
          </p>
          <Link to="/reservation" className="btn-primary">Book a Table Now</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {reservations.map((res) => (
            <div
              key={res.id}
              className="foodie-card"
              style={{
                padding: "24px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{res.restaurant_name}</h3>
                  {getStatusBadge(res.status)}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <CalendarDays size={16} color="var(--primary-600)" />
                    <span>{res.date || res.reservation_date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={16} color="var(--primary-600)" />
                    <span>{res.time || res.reservation_time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Users size={16} color="var(--primary-600)" />
                    <span>{res.guests || res.party_size} Guests</span>
                  </div>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--text-dark)", fontWeight: "600" }}>
                  Code: <span style={{ color: "var(--primary-700)" }}>{res.reservation_code}</span> •{" "}
                  {res.table_name || `Table ${res.table_number || "Reserved"}`} ({res.section || "indoor"})
                </div>

                {res.special_requests && (
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "6px" }}>
                    <em>Special request: {res.special_requests}</em>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <Link to={`/restaurants/${res.restaurant_id}/menu`} className="btn-secondary btn-sm">
                  View Menu
                </Link>
                {["pending", "confirmed"].includes(res.status) && (
                  <button
                    onClick={() => handleCancel(res.id)}
                    className="btn-secondary btn-sm"
                    disabled={cancellingId === res.id}
                    style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                  >
                    {cancellingId === res.id ? "..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reservations;
