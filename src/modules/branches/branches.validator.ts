import Joi from 'joi';

export const BranchBodyValidation = Joi.object({
  external: Joi.string(),
  active: Joi.boolean().required(),
  name: Joi.string().min(2).required(),
  description: Joi.string().allow('').required(),
  image: Joi.string().allow('').required(),
  phone: Joi.string().min(9).max(15).required(),
  address: Joi.object({
    label: Joi.string().min(2).required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }),
});
