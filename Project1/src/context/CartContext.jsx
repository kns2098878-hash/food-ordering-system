import { createContext, useContext, useState } from "react";

const CartContext = createContext();


export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);



  function addToCart(item) {

    const itemId = item.item_id || item.id;


    setCart((currentCart) => {

      const existingItem = currentCart.find(
        (cartItem) =>
          (cartItem.item_id || cartItem.id) === itemId
      );


      if (existingItem) {

        return currentCart.map((cartItem) =>
          (cartItem.item_id || cartItem.id) === itemId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1
              }
            : cartItem
        );

      }


      return [
        ...currentCart,
        {
          ...item,
          item_id: itemId,
          item_name: item.name || item.item_name,
          quantity: 1
        }
      ];

    });

  }



  function removeFromCart(itemId) {

    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          (item.item_id || item.id) !== itemId
      )
    );

  }



  function increaseQuantity(itemId) {

    setCart((currentCart) =>
      currentCart.map((item) =>
        (item.item_id || item.id) === itemId
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );

  }



  function decreaseQuantity(itemId) {

    setCart((currentCart) =>
      currentCart
        .map((item) =>
          (item.item_id || item.id) === itemId
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );

  }



  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );



  function clearCart() {
    setCart([]);
  }



  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        subtotal,
        clearCart
      }}
    >

      {children}

    </CartContext.Provider>

  );

}



export function useCart() {
  return useContext(CartContext);
}