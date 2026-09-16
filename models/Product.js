const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },

    value: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      min: 0,
      default: 0,
    },

    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    /*
     * Frontend catalogue ID.
     *
     * Example:
     * id: 3
     *
     * This is NOT the MongoDB ID.
     */
    id: {
      type: Number,
      required: false,
    },

    /*
     * Product name
     */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    /*
     * Product description
     */
    description: {
      type: String,
      default: "",
      trim: true,
    },

    /*
     * Store category
     */
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Electronics",
        "Fashion",
        "Home",
        "Books",
      ],
    },

    /*
     * CURRENT SELLING PRICE
     *
     * Example:
     * price: 6499
     */
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
     * ORIGINAL / MRP PRICE
     *
     * Example:
     * originalPrice: 7999
     */
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
     * Available stock
     */
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    /*
     * Product image URL
     */
    image: {
      type: String,
      default: "",
      trim: true,
    },

    /*
     * Product rating
     */
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },

    /*
     * Number of reviews
     */
    reviews: {
      type: Number,
      min: 0,
      default: 0,
    },

    /*
     * Product status
     */
    status: {
      type: String,
      enum: [
        "active",
        "inactive",
      ],
      default: "active",
    },

    /*
     * Vendor reference
     */
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    /*
     * Store / tenant reference
     */
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: false,
    },

    /*
     * Product variants
     */
    variants: {
      type: [variantSchema],
      default: [],
    },
  },

  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);