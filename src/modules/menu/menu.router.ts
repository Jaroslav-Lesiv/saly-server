import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import MenuController from './menu.controller';

// import { CreateProductValidation, UpdateProductValidation } from './products.validator';

export class MenuRouter {
  public router: Router;
  protected menuController: MenuController;
  protected validator: any;

  constructor() {
    this.menuController = new MenuController();
    this.validator = createValidator({ passError: true });
    this.router = this.initRouter();
  }

  /**
   * Product router
   */
  private initRouter(): Router {
    const router: Router = Router();

    router.get(
      '/',
      // authentication.authByJWTApplication,
      this.menuController.getMenu,
    );

    return router;
  }
}

export const menuRouter = new MenuRouter();
