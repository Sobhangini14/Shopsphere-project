const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");


// ================= GET MY ORDERS =================
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GET SINGLE ORDER =================
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate("products.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= UPDATE ORDER STATUS (ADMIN USE) =================
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;