import Joi from 'joi';
import { LANGUAGES } from '../../constants/main';
import { USER_ROLES } from './user.constants';
// import { CityValidation } from "../locations/location.validator";

// const Position = Joi.object({
// 	coords: Joi.object({
// 		accuracy: Joi.number(),
// 		altitude: Joi.number(),
// 		altitudeAccuracy: Joi.number(),
// 		heading: Joi.number(),
// 		latitude: Joi.number(),
// 		longitude: Joi.number(),
// 		speed: Joi.number()
// 	}),
// 	mocked: Joi.boolean(),
// 	timestamp: Joi.date()
// });

export const CreateUserValidation = Joi.object({
  external: Joi.alternatives().try(Joi.string(), Joi.number()).allow(null),
  // active: Joi.boolean(),
  // deleted: Joi.boolean(),
  permissions: Joi.array().items(Joi.string()),
  role: Joi.number().allow(USER_ROLES.ADMIN, USER_ROLES.WORKER, USER_ROLES.CONSUMER).required(),
  // isTrial: Joi.boolean(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  phone: Joi.string(),
  email: Joi.string().email().required(),
  language: Joi.number().allow(LANGUAGES.UA, LANGUAGES.EN, LANGUAGES.RU),
});

export const UpdateUserValidation = Joi.object({
  external: Joi.alternatives().try(Joi.string(), Joi.number()).allow(null),
  // active: Joi.boolean(),
  // deleted: Joi.boolean(),
  permissions: Joi.array().items(Joi.string()),
  role: Joi.number().allow(USER_ROLES.ADMIN, USER_ROLES.WORKER, USER_ROLES.CONSUMER),
  // isTrial: Joi.boolean(),
  name: Joi.string(),
  password: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  language: Joi.number().allow(LANGUAGES.UA, LANGUAGES.EN, LANGUAGES.RU),
});

// export const AuthorizeValidation = Joi.object({
// 	name: Joi.string().required(),
// 	city: CityValidation.required(),
// 	phone: Joi.string()
// 		.required()
// 		.length(13),

// 	email: Joi.string()
// 		.email()
// 		.allow(""),
// 	password: Joi.string()
// 		.min(8)
// 		.allow("")
// });

// export const CreateTrielUserValidation = Joi.object({
// 	city: CityValidation.required(),
// 	deviceId: Joi.string().required()
// });

// export const UpdateUserValidation = Joi.object({
// 	name: Joi.string().allow(""),
// 	email: Joi.string().allow(""),
// 	phone: Joi.string()
// 		.length(13)
// 		.allow(""),
// 	city: CityValidation,
// 	password: Joi.string()
// 		.min(8)
// 		.allow(""),
// 	position: Position.allow(""),

// 	pushNotification: Joi.object({
// 		enabled: Joi.boolean().allow(""),
// 		expoToken: Joi.string().allow(""),
// 		firebaseToken: Joi.string().allow("")
// 	})
// });

// export const UserSetFavorite = Joi.object({
// 	object: Joi.string().required(),
// 	type: Joi.string()
// 		.allow("brand", "location")
// 		.required(),
// 	isFavorite: Joi.boolean().required()
// });

// export const GoogleSignIn = Joi.object({
// 	token: Joi.string().required(),
// 	expires: Joi.string().required(),
// 	refreshToken: Joi.string().required()
// });

// export const FacebookSignIn = Joi.object({
// 	expires: Joi.date()
// 		.timestamp()
// 		.required(),
// 	token: Joi.string().required()
// });

export const UserLoginValidation = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().required(),
});

// export const FindUser = Joi.object({
// 	phone: Joi.string().length(13),
// 	_id: Joi.string()
// });

export const emailValidation = (data: string) => {
  if (data.length === 0) return false;
  const emailRegExp = new RegExp(
    // eslint-disable-next-line
    /^(([a-zA-Z0-9]+((\.|\-|\_)[a-zA-Z0-9]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9_.-]+\.)+[a-zA-Z]{2,}))$/,
  );

  if (emailRegExp.test(data.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};
