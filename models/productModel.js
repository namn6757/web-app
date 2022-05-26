const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      unique: true,
      trym: true,
      required: true,
    },
    tittle: {
      type: String,
      trym: true,
      required: true,
    },
    price: {
      type: Number,
      trym: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: Object,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("products", productSchema);
