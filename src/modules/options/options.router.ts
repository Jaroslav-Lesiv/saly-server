import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

// import authentication from '../../services/auth';
import UserController from './options.controller';
import { OptionsBodyValidation } from './options.validator';
// import { CreateUserValidation, UpdateUserValidation } from './products.validator';

export class OptionRouter {
  public router: Router;
  protected userController: UserController;
  protected validator: any;

  constructor() {
    this.userController = new UserController();
    this.validator = createValidator({ passError: true });
    this.router = this.initRouter();
  }

  /**
   * User router
   */
  private initRouter(): Router {
    const router: Router = Router();

    router
      .get(
        '/',
        // authentication.authByJWTApplication,
        this.userController.getOptions,
      )
      .get(
        '/:id',
        //  authentication.authByJWTApplication,
        this.userController.getOption,
      )
      .post(
        '/',
        // authentication.authByJWTApplication,
        this.validator.body(OptionsBodyValidation),
        this.userController.createOption,
      )
      .put(
        '/:id',
        // authentication.authByJWTApplication,
        this.validator.body(OptionsBodyValidation),
        this.userController.updateOption,
      )
      .delete(
        '/:id',
        //  authentication.authByJWTApplication,
        this.userController.deleteOption,
      );
    return router;
  }
}

export const optionRouter = new OptionRouter();
