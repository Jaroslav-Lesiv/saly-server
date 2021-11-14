import { flatten } from 'flat';
import fs from 'fs';
import md5 from 'md5';
import { Document, PaginateOptions, PaginateResult } from 'mongoose';
import { authenticator } from 'otplib';

const otpLife = Number(process.env.OTP_LIFE);
authenticator.options = { step: otpLife && !isNaN(otpLife) ? otpLife : 1800, digits: 4 };

const allowedFieldsForSearch = ['name', 'title', 'customer', 'description', 'brand', 'location'];

class OTP {
  secret: string = process.env.JWT_SECRET || 'secret';

  generate(): [string, string] {
    const secret = md5(Date.now() + this.secret);
    return [authenticator.generate(secret), secret];
  }

  validate(token: string, secret: string) {
    return authenticator.check(token, secret);
  }
}

export const otpService = new OTP();

export const buildGeoNearQuery = (_query: any) => {
  let defaultQuery: any = { maxDistance: 90000 };
  return Object.entries(_query).reduce((query, [key, value]: [string, any]) => {
    query[key] = value;
    switch (key) {
      case 'coordinates':
        query['coordinates'] = value.split(',').map(Number);
      case 'maxDistance':
        query['maxDistance'] = Number(value);
      // case 'coordinates':
      //     query['coordinates'] = value.split(',')
      default:
        break;
    }
    return { ...query };
  }, defaultQuery);
};

export const buildQuery = (_query: any, allowed: string[] = allowedFieldsForSearch): [any, any] => {
  const searchQuery = Object.entries(_query).reduce((query: any, [key, value]: [string, any]) => {
    if (!key || !value) return query;
    if (allowed.includes(key)) {
      let _value: any = '';
      switch (key) {
        case 'brand':
        case 'location':
        case 'customer':
          _value = value;
          break;
        case 'name':
        case 'title':
        case 'description':
        case 'user.phone':
        case 'user.name':
        case 'worker.phone':
        case 'worker.name':
          _value = { $regex: value, $options: 'i' };
          break;
        case 'createdAt':
          if (typeof value !== 'string') return;
          if (!_value) _value = {};
          value = JSON.parse(value);
          if (value && value.start) _value['$gte'] = value.start;
          if (value && value.end) _value['$lte'] = value.end;
          break;
        // case 'location':
        //     _value = {
        //         location: {
        //             $near: {
        //                 $geometry: {
        //                     type: "Point",
        //                     coordinates: value.split(','), "$options": "i"
        //                 }
        //             }
        //         }
        //     };
        //     break;

        default:
          _value = value;
          break;
      }
      return {
        ...query,
        [key]: _value,
      };
    }
    return query;
  }, {});
  const pagination = {
    page: _query.page || 1,
  };
  console.log({ _query, searchQuery });
  return [searchQuery, pagination];
};

export const ensureDirExist = (path: string, shouldCreate = true) => {
  const exist = fs.existsSync(path);
  if (!exist && shouldCreate) {
    fs.mkdirSync(path, { recursive: true });
  }
};
export const isProd = !process.env.IS_DEVELOPMENT;
// export const isProd = true

export const RError = (message: string, errors?: {}) => {
  return {
    message,
    errors,
  };
};

export const delay = (ms = 1000, success: boolean = true) =>
  new Promise((res, rej) => setTimeout(() => (success ? res(ms) : rej(ms)), ms));

export const hashPassword = (password: string) => md5(password);

export const flat = (_document: any) => flatten(_document);

export const paginator = ({ page = 1, limit = 10, ...query }: { [key: string]: any }) => {
  const pagination: PaginateOptions = {
    page: page,
    limit: limit,
  };
  return { pagination, query };
};

// function safeHydration<T extends Document>(model: T) {
//   return model.toObject()
// }

// export {
//   safeHydration
// }

export const safeHydration = <T extends Document>(model: T) => model.toObject();

export const safeHydrationDocs = <T extends Document>(result: PaginateResult<T>) => ({
  ...result,
  docs: result.docs.map((doc) => doc.toObject()),
});

export const isNumber = (value: any) =>
  typeof value === 'number' && !isNaN(value) && value !== null;

export const roundPrice = (price: number) => Math.round((price + Number.EPSILON) * 100) / 100;

export const reducePercent = (total: number, percent: number) =>
  roundPrice(0.01 * (100 - percent) * total);

export const getPercentAmount = (total: number, percent: number) =>
  roundPrice((total / 100) * percent);

export class ErrorObject {
  private data: any = {};
  public count: number = 0;
  public blocked: boolean = false;

  public addError = (error: string, paths: string[], blocked?: boolean) => {
    let ref = this.data;
    for (const path of paths) {
      if (!ref[path]) ref[path] = {};
      ref = ref[path];
    }
    if (!ref['errors']) ref['errors'] = [];
    ref['errors'].push(error);
    this.count += 1;
    if (blocked) this.blocked = true;
  };

  public get result() {
    return this.data;
  }
}
