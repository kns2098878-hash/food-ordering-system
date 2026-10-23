import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/api";

function Checkout() {

  const { cart, clearCart } = useCart();
  const navigate = useNavigate();


  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );



  async function handleOrder(e) {

    e.preventDefault();

    setError("");


    const cleanAddress = address.trim();
    const cleanPhone = phone.trim();


    if (cleanAddress.length < 10) {

      setError(
        "Please enter a complete delivery address."
      );

      return;
    }


    if (!/^[0-9]{10}$/.test(cleanPhone)) {

      setError(
        "Phone number must be exactly 10 digits."
      );

      return;
    }



    const savedUser =
      localStorage.getItem("user");


    if (!savedUser) {

      setError(
        "Please login again."
      );

      return;

    }



    const data =
      JSON.parse(savedUser);


    const user =
      data.user || data;



    if (!user.id) {

      setError(
        "User ID not found. Please login again."
      );

      return;

    }



    try {

      setLoading(true);


      const response = await placeOrder({
  user_id: user.id,
  total_amount: total,
  address: cleanAddress,
  phone: cleanPhone,
  items: cart,
});


localStorage.setItem(
  "lastOrderId",
  response.order_id
);



      clearCart();

      navigate("/order-confirmation");


    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  }



  if (cart.length === 0) {

    return (

      <main>

        <h1>Checkout</h1>

        <p>
          Your cart is empty.
        </p>


      </main>

    );

  }



  return (

    <main>


      <div className="checkout-box">


        <h1>
          Checkout
        </h1>



        <div className="order-summary">

          <h2>
            Order Summary
          </h2>


          {cart.map((item) => (

            <p key={item.item_id}>

              {item.item_name} × {item.quantity}

              {" "} - ₹
              {(Number(item.price) * item.quantity).toFixed(2)}

            </p>

          ))}


          <h2>
            Total: ₹{total.toFixed(2)}
          </h2>


        </div>




        <h2>
          Delivery Details
        </h2>



        <form onSubmit={handleOrder}>


          <input

            type="text"

            placeholder="Delivery Address"

            value={address}

            onChange={(e) =>
              setAddress(e.target.value)
            }

          />



          <input

            type="tel"

            placeholder="Phone Number"

            value={phone}

            onChange={(e) =>
              setPhone(e.target.value)
            }

          />



          {error && (

            <p className="error-message">

              {error}

            </p>

          )}



          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Placing Order..."
              : "Place Order"}

          </button>



        </form>


      </div>


    </main>

  );

}


export default Checkout;