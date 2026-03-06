const Joi = require("joi");

const objectIdSchema = Joi.string()
  .length(24)
  .pattern(/^[a-fA-F0-9]+$/)
  .messages({
    "string.length": "ID must be 24 hexadecimal characters",
    "string.pattern.base": "ID must be a valid hexadecimal value",
  });

const createClothingItemSchema = Joi.object({
  name: Joi.string().min(2).max(30).required().messages({
    "string.min": "Item name must be between 2 and 30 characters",
    "string.max": "Item name must be between 2 and 30 characters",
  }),
  imageUrl: Joi.string().uri().required().messages({
    "string.uri": "Image URL must be a valid URL",
  }),
});

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(30).messages({
    "string.min": "User name must be between 2 and 30 characters",
    "string.max": "User name must be between 2 and 30 characters",
  }),
  avatar: Joi.string().uri().required().messages({
    "string.uri": "Avatar must be a valid URL",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email format",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email format",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const itemIdParamsSchema = Joi.object({
  itemId: objectIdSchema,
});

module.exports = {
  objectIdSchema,
  createClothingItemSchema,
  createUserSchema,
  loginSchema,
  itemIdParamsSchema,
};
