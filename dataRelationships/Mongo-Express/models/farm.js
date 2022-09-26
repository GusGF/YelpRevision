const mongoose = require('mongoose')
const Product = require('./product')

const FarmSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Farm must have a name"] },
  city: { type: String },
  email: { type: String, required: [true, "Email address is reqd"] },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})

// // Middleware must be run before we compile the model below
// // findByIdAndDelete() triggers findOneAndDelete()
// FarmSchema.pre('findOneAndDelete', async function (data) {
//   console.log("Pre middleware")
//   console.log(data)
// })

// This runs when we call findByIdAndDelete() but if we were to change to using a
// different function e.g. 'Delete()' then our middleware below would not be called
// so we'd have to alter it. So something to be aware of.
FarmSchema.post('findOneAndDelete', async function (farmToBeDeleted) {
  console.log("Post middleware")
  if (farmToBeDeleted.products.length) {
    // Delete all products where the ID is in the products array for the farm we just deleted.
    const simpleResp = await Product.deleteMany({ _id: { $in: farmToBeDeleted.products } })
    console.log(simpleResp)
  }
})

const Farm = mongoose.model('Farm', FarmSchema)

module.exports = Farm



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// https://mongoosejs.com/docs/api.html#model_Model-findByIdAndDelete
// Mongoose Middleware Docs: https://mongoosejs.com/docs/middleware.html
// I'm going to set up a Mongoose middleware and we need to do this on the schema before we compile the actual
// model. This is where it gets more complicated because I have to decide if I'm doing a pre or post middleware.
// If we go back to the middleware docs and we look at findOneAndDelete(), which is what we're
// going to be working with, it is a query middleware, not a model or document middleware. That distinction
// is important, but we're not going to go into it at this point. All that I'll say is that, well, they tell
// you right here in a query middleware function, 'this' refers to the query versus in a document middleware
// function 'this' refers to the document. When we set up our middleware and it's a query middleware
// which ours has to be, it's just that's what findOneAndDelete() is, WE NEED TO WAIT UNTIL AFTER our query
// has completed so that we have access to the document that was found.
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++