const express = require("express");
const Product = require("../models/Product");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

/*
=========================================================
GET ALL PRODUCTS

GET /api/products
=========================================================
*/

router.get("/", getProducts);


/*
=========================================================
DELETE ALL PRODUCTS

DELETE /api/products/clear-all

Development/testing only.
=========================================================
*/

router.delete("/clear-all", async (req, res) => {
  try {
    const result = await Product.deleteMany({});

    console.log(
      `Deleted ${result.deletedCount} products from MongoDB`
    );

    return res.status(200).json({
      success: true,
      message: "All products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(
      "DELETE ALL PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete all products",
      error: error.message,
    });
  }
});


/*
=========================================================
GET ONE PRODUCT

GET /api/products/:id
=========================================================
*/

router.get("/:id", getProductById);


/*
=========================================================
CREATE PRODUCT

POST /api/products
=========================================================
*/

router.post("/", createProduct);


/*
=========================================================
UPDATE PRODUCT

PUT /api/products/:id
=========================================================
*/

router.put("/:id", updateProduct);


/*
=========================================================
DELETE ONE PRODUCT

DELETE /api/products/:id
=========================================================
*/

router.delete("/:id", deleteProduct);


/*
=========================================================
EXPORT ROUTER
=========================================================
*/

module.exports = router;