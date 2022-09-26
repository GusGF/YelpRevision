const { ref } = require('joi');
const mongoose = require('mongoose');
const Review = require('./reviews');
const campGroundSchema = new mongoose.Schema({
  title: { type: String },
  price: { type: Number },
  description: { type: String },
  location: { type: String },
  image: { type: String },
  reviews: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Review' }]
})


/* NOTE: Middleware must be run before we compile the model below. We want the deletion of a campground to cascade down to related reviews and we will do this using Mongoose middleware. Specific middleware runs when we call findByIdAndDelete(). But if we were to change to using a different function e.g. 'Delete()' then our middleware below would not be called so we'd have to find what middleware would be triggered by 'Delete'. Something to be aware of. If 'docDeleted' is true i.e. the campground that was just deleted then delete associated reviews */
// findByIdAndDelete(id) triggers findOneAndDelete()
campGroundSchema.post('findOneAndDelete', async function (docDeleted) {
  console.log('Deleting reviews related to the deleted campground')
  if (docDeleted) {
    await Review.deleteMany({ _id: { $in: docDeleted.reviews } })
  }
})


const CGModel = mongoose.model('CGModel', campGroundSchema);
module.exports = CGModel;