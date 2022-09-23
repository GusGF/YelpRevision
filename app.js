const express = require('express')
const app = express()
const listeningPort = 3001
const mongoose = require('mongoose')
const path = require('path')
const CGModel = require('./models/campground')
const Review = require('./models/reviews')
const method = require('method-override')
const { render } = require('ejs')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const AppError = require('./Error-Handling/appError')
const ObjectID = require('mongoose').Types.ObjectId;
const Joi = require('joi')
const CGJoiSchema = require('./joiSchemas')
const RevJoiSchema = require('./joiSchemas')

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

mongoose.connect('mongodb://127.0.0.1:27017/yelpRevDB', {
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

// A convenient wrapper for async functions
function catchErrors(theFunc) {
  // console.log("************* catchErrors ************")
  return function (req, res, next) {
    theFunc(req, res, next).catch(e => next(e))
  }
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
});

// Data entry form 
app.get('/campground/new', (req, res) => {
  console.log("In new route")
  res.render('new');
})

// Display a campground
app.get('/campground/:id', catchErrors(async (req, res, next) => {
  console.log("In display route")
  // Checking if the campground ID is in the correct format
  if (!ObjectID.isValid(req.params.id))
    return next(new AppError("Campground ID supplied is in an invalid format"))
  const campground = await CGModel.findById(req.params.id).populate('reviews');
  if (!campground) {
    // Errors from async functions invoked by route handlers and middleware must be 
    // passed to the next() function hence code below
    // return next(new AppError("No campground found", 404));
    // We can go back to using the code below if we employ our wrapper function as our
    // wrapper function catches the error and passes it to next() anyway.
    throw new AppError("Campground not found", 404)
  }
  // console.log(campground);
  res.render('show', { campground });
}))

function validateCampground(req, res, next) {
  const result = CGJoiSchema.validate(req.body)
  console.log('++++++++++++  In validate campground  ++++++++++++')
  if (result.error) {
    const msg = result.error.details.map(element => element.message).join(', ')
    throw new AppError(msg, 400);
  } else {
    next();
  }
}

const validateReview = (req, res, next) => {
  const { error } = RevJoiSchema.validate(req.body)
  console.log(error)
  console.log('++++++++++++  In validate review  ++++++++++++')
  if (error) {
    const msg = error.details.map(element => element.message).join(', ')
    throw new AppError(msg, 400)
  } else {
    next()
  }
}

// Save new campground to DB
app.post('/makecampground', validateCampground, catchErrors(async (req, res, next) => {
  console.log("In saving route")
  const newCampground = new CGModel(req.body.cg)
  await newCampground.save();
  res.redirect(`/campground/${newCampground._id}`);
}))

// Display a campground to be edited
app.get('/campgrounds/:id/edit', catchErrors(async (req, res) => {
  console.log("In edit route")
  const cg2Bedited = await CGModel.findById(req.params.id)
  // console.log(`So you want to edit ${cg2Bedited}`)
  res.render('edit', { cg2Bedited })
}))

// Here we save the edited campground above
app.put('/campgrounds/:id', validateCampground, catchErrors(async (req, res) => {
  console.log("In save edit route")
  const id = req.params.id;
  updatedCG = req.body.cg;
  console.log(`Trying to update campground: ${id}`);
  const updatedCGconfirmation = await CGModel.findByIdAndUpdate(id, { ...updatedCG }, { new: true });
  res.redirect('/index');
}))

// Delete a campground
app.delete('/campground/:id', catchErrors(async (req, res) => {
  console.log("In delete route")
  const id = req.params.id;
  // console.log(`Trying to delete a campground: ${id}`);
  const updatedCGconfirmation = await CGModel.findByIdAndDelete(id);
  res.redirect('/index');
}))

// Create a review for a campsite
app.post('/campground/:id/review', validateReview, catchErrors(async (req, res) => {
  console.log('In Create a review for a campsite route')
  const campground = await CGModel.findById(req.params.id)
  const { rating, review } = req.body
  const theReview = new Review({ review, rating })
  await theReview.save()
  console.log(theReview)
  // Using 'push' as we are assigning review to an array of reviews
  campground.reviews.push(theReview)
  // res.send("Did you see the review in the console")
  await campground.save()
  res.redirect(`/campground/${req.params.id}`);

}))

// For pages not registered with express
app.all('*', (req, res, next) => {
  return next(new AppError("This page does not exist", 404))
})

app.use((err, req, res, next) => {
  console.log("*************************************")
  console.log("************** ERROR ****************")
  console.log("*************************************")
  // Setup defaults if 'err' does not have a value for either
  const { status = 500 } = err;
  const { message = 'This is just a default' } = err;
  res.status(status).render('error', { err });
  // res.status(status).send(`Error detected: ${message}`)
  // Now we are calling the built in error handling pointless as we're handling it here anyway!!
  // next(err);
})

app.listen(listeningPort, () => {
  console.log(`Now listening on port ${listeningPort}`)
})
