import { useLocation } from "react-router-dom";

function ReservationConfirmation() {
  const { state } = useLocation();

  return (
    <main>
      <h1>Reservation Confirmed! 🎉</h1>

      <p>Restaurant: {state?.restaurant || "Restaurant"}</p>
      <p>Date: {state?.date || "-"}</p>
      <p>Time: {state?.time || "-"}</p>
      <p>Guests: {state?.guests || "-"}</p>

      <h2>Reservation ID: RES-001</h2>
      <p>Status: Confirmed</p>
    </main>
  );
}

export default ReservationConfirmation;