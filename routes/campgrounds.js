const express = require('express')
const router = express.Router()
const catchErrors = require('../utils/catchErrors')
const AppError = require('../utils/appError')
const CGModel = require('../models/campground')
const Review = require('../models/reviews')
const Joi = require('joi')
const { CGJoiSchema } = require('../joiSchemas')
const ObjectID = require('mongoose').Types.ObjectId;

const validateCampground = (req, res, next) => {
  console.log('++++++++++++  In validate campground  ++++++++++++')
  console.log(req.body)
  const result = CGJoiSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(element => element.message).join(', ')
    throw new AppError(msg, 400);
  } else {
    next();
  }
}

// List campgrounds
router.get('/', async (req, res) => {
  console.log("In index route")
  const allCampgrounds = await CGModel.find();
  // console.log({ allCampgrounds });
  res.render('index', { allCampgrounds });
});

// Data entry form 
router.get('/new', (req, res) => {
  console.log("In new route")
  res.render('new');
})

// Display a campground
router.get('/:id', catchErrors(async (req, res, next) => {
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
  console.log(campground);
  res.render('show', { campground });
}))

// Save new campground to DB
router.post('/', validateCampground, catchErrors(async (req, res, next) => {
  console.log("In saving route")
  const newCampground = new CGModel(req.body.cg)
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
}))

// Display a campground to be edited
router.get('/:id/edit', catchErrors(async (req, res) => {
  console.log("In edit route")
  const cg2Bedited = await CGModel.findById(req.params.id)
  console.log("So you want to edit")
  console.log(cg2Bedited)
  res.render('edit', { cg2Bedited })
}))

// Here we save the edited campground above
router.put('/:id', validateCampground, catchErrors(async (req, res) => {
  console.log("In save edit route")
  const id = req.params.id;
  updatedCG = req.body.cg;
  console.log(`Trying to update campground: ${id}`);
  const updatedCGconfirmation = await CGModel.findByIdAndUpdate(id, { ...updatedCG }, { new: true });
  res.redirect('/campgrounds/');
}))

// Delete a campground
router.delete('/:id', catchErrors(async (req, res) => {
  console.log("In delete route")
  const id = req.params.id;
  // console.log(`Trying to delete a campground: ${id}`);
  const updatedCGconfirmation = await CGModel.findByIdAndDelete(id);
  res.redirect('/campgrounds/');
}))

module.exports = router