import Joi from 'joi';
import { JoiObjectId } from '../../validations/extensions';
import { MODIFIER_TYPES } from './modifiers.constants';


export const ModifierBodyValidation = Joi.object({
  external: Joi.string(),
  name: Joi.string().required(),
  active: Joi.boolean().required(),

  type: Joi.number().allow(MODIFIER_TYPES.MULTI, MODIFIER_TYPES.SINGLE).required(),
  unique_options: Joi.boolean().required(),
  quantity: {
    free_quantity: Joi.number().min(0).required(),
    min_quantity: Joi.number().positive().required(),
    max_quantity: Joi.number().min(0).required(),
  },
  branches: Joi.object({
    list: Joi.array().items(JoiObjectId).required(),
    all: Joi.boolean().required(),
  }).required(),
  options: Joi.array().items(JoiObjectId).required()
});
