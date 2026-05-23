const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");


// ================= ADD TO CART =================
router.post("/add", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity: 1 }]
      });
    } else {
      const existingProduct = cart.products.find(
        p => p.productId.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: "Added to cart",
      cart
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GET CART =================
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("products.productId");

    if (!cart) {
      return res.json({
        success: true,
        cart: { products: [] }
      });
    }

    res.json({
      success: true,
      cart
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= REMOVE ITEM =================
router.post("/remove", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart",
      cart
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= CLEAR CART =================
router.post("/clear", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.json({
        success: true,
        message: "Cart already empty"
      });
    }

    cart.products = [];
    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= CHECKOUT =================
router.post("/checkout", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId })
      .populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    let total = 0;

    cart.products.forEach(item => {
      total += (item.productId?.price || 0) * item.quantity;
    });

    const order = new Order({
      userId,
      products: cart.products,
      totalAmount: total
    });

    await order.save();

    // clear cart after order
    cart.products = [];
    await cart.save();

    res.json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;