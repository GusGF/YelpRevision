const Joi = require('joi');

module.exports.CGJoiSchema = Joi.object({
  cg: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(1),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required()
  }).required()
});
// Couldn't get this to work?!
// module.exports = CGJoiSchema;

module.exports.RevJoiSchema = Joi.object({
  review: Joi.string().required(),
  rating: Joi.number().required()
});
// Couldn't get this to work?!
// module.exports = RevJoiSchema;