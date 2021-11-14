import { ObjectId } from 'bson';
import * as jwt from 'jsonwebtoken';
import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { JWT_TYPE, LANGUAGES } from '../../constants/main';
import { hashPassword } from '../../utils';
import { IApplicationDocument } from '../applications/applications.types';
import { USER_ROLES } from './user.constants';
import { IUserDocument, IUserModel } from './settings.types';

// import { hashPassword } from "../../../core";
// import mailer from "../../../core/mailer";
// import smsService from "../../../core/sms";
// import { otpService } from "../../../utils";
// const mongooseTypePhone = require("mongoose-type-phone");

// const countrySchema = new Schema({
//     name: String,
//     id: String,
// })

// const userLoyaltyFavoriteSchema: any = new Schema({
//     loyaltyCard: { type: String, ref: 'LoyaltyCard' },
// }, {
//     timestamps: true
// })
// const userDiscountFavoriteSchema: any = new Schema({
//     dailyDiscount: { type: String, ref: 'DailyDiscount' },
// }, {
//     timestamps: true
// })

const userSchema: Schema<IUserDocument> = new Schema(
  {
    external: { type: String, default: null, lowercase: true, index: true },
    service: { type: ObjectId, ref: 'Service' },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    role: {
      type: Number,
      enum: [USER_ROLES.ADMIN, USER_ROLES.WORKER, USER_ROLES.CONSUMER],
      required: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    phone_validation: {
      otp: {
        secret: { type: String, default: null },
        expires: { type: Date, default: null },
      },
      confirmed: { type: Boolean, default: false },
    },
    phone: { type: String, default: null, lowercase: true, index: true },

    email: {
      type: String,
      default: null,
      lowercase: true,
      index: true,
      required: true,
    },
    email_validation: {
      otp: {
        secret: { type: String, default: null },
        expires: { type: Date, default: null },
      },
      confirmed: { type: Boolean, default: false },
    },
    language: {
      type: Number,
      enum: [LANGUAGES.UA, LANGUAGES.EN, LANGUAGES.RU],
      default: LANGUAGES.UA,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(mongoosePaginate);

// userSchema.methods.getOTP = async function() {
// 	const currentTime = Date.now();
// 	const diff = (currentTime - (this.otp.lastCreation || 0)) / 1000;
// 	let resendTime = Number(process.env.OTP_RESEND);
// 	if (isNaN(resendTime) || !resendTime) resendTime = 30;
// 	if (diff < resendTime) {
// 		throw {
// 			message: `error.otp_resend_time`,
// 			isTimeError: true
// 		};
// 	}

// 	let token, secret;
// 	if (this.phone === "+380951620180") {
// 		[token, secret] = ["7033", "c251f4ca7e2b659a0e2d8359596e1d39"];
// 	} else {
// 		[token, secret] = otpService.generate();
// 	}
// 	this.otp.secret = secret;
// 	this.otp.lastCreation = currentTime;
// 	await this.save();
// 	return token;
// };

// userSchema.methods.confirmOTP = async function(token: string, isPhone?: boolean) {
// 	let isVerified = false;
// 	if (this.phone === "+380951620180") {
// 		isVerified = "7033" === token;
// 	} else {
// 		isVerified = otpService.validate(token, this.otp.secret);
// 	}
// 	if (isVerified) {
// 		this.otp.secret = null;
// 		if (isPhone) {
// 			this.phoneConfirmed = true;
// 		} else {
// 			this.emailConfirmed = true;
// 		}
// 	}
// 	await this.save();
// 	return isVerified;
// };
userSchema.set('toObject', {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.__v;
    delete ret.phone_validation;
    delete ret.email_validation;
    return ret;
  },
});
// hash of current pasword is same with incomiing
userSchema.methods.validPassword = function (password: string) {
  return hashPassword(password) === this.password;
};

// generate jwt
userSchema.methods.token = function (secret: IApplicationDocument['public_key']) {
  return jwt.sign(
    {
      _id: this.external,
      name: this.name,
      service: this.service,
      role: this.role,
      email: this.email,
      permissions: this.permissions,
      type: JWT_TYPE.USER,
    },
    secret,
  );
};

// userSchema.methods.confirmEmail = async function() {
// 	this.confirmed = true;
// 	this.emailConfirmationToken = null;
// 	await this.save();
// };

// userSchema.methods.restoreToken = async function() {
// 	this.passwordResetToken = crypto.randomBytes(16).toString("hex");
// 	await this.save();
// 	return this.passwordResetToken;
// };

userSchema.pre('save', async function (next: any) {
  if (this.isNew && this.password) {
    this.password = hashPassword(this.password);
  } else if (this.isModified('password')) {
    this.password = hashPassword(this.password);
  }
  next();
});

const UserModel: IUserModel<IUserDocument> = model<IUserDocument>(
  'User',
  userSchema,
) as IUserModel<IUserDocument>;

export default UserModel;
