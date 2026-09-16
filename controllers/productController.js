const Product = require("../models/Product");

/*
=========================================================
GET ALL PRODUCTS
GET /api/products
=========================================================
*/

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products: products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get products",
      error: error.message,
      count: 0,
      products: [],
    });
  }
};


/*
=========================================================
GET ONE PRODUCT
GET /api/products/:id
=========================================================
*/

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product: product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: error.message,
    });
  }
};


/*
=========================================================
CREATE PRODUCT
POST /api/products
=========================================================
*/

const createProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      category,
      price,
      originalPrice,
      stock,
      rating,
      reviews,
      image,
      status,
      variants,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (
      price === undefined ||
      price === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Product price is required",
      });
    }

    const product =
      await Product.create({
        ...(id !== undefined && {
          id: Number(id),
        }),

        name: String(name).trim(),

        description:
          description || "",

        category:
          category || "Electronics",

        price:
          Number(price) || 0,

        originalPrice:
          Number(
            originalPrice ??
            price
          ) || 0,

        stock:
          Number(stock) || 0,

        rating:
          Number(rating) || 0,

        reviews:
          Number(reviews) || 0,

        image:
          image || "",

        status:
          status || "active",

        variants:
          Array.isArray(variants)
            ? variants
            : [],
      });

    console.log(
      "Created product:",
      product._id.toString()
    );

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product: product,
    });
  } catch (error) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create product",
      error: error.message,
    });
  }
};


/*
=========================================================
UPDATE PRODUCT
PUT /api/products/:id
=========================================================
*/

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const updateData = {
      ...req.body,
    };

    if (
      updateData.price !== undefined
    ) {
      updateData.price =
        Number(updateData.price);
    }

    if (
      updateData.originalPrice !==
      undefined
    ) {
      updateData.originalPrice =
        Number(
          updateData.originalPrice
        );
    }

    if (
      updateData.stock !== undefined
    ) {
      updateData.stock =
        Number(updateData.stock);
    }

    if (
      updateData.rating !== undefined
    ) {
      updateData.rating =
        Number(updateData.rating);
    }

    if (
      updateData.reviews !== undefined
    ) {
      updateData.reviews =
        Number(updateData.reviews);
    }

    if (
      updateData.id !== undefined
    ) {
      updateData.id =
        Number(updateData.id);
    }

    if (
      updateData.variants !==
        undefined &&
      !Array.isArray(
        updateData.variants
      )
    ) {
      updateData.variants = [];
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update product",
      error: error.message,
    });
  }
};


/*
=========================================================
DELETE PRODUCT
DELETE /api/products/:id
=========================================================
*/

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required",
      });
    }

    console.log(
      "Delete request received:",
      id
    );

    const deletedProduct =
      await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found in MongoDB",
      });
    }

    console.log(
      "Deleted product:",
      deletedProduct._id.toString()
    );

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete product",
      error: error.message,
    });
  }
};


/*
=========================================================
EXPORT
=========================================================
*/

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};