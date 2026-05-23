const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

// CREATE ORDER (protected)
router.post("/", auth, async (req, res) => {
  try {
    const newOrder = new Order({
      userId: req.user.id,
      products: req.body.products,
      totalAmount: req.body.totalAmount,
    });

    await newOrder.save();

    res.json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET USER ORDERS (protected)
router.get("/", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

module.exports = router;