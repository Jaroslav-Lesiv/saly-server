import Joi from 'joi';

import { JoiObjectId } from '../../validations/extensions';

export const IngredientBodyValidation = Joi.object({
  external: JoiObjectId,
  name: Joi.string().required(),
  active: Joi.boolean().required(),
  price: Joi.number().required(),
  calories: Joi.object({
    protein: Joi.number().min(0).required(),
    fat: Joi.number().min(0).required(),
    carbohydrate: Joi.number().min(0).required(),
  }).required(),
});