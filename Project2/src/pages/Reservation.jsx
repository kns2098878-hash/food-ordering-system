import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CalendarDays, Clock, Users, MapPin, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { getRestaurants, checkReservationAvailability, createReservation } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Reservation() {
  const [searchParams] = useSearchParams();
  const preselectedRestId = searchParams.get("restaurant_id");
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState(preselectedRestId || "");
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("19:30:00");
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");

  // Table availability
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [checkingTables, setCheckingTables] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const timeSlots = [
    { label: "12:30 PM", value: "12:30:00" },
    { label: "01:00 PM", value: "13:00:00" },
    { label: "01:30 PM", value: "13:30:00" },
    { label: "07:00 PM", value: "19:00:00" },
    { label: "07:30 PM", value: "19:30:00" },
    { label: "08:00 PM", value: "20:00:00" },
    { label: "08:30 PM", value: "20:30:00" },
    { label: "09:00 PM", value: "21:00:00" },
  ];

  useEffect(() => {
    getRestaurants()
      .then((data) => {
        setRestaurants(data);
        if (!restaurantId && data.length > 0) {
          setRestaurantId(data[0].id);
        }
      })
      .catch((err) => console.error("Error loading restaurants:", err));
  }, []);

  useEffect(() => {
    if (restaurantId && date && time) {
      checkAvailability();
    }
  }, [restaurantId, date, time, guests]);

  const checkAvailability = () => {
    setCheckingTables(true);
    checkReservationAvailability({
      restaurant_id: restaurantId,
      date,
      time,
      guests,
    })
      .then((data) => {
        setAvailableTables(data.tables || []);
        if (data.tables && data.tables.length > 0) {
          setSelectedTableId(data.tables[0].id || data.tables[0].table_id);
        } else {
          setSelectedTableId(null);
        }
        setCheckingTables(false);
      })
      .catch((err) => {
        console.error("Availability check failed:", err);
        setCheckingTables(false);
      });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!restaurantId) {
      setError("Please select a restaurant.");
      return;
    }

    if (!selectedTableId && availableTables.length === 0) {
      setError("No tables are available for the selected slot. Please adjust date or time.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createReservation({
        user_id: user?.id,
        restaurant_id: Number(restaurantId),
        date,
        time,
        guests: Number(guests),
        table_id: selectedTableId,
        special_requests: specialRequests.trim(),
      });

      localStorage.setItem("lastReservationData", JSON.stringify(res.reservation || res));
      showToast("Table reserved successfully!", "success");
      navigate("/reservation-confirmation");
    } catch (err) {
      setError(err.message || "Failed to complete reservation.");
      showToast(err.message || "Booking failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: "800px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h1 style={{ fontSize: "2.4rem", fontWeight: "800", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>
          Reserve a Dining Table
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
          Skip the queue. Guaranteed prime table allocation with instant confirmation.
        </p>
      </div>

      {error && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 18px",
          backgroundColor: "#FEF2F2",
          border: "1px solid #FECACA",
          color: "#991B1B",
          borderRadius: "var(--radius-md)",
          marginBottom: "24px"
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleBooking} className="foodie-card" style={{ padding: "36px 32px" }}>
        {/* 1. Restaurant Selector */}
        <div className="form-group">
          <label className="form-label">Select Restaurant</label>
          <select 
            className="form-select"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            required
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.cuisine_type} ({r.city})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Date, Time & Party Size */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input 
              type="date"
              className="form-input"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Time Slot</label>
            <select 
              className="form-select"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Number of Guests</label>
            <select 
              className="form-select"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Real-Time Table Selection */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              Available Tables ({availableTables.length})
            </label>
            {checkingTables && <span style={{ fontSize: "0.85rem", color: "var(--primary-600)" }}>Checking availability...</span>}
          </div>

          {availableTables.length === 0 ? (
            <div style={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-muted)",
              fontSize: "0.9rem"
            }}>
              No tables found for this guest count and time slot. Try selecting another time slot or party size.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
              {availableTables.map((t) => {
                const id = t.id || t.table_id;
                const isSelected = selectedTableId === id;
                return (
                  <div
                    key={id}
                    onClick={() => setSelectedTableId(id)}
                    style={{
                      padding: "14px",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? "2px solid var(--primary-600)" : "1px solid var(--border-warm)",
                      backgroundColor: isSelected ? "var(--primary-50)" : "var(--bg-surface)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>
                      {t.table_name || `Table ${t.table_number}`}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      Capacity: {t.capacity} • {t.section || "indoor"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Special Requests */}
        <div className="form-group">
          <label className="form-label">Special Dining Requests (Optional)</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="e.g. Window booth preferred, anniversary candlelight setting, high chair for toddler..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || availableTables.length === 0}
          style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }}
        >
          {submitting ? "Confirming Table..." : "Confirm Table Reservation"}
        </button>
      </form>
    </div>
  );
}

export default Reservation;
