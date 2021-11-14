import { Router } from 'express';
import { createValidator } from 'express-joi-validation';
import TaxController from './taxes.controller';
import { TaxBodyValidation } from './taxes.validator';

export class TaxRouter {
  public router: Router;
  protected branchController: TaxController;

  protected validator: any;

  constructor() {
    this.branchController = new TaxController();
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
        this.branchController.getTax,
      )
      .post(
        '/',
        // authentication.authByJWTApplication,
        this.validator.body(TaxBodyValidation),
        this.branchController.createTax,
      )
      .put(
        '/:id',
        // authentication.authByJWTApplication,
        this.validator.body(TaxBodyValidation),
        this.branchController.updateTax,
      )

      .delete(
        '/:id',
        // authentication.authByJWTApplication,

        this.branchController.deleteTax,
      );
    return router;
  }
}

export const taxRouter = new TaxRouter();
