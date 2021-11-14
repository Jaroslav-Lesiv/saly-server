import Joi from 'joi';

export const JoiObjectId = Joi.string().length(24)