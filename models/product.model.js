const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  photo: { type: String },
  brand: { type: String },
  name: { type: String },
  currentPrice: { type: String },
  oldPrice: { type: String },
})

module.exports = model("Product", ProductSchema);