const Joi = require("@hapi/joi");
const { eventNames } = require("../models/Deck");

const validateBody = (schema) => {
  return (req, res, next) => {
    const validateResult = schema.validateBody(req.body);

    if (validateResult.error) {
      return res.status(400).json(validateResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value.params = {};

      req.value.body = validateResult.value;
      next();
    }
  };
};

const validateParam = (schema, name) => {
  return (req, res, next) => {
    console.log("params...", req.param[name]);
    const validateResult = schema.validate({ param: req.param[name] });
    console.log("result", validateResult);

    if (validateResult.error) {
      return res.status(400).json(validateResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value.params = {};

      req.value.params[name] = req.params[name];
      next();
    }
  };
};

const schemas = {
  deckSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
  }),

  newdeckSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
    owner: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  deckOptionalSchema: Joi.object().keys({
    name: Joi.string().min(6),
    description: Joi.string().min(10),
    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),

  isSchema: Joi.object().keys({
    param: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  userSchema: Joi.object().keys({
    fisrtName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
  }),

  userOptionalSchema: Joi.object().keys({
    fisrtName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    email: Joi.string().email(),
  }),
};

module.exports = {
  validateParam,
  validateBody,
  schemas,
};
