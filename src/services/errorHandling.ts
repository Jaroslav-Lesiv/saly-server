import { Request, Response, NextFunction } from 'express-serve-static-core';


export interface IErrorResponse {
  status: number;
  message: string;
  errors: any;
  url?: string;
  stack?: string;
  type?: string;
  code?: string;
}


const handleJoiErrors = (errors: any) => {
  if (!errors || !errors.error || !errors.error.details) return null

  return errors.error.details.reduce((_errors: any, error: any) => {
    if (error.type && error.context) {
      return {
        ..._errors, [error.context.key]: error.type
      }
    }
    return _errors
  }, {})
}
export class ErrorHandling {
  public static routeNotFound(req: Request, res: Response): Response {
    return res.status(404).send({
      status: 404,
      message: 'Route not found',
      url: req.url,
    });
  }

  // public static dev(err: any, req: Request, res: Response, next: NextFunction): Response {
  //   const isValidatorError = err && err.error && err.error.isJoi;
  //   if (isValidatorError) return this.handleValidatorErrors(err, req, res, next);

  //   const errorName = err && err.name && err.name
  //   if (errorName === 'ValidationError') return this.handleMongoValidatorErrors(err, req, res, next);
  //   if (errorName === 'MongoError') return this.handleMongoErrors(err, req, res, next);

  //   const host = req.get('host');
  //   const url = req.protocol + '://' + host + req.url;
  //   const status = err.status || 500;
  //   const errMsg = {
  //     status: !err.status && err.message ? 400 : status,
  //     stack: err.stack,
  //     code: err.code || (err.err && err.err.errorIdentifier),
  //     message: err.message || err.err.message,
  //     type: err.type,
  //     url,
  //   };

  //   return res.status(errMsg.status).json(errMsg);
  // }

  public static prod(err: any, req: Request, res: Response, next: NextFunction): Response {
    const isValidatorError = err && err.error && err.error.isJoi;
    if (isValidatorError) return this.handleValidatorErrors(err, req, res, next);
    const isMongo = err && err.name && err.name === 'ValidationError'
    if (isMongo) return this.handleMongoValidatorErrors(err, req, res, next);
    const status = err.status || 500;
    const errMsg = {
      status: !err.status && err.message ? 400 : status,
      code: err.code || (err.err && err.err.errorIdentifier),
      message: err.err ?  err.err.message : (err.message || err),
      type: err.type,
    };
    return res.status(errMsg.status).json(errMsg);
  }

  public static handleValidatorErrors(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response {
    const errMsg: IErrorResponse = {
      status: 400,
      type: err.type,
      message: `${err.type} params validation error`,
      errors: handleJoiErrors(err),
    };

    if (err && err.code) {
      errMsg.code = err.code;
    }

    return res.status(errMsg.status).json(errMsg);
  }

  public static handleMongoValidatorErrors(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response {

    const errMsg: IErrorResponse = {
      status: 400,
      type: err.name,
      message: err.name,
      errors: err.errors && Object.entries(err.errors).reduce((errors: any, [key, error]: [string, any]) => {
        return { ...errors, [key]: error.message };
      }, {}),
    };


    if (err && err.code) {
      errMsg.code = err.code;
    }

    return res.status(errMsg.status).json(errMsg);
  }

  public static handleMongoErrors(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response {
    const errMsg: IErrorResponse = {
      status: 400,
      code: err.code,
      errors: {},
      message: err.code === 11000 ? 'User already exist' : '',
    };


    if (err && err.code) {
      errMsg.code = err.code;
    }

    return res.status(errMsg.status).json(errMsg);
  }

 
}


export const errorCreator = (message = '', status = 500, errors?: any) => ({
  message,
  status,
  errors
});

export const successCreator = (fields = {}, status = 200) => ({
  status,
  ...fields
});