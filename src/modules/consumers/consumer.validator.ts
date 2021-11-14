import Joi from 'joi';
import { LANGUAGES } from '../../constants/main';

export const ConsumerCreateValidation = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email(),
  language: Joi.number().allow(LANGUAGES.UA, LANGUAGES.EN, LANGUAGES.RU),
});

export const ConsumerEditValidation = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string(),
  language: Joi.number().allow(LANGUAGES.UA, LANGUAGES.EN, LANGUAGES.RU),
});
