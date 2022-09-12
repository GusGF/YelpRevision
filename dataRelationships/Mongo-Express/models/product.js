const mongoose = require('mongoose')

ProductSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Product name must be included"] },
  price: { type: Number, required: true, min: 1 },
  category: { type: String, enum: ['fruit', 'vegetables', 'dairy'], lowercase: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' }
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;




// // Adding a product to a farm
// app.post('/farms/:farmID/products', async (req, res) => {
//   // Don't understand why I need this...
//   const { name, price, category } = req.body.myProduct
//   // We've now got the new product
//   const myProduct = req.body.myProduct
//   console.log(name)
//   console.log(price)
//   console.log(category)
//   // And we also now have the farm I.D.
//   const { farmID } = req.params
//   const linkToFarm = Farm.findById(farmID)
//   console.log(farmID)
//   console.log(myProduct)
//   // const newProduct = new Product({ myProduct })
//   // Don't understand why I need this...
//   const newProduct = new Product({ name, price, category })
//   console.log("****************************************")
//   console.log(newProduct)
//   // This new product will now have an objectID we can push to the farm
//   // await newProduct.save()
//   linkToFarm.products.push(newProduct)
//   newProduct.farm = linkToFarm
//   await linkToFarm.save()
//   await newProduct.save()
// })