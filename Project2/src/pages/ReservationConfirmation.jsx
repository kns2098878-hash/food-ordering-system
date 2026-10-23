import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, CalendarDays, Clock, Users, MapPin, ArrowRight } from "lucide-react";

function ReservationConfirmation() {
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lastReservationData");
      if (stored) {
        setReservation(JSON.parse(stored));
      }
    } catch {}
  }, []);

  return (
    <div className="page-wrapper container" style={{ maxWidth: "680px" }}>
      <div className="foodie-card" style={{ padding: "48px 32px", textAlign: "center" }}>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#DEF7EC",
          color: "#03543F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px auto"
        }}>
          <CheckCircle2 size={48} />
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: "800", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>
          Table Reserved!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "32px" }}>
          Your restaurant reservation is confirmed. We look forward to hosting you!
        </p>

        {reservation && (
          <div style={{
            backgroundColor: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            textAlign: "left",
            marginBottom: "32px",
            border: "1px solid var(--border-warm)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Booking Reference</div>
                <strong style={{ fontSize: "1.1rem", color: "var(--primary-700)" }}>
                  {reservation.reservation_code || `#${reservation.id}`}
                </strong>
              </div>
              <span className="badge badge-success">
                {reservation.status || "Confirmed"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.92rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Restaurant:</span>
                <div style={{ fontWeight: "700" }}>{reservation.restaurant_name}</div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Allocated Table:</span>
                <div style={{ fontWeight: "700" }}>{reservation.table_name || `Table ${reservation.table_number || "Reserved"}`}</div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Date & Time:</span>
                <div style={{ fontWeight: "700" }}>{reservation.date || reservation.reservation_date} at {reservation.time || reservation.reservation_time}</div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Party Size:</span>
                <div style={{ fontWeight: "700" }}>{reservation.guests || reservation.party_size} Guests</div>
              </div>
            </div>

            {reservation.special_requests && (
              <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-warm)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <strong>Special Request:</strong> {reservation.special_requests}
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Link to="/reservations" className="btn-primary">
            <CalendarDays size={18} /> View My Reservations
          </Link>
          <Link to="/restaurants" className="btn-secondary">
            Explore Restaurants
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReservationConfirmation;
