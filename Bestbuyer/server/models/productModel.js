const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Refrigerators", "Washing Machines", "Microwaves", "Dishwashers", "Dryers"],
    required: true
  },
  price: { type: Number, required: true },
  imageUrl: { type: String, default: "" }, // place your image link here later
  description: { type: String, default: "" },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
