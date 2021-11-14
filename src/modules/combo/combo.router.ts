import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import ComboController from './combo.controller';

// import { CreateBranchValidation, UpdateBranchValidation } from './branchs.validator';

export class ComboRouter {
  public router: Router;
  protected branchController: ComboController;

  protected validator: any;

  constructor() {
    this.branchController = new ComboController();
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
        this.branchController.getCombo,
      )
      .post(
        '/',
        // authentication.authByJWTApplication,
        // this.validator.body(CreateBranchValidation),
        this.branchController.createCombo,
      )
      .put(
        '/:id',
        // authentication.authByJWTApplication,
        // this.validator.body(UpdateBranchValidation),
        this.branchController.updateCombo,
      )

      .delete(
        '/:id',
        // authentication.authByJWTApplication,

        this.branchController.deleteCombo,
      );
    return router;
  }
}

export const comboRouter = new ComboRouter();
