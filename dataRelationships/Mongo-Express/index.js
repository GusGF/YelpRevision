const mongoose = require('mongoose')
const method = require('method-override')
const express = require('express')
const Farm = require('./models/farm')
const Product = require('./models/product')

// This will drop the DB if it exists
function dropDB() {
  const dbConn = mongoose.createConnection('mongodb://localhost:27017/deleteDB');
  dbConn.dropDatabase();
  console.log('DB dropped')
}
// dropDB();

mongoose.connect('mongodb://localhost:27017/deleteDB', {
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
  console.log("Farm added.......")
  console.log(req.body)
  const theFarm = new Farm(req.body.myFarm)
  await theFarm.save()
  res.redirect('/farms')
})




app.listen(3000, () => { console.log("Listening on port 3000") })