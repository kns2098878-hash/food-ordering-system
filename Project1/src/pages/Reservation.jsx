import { useState } from "react";
import {
  checkReservationAvailability,
  createReservation,
} from "../services/api";

function Reservation() {

  const [restaurant, setRestaurant] = useState("1");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  async function checkAvailability(e) {

    e.preventDefault();

    setError("");
    setSuccess("");
    setTables([]);
    setSelectedTable(null);


    if (!restaurant || !date || !time || !guests) {
      setError("Please fill all details.");
      return;
    }


    try {

      setLoading(true);

      const data = await checkReservationAvailability({
        restaurant_id: restaurant,
        date: date,
        time: time,
        guests: Number(guests),
      });


      let availableTables = [];


      if (Array.isArray(data)) {

        availableTables = data;

      } else if (data && Array.isArray(data.tables)) {

        availableTables = data.tables;

      } else if (data && Array.isArray(data.available_tables)) {

        availableTables = data.available_tables;

      }


      setTables(availableTables);


      if (availableTables.length === 0) {
        setError("No tables available for this time.");
      }

    } catch (err) {

      console.error("Reservation availability error:", err);

      setError(
        err.message || "Unable to check table availability."
      );

    } finally {

      setLoading(false);

    }

  }



  async function reserveTable() {

    setError("");
    setSuccess("");


    if (selectedTable === null) {

      setError("Please select a table.");
      return;

    }


    const savedUser = localStorage.getItem("user");


    if (!savedUser) {

      setError("Please login first.");
      return;

    }


    try {

      const savedData = JSON.parse(savedUser);

      const user = savedData.user || savedData;


      if (!user.id) {

        setError("User ID not found. Please login again.");
        return;

      }


      setLoading(true);


      await createReservation({

        user_id: user.id,
        restaurant_id: Number(restaurant),
        reservation_date: date,
        reservation_time: time,
        guests: Number(guests),
        table_number: Number(selectedTable),

      });


      setSuccess(
        `Table ${selectedTable} reserved successfully!`
      );


      setTables([]);
      setSelectedTable(null);


    } catch (err) {

      console.error("Reservation error:", err);

      setError(
        err.message || "Unable to reserve table."
      );

    } finally {

      setLoading(false);

    }

  }



  return (

    <main>

      <div className="reservation-box">

        <h1>Reserve a Table</h1>


        <form onSubmit={checkAvailability}>

          <label>
            Restaurant
          </label>

          <select
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
          >

            <option value="1">
              Food Paradise
            </option>

            <option value="2">
              Spice Hub
            </option>

            <option value="3">
              Tasty Bites
            </option>

          </select>


          <label>
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />


          <label>
            Time
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />


          <label>
            Number of Guests
          </label>

          <input
            type="number"
            min="1"
            max="20"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Checking..."
              : "Check Availability"}

          </button>

        </form>


        {error && (

          <p className="error-message">
            {error}
          </p>

        )}


        {success && (

          <p className="success-message">
            {success}
          </p>

        )}


        {tables.length > 0 && (

          <div className="availability-box">

            <h2>
              Available Tables
            </h2>


            {tables.map((table, index) => {

              const tableNumber =
                typeof table === "object"
                  ? (
                      table.table_number ||
                      table.table_id ||
                      table.id ||
                      index + 1
                    )
                  : table;


              return (

                <button
                  key={tableNumber}
                  type="button"
                  className={
                    selectedTable === tableNumber
                      ? "selected-table"
                      : ""
                  }
                  onClick={() =>
                    setSelectedTable(tableNumber)
                  }
                >

                  Table {tableNumber}

                </button>

              );

            })}


            {selectedTable !== null && (

              <div>

                <p>
                  Selected Table:
                  <b> {selectedTable}</b>
                </p>


                <button
                  type="button"
                  onClick={reserveTable}
                  disabled={loading}
                >

                  {loading
                    ? "Reserving..."
                    : "Confirm Reservation"}

                </button>

              </div>

            )}

          </div>

        )}

      </div>

    </main>

  );

}


export default Reservation;