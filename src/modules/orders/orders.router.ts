import { Router } from 'express';
import { createValidator } from 'express-joi-validation';
import OrderController from './orders.controller';
import { OrderCalculatorRequest } from './orders.validator';

// import { CreateProductValidation, UpdateProductValidation } from './products.validator';

export class OrdersRouter {
  public router: Router;
  protected orderController: OrderController;
  protected validator: any;

  constructor() {
    this.orderController = new OrderController();
    this.validator = createValidator({ passError: true });
    this.router = this.initRouter();
  }

  /**
   * Product router
   */
  private initRouter(): Router {
    const router: Router = Router();

    router
      // .get(
      //   '/',
      //   // authentication.authByJWTApplication,
      //   this.productController.getProducts,
      // )
      // .get(
      //   '/:id',
      //   // authentication.authByJWTApplication,
      //   this.productController.getProduct,
      // )
      .post(
        '/calculate',
        // authentication.authByJWTApplication,
        this.validator.body(OrderCalculatorRequest),
        this.orderController.calculate,
      )
      .post(
        '/',
        // authentication.authByJWTApplication,
        // this.validator.body(CreateProductValidation),
        this.orderController.createOrder,
      );
    // .put(
    //   '/:id',
    //   // authentication.authByJWTApplication,
    //   // this.validator.body(UpdateProductValidation),
    //   this.productController.updateProduct,
    // )
    // .delete(
    //   '/:id',
    //   // authentication.authByJWTApplication,

    //   this.productController.deleteProduct,
    // );
    return router;
  }
}

export const ordersRouter = new OrdersRouter();
