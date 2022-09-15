const mongoose = require('mongoose')
const reviewSch = mongoose.Schema({
  body: { type: String, required: [true, 'Review body empty!!?'] },
  rating: { type: Number, enum: [0, 2, 4, 6, 8, 10] }
})
module.exports = mongoose.model('Review', reviewSch)