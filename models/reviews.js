const mongoose = require('mongoose')
const reviewSch = mongoose.Schema({
  review: { type: String, required: [true, 'Review body empty!!?'] },
  rating: { type: Number, required: [true, 'You must rate!!'] }
})
module.exports = mongoose.model('Review', reviewSch)


// Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia, corporis suscipit ducimus atque aperiam placeat voluptatem excepturi fugit aut magni labore dolor blanditiis dolore? Atque officia alias in mollitia sunt.