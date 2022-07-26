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

app.get('/index', async (req, res) => {
  const allCampgrounds = await CGModel.find();
  console.log({ allCampgrounds });
  res.render('index', { allCampgrounds });
});

app.get('/campground/:id', async (req, res) => {
  const campground = await CGModel.findById(req.params.id);
  console.log(campground);
  res.render('show', { campground });
})

app.get('/makecampground', (req, res) => { })

app.listen(listeningPort, () => {
  console.log(`Now listening on port ${listeningPort}`)
})