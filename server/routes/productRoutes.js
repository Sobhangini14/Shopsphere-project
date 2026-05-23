const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ADD PRODUCT (ADMIN)
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;