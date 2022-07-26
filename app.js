const express = require('express')
const app = express()
const listeningPort = 3001
const mongoose = require('mongoose')
const path = require('path')
const CGModel = require('./models/campground')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))

mongoose.connect('mongodb://localhost:27017/yelpRevDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const dbConn = mongoose.connection;
dbConn.on('error', console.error.bind(console, 'connection error:'));

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/makecampground', (req, res) => {
  const tempCG = CGModel({
    title: "Kinsale Campground",
    price: 17,
    description: "Located in Co.Cork by the sea",
    location: "Co.Cork",
    image: "No image yet"
  })
  res.send(tempCG);
  console.log(tempCG)
})

app.listen(listeningPort, () => {
  console.log(`Now listening on port ${listeningPort}`)
})