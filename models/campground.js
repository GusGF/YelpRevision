const mongoose = require('mongoose');
// const campGroundSchema = new mongoose.Schema({
//   title: { type: String, required: [true, "Invalid title"] },
//   price: { type: Number, required: true },
//   description: { type: String },
//   location: { type: String, required: true },
//   image: { type: String, required: true }
// })
const campGroundSchema = new mongoose.Schema({
  title: { type: String },
  price: { type: Number },
  description: { type: String },
  location: { type: String },
  image: { type: String }
})
// const campGroundSchema = new mongoose.Schema({
//   title: { type: String }
// })
const CGModel = mongoose.model('CGModel', campGroundSchema);
module.exports = CGModel;