import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(items);
  }, []);

  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return <div className="container">Your cart is empty.</div>;
  }

  return (
    <div className="container">
      <h1>Your Cart</h1>
      {cartItems.map((item) => (
        <div
          key={item._id}
          style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}
        >
          <h4>{item.name}</h4>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price * item.quantity}</p>
          <button onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${totalPrice}</h3>
      <button onClick={proceedToCheckout}>Proceed to Checkout</button>
    </div>
  );
};

export default CartPage;
