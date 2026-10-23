import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();


  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );



  if (cart.length === 0) {

    return (
      <main>

        <h1>Your Cart</h1>

        <div className="empty-cart">

          <p>Your cart is empty.</p>

          <Link to="/restaurants">
            <button>
              Browse Restaurants
            </button>
          </Link>

        </div>

      </main>
    );

  }



  return (

    <main>

      <h1>Your Cart</h1>


      <div className="cart-container">


        {cart.map((item) => (

          <div
            className="cart-item"
            key={item.item_id || item.id}
          >


            <div className="cart-details">

              <h2>
                {item.item_name || item.name}
              </h2>

              <p>
                Price: ₹{item.price}
              </p>

            </div>



            <div className="quantity-controls">


              <button
                onClick={() =>
                  decreaseQuantity(item.item_id || item.id)
                }
              >
                −
              </button>


              <span>
                {item.quantity}
              </span>


              <button
                onClick={() =>
                  increaseQuantity(item.item_id || item.id)
                }
              >
                +
              </button>


            </div>



            <h3>
              ₹{(Number(item.price) * item.quantity).toFixed(2)}
            </h3>



            <button
              className="remove-btn"
              onClick={() =>
                removeFromCart(item.item_id || item.id)
              }
            >
              Remove
            </button>


          </div>

        ))}


      </div>



      <div className="cart-total">

        <h2>
          Subtotal: ₹{subtotal.toFixed(2)}
        </h2>


        <Link to="/checkout">

          <button>
            Proceed to Checkout
          </button>

        </Link>


      </div>


    </main>

  );
}


export default Cart;