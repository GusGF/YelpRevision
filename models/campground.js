const { ref } = require('joi');
const mongoose = require('mongoose');
const campGroundSchema = new mongoose.Schema({
  title: { type: String },
  price: { type: Number },
  description: { type: String },
  location: { type: String },
  image: { type: String },
  reviews: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Review' }]
})
const CGModel = mongoose.model('CGModel', campGroundSchema);
module.exports = CGModel;