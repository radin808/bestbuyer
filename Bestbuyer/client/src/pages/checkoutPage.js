import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      if (cartItems.length === 0) {
        setError("Cart is empty.");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to checkout.");
        return;
      }

      // 1. Create order
      const { data: order } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        {
          orderItems: cartItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress: { address, city, postalCode, country }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Create payment intent
      const { data: paymentIntent } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/${order._id}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Confirm card payment with Stripe
      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: {
              // In a real app, you'd have a <CardElement /> from @stripe/react-stripe-js
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      // 4. Update order to paid
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/${order._id}/pay`,
        {
          id: "dummy_id",
          status: "succeeded",
          update_time: new Date(),
          email_address: "test@example.com"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear cart
      localStorage.removeItem("cartItems");
      alert("Payment successful! Thank you for your order.");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Address: </label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ marginBottom: "0.5rem" }}
        />
      </div>
      <div>
        <label>City: </label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ marginBottom: "0.5rem" }}
        />
      </div>
      <div>
        <label>Postal Code: </label>
        <input
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          style={{ marginBottom: "0.5rem" }}
        />
      </div>
      <div>
        <label>Country: </label>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ marginBottom: "0.5rem" }}
        />
      </div>
      <button onClick={handleCheckout}>Pay Now</button>
    </div>
  );
};

export default CheckoutPage;
