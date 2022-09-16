const mongoose = require('mongoose')
const reviewSch = mongoose.Schema({
  review: { type: String, required: [true, 'Review body empty!!?'] },
  rating: { type: Number }
})
module.exports = mongoose.model('Review', reviewSch)