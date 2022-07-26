const mongoose = require('mongoose');
const campGroundSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String
});
const CGModel = mongoose.model('CGModel', campGroundSchema);
module.exports = CGModel;