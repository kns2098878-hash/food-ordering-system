import { Link } from "react-router-dom";

function OrderConfirmation() {

  const orderId =
    localStorage.getItem("lastOrderId") || "ORD-001";


  return (
    <main>

      <div className="confirmation-box">


        <h1>
          🎉 Order Confirmed!
        </h1>


        <p>
          Your order has been placed successfully.
        </p>


        <h2>
          Order ID: #{orderId}
        </h2>


        <p>
          Thank you for ordering with Foodie.
        </p>



        <div>

          <Link to="/orders">
            <button>
              View My Orders
            </button>
          </Link>


          <Link to="/restaurants">
            <button>
              Continue Shopping
            </button>
          </Link>


        </div>


      </div>


    </main>
  );
}


export default OrderConfirmation;