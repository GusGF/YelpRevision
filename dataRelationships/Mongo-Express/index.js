const mongoose = require('mongoose')
const method = require('method-override')
const express = require('express')
const Farm = require('./models/farm')
const Product = require('./models/product')

// This will drop the DB if it exists
function dropDB() {
  const dbConn = mongoose.createConnection('mongodb://127.0.0.1:27017/deleteDB');
  dbConn.dropDatabase();
  console.log('DB dropped')
}
// dropDB();

mongoose.connect('mongodb://127.0.0.1:27017/deleteDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.urlencoded({ extended: true }));
const categories = ['fruit', 'vegetable', 'dairy']

// See all farms
app.get('/farms', async (req, res) => {
  const allFarms = await Farm.find({})
  res.render('index', { allFarms })
})

// Add a new farm
app.get('/farms/new', (req, res) => {
  res.render('newFarm')
})

// Display a farm
app.get('/farms/:id', async (req, res) => {
  const { id } = req.params
  const farmFound = await Farm.findById(id)
  res.render('showFarm', { farmFound })
})

// Save the new farm
app.post('/farms', async (req, res) => {
  console.log(req.body)
  const theFarm = new Farm(req.body.myFarm)
  await theFarm.save()
  res.redirect('/farms')
})

// Form for adding a new product to a farm
app.get('/farms/:farm_id/products/new', async (req, res) => {
  console.log("We're adding a product to this farm")
  const { farm_id } = req.params
  const farmFound = await Farm.findById(farm_id)
  res.render('addAProduct', { farmFound })
})

// Adding a product to a farm
app.post('/farms/:farmID/products', async (req, res) => {
  const { name, price, category } = req.body.myProduct
  const newProduct = new Product({ name, price, category })
  const { farmID } = req.params
  const currFarm = await Farm.findById(farmID)
  currFarm.products.push(newProduct)
  newProduct.farm = currFarm
  await currFarm.save()
  await newProduct.save()
})

app.listen(3000, () => { console.log("Listening on port 3000") })