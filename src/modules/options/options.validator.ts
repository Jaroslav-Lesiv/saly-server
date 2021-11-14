import Joi from 'joi';
import { STOCK_STATUS } from '../../constants/main';

import { JoiObjectId } from '../../validations/extensions';

export const OptionsBodyValidation = Joi.object({
  external: Joi.string(),
  active: Joi.boolean().required(),
  name: Joi.string().required(),
  image: Joi.string().allow('').required(),
  unit: {
    enabled: Joi.boolean().required(),
    name: Joi.string().required(),
    weight: Joi.number().min(0).required(),
  },
  ingredients: Joi.array().items({
    _id: JoiObjectId,
    quantity: Joi.number().positive().integer().required(),
  }),
  price: {
    calculated: Joi.boolean().required(),
    regular_price: Joi.number().min(0).required(),
    sale_price: Joi.number().min(0).allow(null).required(),
  },
  cost: {
    calculated: Joi.boolean().required(),
    regular_cost: Joi.number().min(0).required(),
  },
  tax: JoiObjectId.allow(null),
  calories: {
    // display calores
    display: Joi.boolean().required(),
    protein: Joi.number().min(0).required(),
    fat: Joi.number().min(0).required(),
    carbohydrate: Joi.number().min(0).required(),
    // calculate from ingredients
    calculated: Joi.boolean().required(),
  },
  in_stock: Joi.number().allow(STOCK_STATUS.IN_STOCK, STOCK_STATUS.OUT_OF_STOCK),

  branches: Joi.object({
    list: Joi.array().items(JoiObjectId).required(),
    all: Joi.boolean().required(),
  }).required(),
});
