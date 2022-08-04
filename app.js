const express = require('express')
const app = express()
const listeningPort = 3001
const mongoose = require('mongoose')
const path = require('path')
const CGModel = require('./models/campground')
const method = require('method-override')
const { render } = require('ejs')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')

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
// app.use((req, res, next) => {
//   const { password } = req.query
//   if (password)
//     next()
//   else
//     throw new Error("No password was given")
// })
// Allows layouts to be used
app.engine('ejs', ejsMate);

mongoose.connect('mongodb://localhost:27017/yelpRevDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const dbConn = mongoose.connection;
dbConn.on('error', console.error.bind(console, 'connection error:'));

// Middleware for checking for a password
const verifypwd = (req, res, next) => {
  if (req.query.password) {
    console.log(`The password was: ${req.query.password}`)
    next()
  } else throw new Error("Billocs")
}

app.get('/', (req, res) => {
  res.render('home')
})

// List campgrounds
app.get('/index', async (req, res) => {
  console.log("In index route")
  const allCampgrounds = await CGModel.find();
  // console.log({ allCampgrounds });
  res.render('index', { allCampgrounds });
  throw new Error("In index route")
});

// Data entry form
app.get('/campground/new', (req, res) => {
  console.log("In new route")
  res.render('new');
})

// Display a campground
app.get('/campground/:id', async (req, res) => {
  console.log("In display route")
  const campground = await CGModel.findById(req.params.id);
  // console.log(campground);
  res.render('show', { campground });
})

// Save new campground to DB
app.post('/makecampground', async (req, res) => {
  console.log("In saving route")
  const newCampground = new CGModel(req.body.cg)
  console.log(`${newCampground}`);
  await newCampground.save();
  console.log(newCampground._id)
  res.redirect(`/campground/${newCampground._id}`);
})

// Display a campground to be edited
app.get('/campgrounds/:id/edit', async (req, res) => {
  console.log("In edit route")
  const cg2Bedited = await CGModel.findById(req.params.id)
  // console.log(`So you want to edit ${cg2Bedited}`)
  res.render('edit', { cg2Bedited })
})

// Here we save the edited campground above
app.put('/campgrounds/:id', async (req, res) => {
  console.log("In save edit route")
  const id = req.params.id;
  updatedCG = req.body.cg;
  console.log(`Trying to update campground: ${id}`);
  const updatedCGconfirmation = await CGModel.findByIdAndUpdate(id, { ...updatedCG }, { new: true });
  res.redirect('/index');
})

// Delete a campground
app.delete('/campground/:id', async (req, res) => {
  console.log("In delete route")
  const id = req.params.id;
  // console.log(`Trying to delete a campground: ${id}`);
  const updatedCGconfirmation = await CGModel.findByIdAndDelete(id);
  res.redirect('/index');
})

// Will cause an error
app.get('/error', (req, res) => {
  chicken.fly();
})

// Page not found
app.use((req, res) => {
  res.status(404).render('error404')
})

// Custom error handling
app.use((err, req, res, next) => {
  console.log("*************************************")
  console.log("************** ERROR ****************")
  console.log("*************************************")
  res.status(404).send(`Error detected: ${err}`)
  next(err)
})

app.listen(listeningPort, () => {
  console.log(`Now listening on port ${listeningPort}`)
})





