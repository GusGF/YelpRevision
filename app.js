const express = require('express')
const app = express()
const listeningPort = 3001
const mongoose = require('mongoose')
const path = require('path')
const CGModel = require('./models/campground')
const method = require('method-override')
const { render } = require('ejs')
const morgan = require('morgan')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))

app.use(express.urlencoded({ extended: true }));
app.use(method('_method'));
// My piece of middleware
app.use((req, res, next) => {
  req.theTime = new Date().toJSON()
  console.log(`${req.method} request made on ${req.theTime}`)
  next();
})
app.use(morgan('tiny'))
// Passwording routes
app.use((req, res, next) => {
  if (req.params.password)
    next()
  else
    throw new Error("No password specified")
})

mongoose.connect('mongodb://localhost:27017/yelpRevDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const dbConn = mongoose.connection;
dbConn.on('error', console.error.bind(console, 'connection error:'));

app.get('/', (req, res) => {
  res.render('home')
})

// List campgrounds
app.get('/index', async (req, res) => {
  const allCampgrounds = await CGModel.find();
  // console.log({ allCampgrounds });
  res.render('index', { allCampgrounds });
});

// Data entry form
app.get('/campground/new', (req, res) => {
  res.render('new');
})

// Display a campground
app.get('/campground/:id', async (req, res) => {
  const campground = await CGModel.findById(req.params.id);
  // console.log(campground);
  res.render('show', { campground });
})

// Save new campground to DB
app.post('/makecampground', async (req, res) => {
  const newCampground = new CGModel(req.body.cg)
  await newCampground.save();
  // console.log(newCampground._id)
  res.redirect(`/campground/${newCampground._id}`);
})

// Display a campground to be edited
app.get('/campgrounds/:id/edit', async (req, res) => {
  const cg2Bedited = await CGModel.findById(req.params.id)
  // console.log(`So you want to edit ${cg2Bedited}`)
  res.render('edit', { cg2Bedited })
})

// Here we save the edited campground above
app.put('/campgrounds/:id', async (req, res) => {
  const id = req.params.id;
  updatedCG = req.body.cg;
  console.log(`Trying to update campground: ${id}`);
  const updatedCGconfirmation = await CGModel.findByIdAndUpdate(id, { ...updatedCG }, { new: true });
  res.redirect('/index');
})

// Delete a campground
app.delete('/campground/:id', async (req, res) => {
  const id = req.params.id;
  // console.log(`Trying to delete a campground: ${id}`);
  const updatedCGconfirmation = await CGModel.findByIdAndDelete(id);
  res.redirect('/index');
})

app.use((req, res) => {
  res.status(404).render('Error404')
})

app.listen(listeningPort, () => {
  console.log(`Now listening on port ${listeningPort}`)
})