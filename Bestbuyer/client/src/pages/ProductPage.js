import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItem = cartItems.find((item) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({ ...product, quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate("/cart");
  };

  if (!product) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{product.name}</h2>
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: "300px", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "300px",
            height: "300px",
            backgroundColor: "#eee"
          }}
        ></div>
      )}
      <p>Brand: {product.brand}</p>
      <p>Category: {product.category}</p>
      <p>Description: {product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock > 0 ? product.stock : "Out of Stock"}</p>

      {product.stock > 0 && (
        <div>
          <label>Quantity: </label>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            style={{ marginRight: "1rem" }}
          />
          <button onClick={addToCart}>Add to Cart</button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
