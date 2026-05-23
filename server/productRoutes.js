const express = require("express");

const router = express.Router();

const Product = require("../models/Product");

// GET PRODUCTS
router.get("/", async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

module.exports = router;