import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import authentication from '../../services/auth';
import UserController from './products.controller';
import { CreateUserValidation, UpdateUserValidation } from './products.validator';

export class UserRouter {
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
      .get('/', authentication.authByJWTApplication, this.userController.getUsers)
      .get('/:id', authentication.authByJWTApplication, this.userController.getUser)
      .post(
        '/',
        authentication.authByJWTApplication,
        this.validator.body(CreateUserValidation),
        this.userController.createUser,
      )
      .put(
        '/:id',
        authentication.authByJWTApplication,
        this.validator.body(UpdateUserValidation),
        this.userController.updateUser,
      )
      .delete('/:id', authentication.authByJWTApplication, this.userController.deleteUser);
    return router;
  }
}

export const userRouter = new UserRouter();
