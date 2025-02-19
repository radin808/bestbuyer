import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products`,
        {
          params: { keyword, category, minPrice, maxPrice }
        }
      );
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="container">
      <h1>Welcome to BestBuyer Appliances</h1>

      {/* Search/Filter Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginRight: "1rem" }}
        >
          <option>All</option>
          <option>Refrigerators</option>
          <option>Washing Machines</option>
          <option>Microwaves</option>
          <option>Dishwashers</option>
          <option>Dryers</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <button type="submit">Search</button>
      </form>

      {/* Products List */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              width: "250px",
              textAlign: "center"
            }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  marginBottom: "1rem"
                }}
              />
            ) : (
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  backgroundColor: "#eee",
                  margin: "0 auto 1rem"
                }}
              >
                {/* placeholder for future image */}
              </div>
            )}
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Brand: {product.brand}</p>
            <p>${product.price}</p>
            <Link to={`/product/${product._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
