const Joi = require('joi');
const CGJoiSchema = Joi.object({
  cg: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(1),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required()
  }).required()
})

module.exports = CGJoiSchema