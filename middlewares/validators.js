const { celebrate, Joi } = require("celebrate");


const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: objectIdSchema.required(),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: objectIdSchema.required(),
  }),
});
