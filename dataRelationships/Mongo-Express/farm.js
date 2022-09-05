const mongoose = require('mongoose')

const FarmSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Farm must have a name"] },
  city: String,
  email: { type: String, required: [true, "Email address is reqd"] },
  products: { type: mongoose.Schema.Types.ObjectId, ref: Product }
})

const Product = mongoose.model('Product', farmSchema)

module.exports = Product