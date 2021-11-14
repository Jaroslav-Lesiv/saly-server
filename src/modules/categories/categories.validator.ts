import Joi from 'joi';

import { JoiObjectId } from '../../validations/extensions';

export const CategoryBodyValidation = Joi.object({
  external: Joi.string(),
  active: Joi.boolean().required(),
  name: Joi.string().required(),
  products: Joi.array().items(JoiObjectId).required(),
  sort: Joi.number().min(0),

  branches: Joi.object({
    list: Joi.array().items(JoiObjectId).required(),
    all: Joi.boolean().required(),
  }).required(),

  // groups: any[];
  // combos: any[];
});
