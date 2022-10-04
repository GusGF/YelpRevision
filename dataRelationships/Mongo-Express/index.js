const mongoose = require('mongoose')
const methodoverride = require('method-override')
const express = require('express')
const Farm = require('./models/farm')
const Product = require('./models/product')
const { render } = require('ejs')
const flash = require('connect-flash')
const session = require('express-session')

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
app.use(methodoverride('_method'))
/* This middleware automatically sends a cookie to the browser which contains a unique ID called a session I.D. SID, which will link to a memory space on the server where I can store info */
app.use(session({ cookie: { maxAge: 60000 }, secret: 'Woot', resave: false, saveUninitialized: false }))
app.use(flash())
app.use((req, res, next) => {
  res.locals.someMessages = req.flash('success')
  next()
})

// Add a product form
app.get('/products/new', (req, res) => {
  res.render('newProduct')
})

// Save the new product
app.post('/products', async (req, res) => {
  const newProduct = req.body.myProduct
  console.log(newProduct)
  const savedProduct = new Product(newProduct)
  await savedProduct.save()
  res.redirect('/products')
})

// Display a product
app.get('/products/:id', async (req, res) => {
  console.log("In display a product")
  // console.log(req.params.id)
  const foundProduct = await Product.findById(req.params.id).populate('farm')
  res.render('showProduct', { foundProduct })
})

// See a list of products
app.get('/products', async (req, res) => {
  const allProducts = await Product.find()
  res.render('products', { allProducts })
})

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
  const farmFound = await Farm.findById(id).populate('products')
  // console.log(farmFound)
  res.render('showFarm', { farmFound })
})

// Save the new farm
app.post('/farms', async (req, res) => {
  console.log(req.body)
  const theFarm = new Farm(req.body.myFarm)
  await theFarm.save()
  // Here we simply add the flash message to the session. In order 
  // to access it out, we just call req.flash when we're rendering 
  // something and then pass in a key. See route '/farms'
  req.flash('success', 'Successfully made a new farm!')
  res.redirect('/farms')
})

// Form for adding a new product to a farm
app.get('/farms/:farm_id/products/new', async (req, res) => {
  console.log("We're adding a product to this farm")
  const { farm_id } = req.params
  console.log("farm_id is: ")
  console.log(farm_id)
  const farmFound = await Farm.findById(farm_id)
  console.log("farmFound is:...")
  console.log(farmFound)
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
  // res.redirect('/farms')
  console.log(farmID)
  res.redirect(`/farms/${farmID}`)
})

// Delete a farm
app.delete('/farms/:id', async (req, res) => {
  console.log("In farm deletion")
  // console.log(req.params.id)
  // console.log(farm2Drop)
  // This will trigger a piece of Mongoose middleware which we will use
  // to also get rid of the associated products. See your farm model.
  const farm2Drop = await Farm.findByIdAndDelete(req.params.id)
  res.redirect('/farms')
})


app.listen(3000, () => { console.log("Listening on port 3000") })