import Joi from 'joi';

export const TaxBodyValidation = Joi.object({
  external:  Joi.string(),
  name: Joi.string().required(),
  active: Joi.boolean().required(),
  amount: Joi.number().min(0).required(),
});
