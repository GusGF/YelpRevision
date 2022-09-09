const mongoose = require('mongoose')

ProductSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Product name must be included"] },
  price: { type: Number, required: true, min: 1 },
  category: { type: String, enum: ['fruit', 'vegetables', 'dairy'], lowercase: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' }
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;