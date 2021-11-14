import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import PromotionController from './promotions.controller';

// import { CreatePromotionValidation, UpdatePromotionValidation } from './promotions.validator';

export class PromotionRouter {
  public router: Router;
  protected promotionController: PromotionController;
  protected validator: any;

  constructor() {
    this.promotionController = new PromotionController();
    this.validator = createValidator({ passError: true });
    this.router = this.initRouter();
  }

  /**
   * Promotion router
   */
  private initRouter(): Router {
    const router: Router = Router();

    router
      .get(
        '/',
        // authentication.authByJWTApplication,
        this.promotionController.getPromotions,
      )
      .get(
        '/:id',
        // authentication.authByJWTApplication,
        this.promotionController.getPromotion,
      )
      .post(
        '/',
        // authentication.authByJWTApplication,
        // this.validator.body(CreatePromotionValidation),
        this.promotionController.createPromotion,
      )
      .put(
        '/:id',
        // authentication.authByJWTApplication,
        // this.validator.body(UpdatePromotionValidation),
        this.promotionController.updatePromotion,
      )
      .delete(
        '/:id',
        // authentication.authByJWTApplication,

        this.promotionController.deletePromotion,
      );
    return router;
  }
}

export const promotionRouter = new PromotionRouter();
