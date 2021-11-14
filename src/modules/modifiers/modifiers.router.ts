import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import ModifierController from './modifiers.controller';

export class ModifierRouter {
  public router: Router;
  protected modifierController: ModifierController;
  protected validator: any;

  constructor() {
    this.modifierController = new ModifierController();
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
        this.modifierController.getModifiers,
      )
      .get(
        '/:id',

        // authentication.authByJWTApplication,
        this.modifierController.getModifier,
      )
      // .get('/:id', authentication.authByJWTApplication, this.userController.getUser)
      .post(
        '/',
        // authentication.authByJWTApplication,
        // this.validator.body(CreateUserValidation),
        this.modifierController.createModifier,
      )
      .put(
        '/:id',
        // authentication.authByJWTApplication,
        // this.validator.body(UpdateUserValidation),
        this.modifierController.updateModifier,
      )
      .delete(
        '/:id',
        // authentication.authByJWTApplication,
        this.modifierController.deleteModifier,
      );
    return router;
  }
}

export const modifierRouter = new ModifierRouter();
