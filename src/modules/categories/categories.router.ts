import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import CategoryController from './categories.controller';
import { CategoryBodyValidation } from './categories.validator';

export class CategoryRouter {
  public router: Router;
  protected branchController: CategoryController;

  protected validator: any;

  constructor() {
    this.branchController = new CategoryController();
    this.validator = createValidator({ passError: true });
    this.router = this.initRouter();
  }

  /**
   * Branch router
   */
  private initRouter(): Router {
    const router: Router = Router();

    router
      .get(
        '/',
        // authentication.authByJWTApplication,
        this.branchController.getCategories,
      )
      .get(
        '/:id',
        // authentication.authByJWTApplication,
        this.branchController.getCategory,
      )
      .post(
        '/',
        // authentication.authByJWTApplication,
        this.validator.body(CategoryBodyValidation),
        this.branchController.createCategory,
      )
      .put(
        '/:id',
        // authentication.authByJWTApplication,
        this.validator.body(CategoryBodyValidation),
        this.branchController.updateCategory,
      )

      .delete(
        '/:id',
        // authentication.authByJWTApplication,

        this.branchController.deleteCategory,
      );
    return router;
  }
}

export const categoryRouter = new CategoryRouter();
