const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  payOrder,
  updateOrderToPaid
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);
router.post("/:id/pay", protect, payOrder);
router.put("/:id/pay", protect, updateOrderToPaid);

module.exports = router;
