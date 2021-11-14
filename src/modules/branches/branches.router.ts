import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import BranchController from './branches.controller';
import { BranchBodyValidation } from './branches.validator';

export class BranchRouter {
  public router: Router;
  protected branchController: BranchController;

  protected validator: any;

  constructor() {
    this.branchController = new BranchController();
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
        this.branchController.getBranchs,
      )
      .get(
        '/:id',
        // authentication.authByJWTApplication,
        this.branchController.getBranch,
      )
      .post(
        '/',
        // authentication.authByJWTApplication,
        this.validator.body(BranchBodyValidation),
        this.branchController.createBranch,
      )
      .put(
        '/:id',
        // authentication.authByJWTApplication,
        this.validator.body(BranchBodyValidation),
        this.branchController.updateBranch,
      )

      .delete(
        '/:id',
        // authentication.authByJWTApplication,

        this.branchController.deleteBranch,
      );

    return router;
  }
}

export const branchRouter = new BranchRouter();
