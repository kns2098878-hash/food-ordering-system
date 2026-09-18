import { useState } from "react";

function AdminReservations() {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      customer: "Rahul",
      restaurant: "Sample Restaurant",
      date: "2026-09-20",
      time: "19:00",
      guests: 4,
      status: "Pending",
    },
    {
      id: 2,
      customer: "Priya",
      restaurant: "Food Paradise",
      date: "2026-09-21",
      time: "20:00",
      guests: 2,
      status: "Confirmed",
    },
  ]);

  function changeStatus(id, status) {
    setReservations(
      reservations.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status }
          : reservation
      )
    );
  }

  return (
    <main>
      <h1>Manage Reservations</h1>

      {reservations.map((reservation) => (
        <div key={reservation.id}>
          <h2>Reservation #{reservation.id}</h2>

          <p>Customer: {reservation.customer}</p>
          <p>Restaurant: {reservation.restaurant}</p>
          <p>Date: {reservation.date}</p>
          <p>Time: {reservation.time}</p>
          <p>Guests: {reservation.guests}</p>
          <p>Status: {reservation.status}</p>

          <select
            value={reservation.status}
            onChange={(e) =>
              changeStatus(
                reservation.id,
                e.target.value
              )
            }
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <hr />
        </div>
      ))}
    </main>
  );
}

export default AdminReservations;