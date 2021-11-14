import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import DiscountController from './discounts.controller';

// import { CreateDiscountValidation, UpdateDiscountValidation } from './discounts.validator';

export class DiscountRouter {
  public router: Router;
  protected discountController: DiscountController;
  protected validator: any;

  constructor() {
    this.discountController = new DiscountController();
    this.validator = createValidator({ passError: true });
    this.router = this.initRouter();
  }

  /**
   * Discount router
   */
  private initRouter(): Router {
    const router: Router = Router();

    router
      .get(
        '/',
        // authentication.authByJWTApplication,
        this.discountController.getDiscounts,
      )
      .get(
        '/:id',
        // authentication.authByJWTApplication,
        this.discountController.getDiscount,
      )
      .post(
        '/',
        // authentication.authByJWTApplication,
        // this.validator.body(CreateDiscountValidation),
        this.discountController.createDiscount,
      )
      .put(
        '/:id',
        // authentication.authByJWTApplication,
        // this.validator.body(UpdateDiscountValidation),
        this.discountController.updateDiscount,
      )
      .delete(
        '/:id',
        // authentication.authByJWTApplication,

        this.discountController.deleteDiscount,
      );
    return router;
  }
}

export const discountRouter = new DiscountRouter();
