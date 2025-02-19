const Product = require("../models/productModel");

// Create a product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, brand, category, price, imageUrl, description, stock } = req.body;
    const product = new Product({
      name,
      brand,
      category,
      price,
      imageUrl,
      description,
      stock
    });
    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all products (with optional search/filter)
exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }
    if (category && category !== "All") {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query);
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.brand = req.body.brand || product.brand;
      product.category = req.body.category || product.category;
      product.price = req.body.price || product.price;
      product.imageUrl = req.body.imageUrl || product.imageUrl;
      product.description = req.body.description || product.description;
      product.stock = req.body.stock || product.stock;

      const updatedProduct = await product.save();
      return res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.remove();
    return res.json({ message: "Product removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
