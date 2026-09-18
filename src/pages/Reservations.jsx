import { useEffect, useState } from "react";
import { getReservations } from "../services/api";
import StatusMessage from "../components/StatusMessage";

function Reservations() {

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {

    getReservations()

      .then((data) => {

        setReservations(data);
        setLoading(false);

      })

      .catch((err) => {

        setError(err.message);
        setLoading(false);

      });


  }, []);




  if (loading) {

    return (

      <main>

        <h1>
          My Reservations
        </h1>


        <StatusMessage

          type="loading"

          message="Loading reservations..."

        />


      </main>

    );

  }





  if (error) {

    return (

      <main>

        <h1>
          My Reservations
        </h1>


        <StatusMessage

          type="error"

          message={error}

        />


      </main>

    );

  }





  if (reservations.length === 0) {

    return (

      <main>

        <h1>
          My Reservations
        </h1>


        <StatusMessage

          type="empty"

          message="You have no reservations yet."

        />


      </main>

    );

  }





  return (

    <main>


      <h1>
        My Reservations
      </h1>



      <div className="reservations-container">


        {reservations.map((reservation) => (


          <div

            className="reservation-card"

            key={reservation.id}

          >



            <h2>
              Reservation #{reservation.id}
            </h2>



            <p>
              📅 Date: {reservation.reservation_date}
            </p>



            <p>
              ⏰ Time: {reservation.reservation_time}
            </p>



            <p>
              👥 Guests: {reservation.guests}
            </p>



            <p>
              🪑 Table: {reservation.table_number}
            </p>



            <p>
              Status:
              <span className="confirmed-status">
                {" "}{reservation.status}
              </span>
            </p>



          </div>


        ))}


      </div>


    </main>

  );

}


export default Reservations;