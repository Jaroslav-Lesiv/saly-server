import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import ConsumerController from './consumer.controller';
import { ConsumerCreateValidation, ConsumerEditValidation } from './consumer.validator';

export class ConsumerRouter {
  public router: Router;
  protected consumerController: ConsumerController;
  protected validator: any;

  constructor() {
    this.consumerController = new ConsumerController();
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
        this.consumerController.getConsumers,
      )
      .get(
        '/:id',
        // authentication.authByJWTApplication,
        this.consumerController.getConsumer,
      )
      .post(
        '/',
        // authentication.authByJWTApplication,
        this.validator.body(ConsumerCreateValidation),
        this.consumerController.createConsumer,
      )
      .put(
        '/:id',
        // authentication.authByJWTApplication,
        this.validator.body(ConsumerEditValidation),
        this.consumerController.updateConsumer,
      );
    // .delete(
    //   '/:id',
    //   // authentication.authByJWTApplication,
    //   this.userController.deleteUser,
    // );
    return router;
  }
}

export const consumerRouter = new ConsumerRouter();
