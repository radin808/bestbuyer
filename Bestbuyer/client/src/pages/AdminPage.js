import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "Refrigerators",
    price: 0,
    imageUrl: "",
    description: "",
    stock: 0
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        alert("You are not authorized. Please log in as admin.");
        return;
      }
      if (editingId) {
        // Update product
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/products/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create product
        await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setEditingId(null);
      setForm({
        name: "",
        brand: "",
        category: "Refrigerators",
        price: 0,
        imageUrl: "",
        description: "",
        stock: 0
      });
      fetchProducts();
    } catch (error) {
      console.error("Error creating/updating product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl || "",
      description: product.description || "",
      stock: product.stock
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Brand"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          required
          style={{ marginRight: "0.5rem" }}
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ marginRight: "0.5rem" }}
        >
          <option>Refrigerators</option>
          <option>Washing Machines</option>
          <option>Microwaves</option>
          <option>Dishwashers</option>
          <option>Dryers</option>
        </select>
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          required
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          style={{ marginRight: "0.5rem" }}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          required
          style={{ marginRight: "0.5rem" }}
        />
        <button type="submit">
          {editingId ? "Update Product" : "Create Product"}
        </button>
      </form>

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id}>
              <td>{prod.name}</td>
              <td>{prod.brand}</td>
              <td>{prod.category}</td>
              <td>${prod.price}</td>
              <td>{prod.stock}</td>
              <td>
                {prod.imageUrl ? (
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(prod)} style={{ marginRight: "0.5rem" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(prod._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
