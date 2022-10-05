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
const AppError = require('./utils/appError')
const ObjectID = require('mongoose').Types.ObjectId;
const Joi = require('joi')
const CGJoiSchema = require('./joiSchemas')
const RevJoiSchema = require('./joiSchemas')
// This brings in all the campground routes
const campgrounds = require('./routes/campgrounds')
const catchErrors = require('./utils/catchErrors')

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
app.use('/campgrounds', campgrounds)
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

app.get('/', (req, res) => {
  res.render('home')
})

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

// Delete Reviews
app.delete('/campground/:id/:reviewID', async (req, res) => {
  console.log("Deleting a review")
  // First find the review ref in campgrounds and 'pull' it from the reviews array
  const cg = await CGModel.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewID } })
  // Then remove the review from the reviews collection
  // console.log(req.params.reviewID)
  const review = await Review.findByIdAndRemove(req.params.reviewID)
  res.redirect(`/campground/${req.params.id}`);
})

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
