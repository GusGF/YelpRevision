const mongoose = require('mongoose');

// This will drop the DB if it exists
function dropDB() {
  const dbConn = mongoose.createConnection('mongodb://localhost:27017/deleteDB');
  dbConn.dropDatabase();
  console.log('DB dropped')
}
// ***************************  Only run this once  ********************************
// dropDB()

mongoose.connect('mongodb://localhost:27017/deleteDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// PRODUCTS
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  season: {
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter']
  }
});
const Product = mongoose.model('Product', productSchema);
// ***************************  Only run this once  ********************************
// Product.insertMany([
//   { name: 'Sugar Baby WaterMelon', price: 2.50, season: 'summer' },
//   { name: 'Goddess Melon', price: 2.50, season: 'summer' },
//   { name: 'Asparagus', price: 3.50, season: 'spring' }
// ])

// FARM
const farmSchema = new mongoose.Schema({
  name: String,
  city: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  // Here we tell Mongoose this type i.e. it is an object ID type. It's not JS it's mongoose
  // The ref option is what tells Mongoose which model to use during population i.e. an array of 'Product' IDs.
})
const FarmModel = mongoose.model('Farm', farmSchema);
const createAFarm = async () => {
  console.log('Creating a farm')
  const farm = new FarmModel({ name: 'Full Belly Farms', city: 'Guinda, CA' });
  await farm.save()
}
// ***************************  Only run this once  ********************************
// createAFarm()

const addProduct = async () => {
  const melon = await Product.findOne({ name: "Goddess Melon" })
  const farm = await FarmModel.findOne({ name: "Full Belly Farms" })
  console.log(melon)
  farm.products.push(melon)
  console.log(farm)
  farm.save()
}
// ***************************  Only run this once  ********************************
// addProduct()


// ***************************  Only run this when needed  ********************************
FarmModel.findOne({ name: 'Full Belly Farms' })
  .populate('products')
  .then(farmFound => console.log(farmFound))
