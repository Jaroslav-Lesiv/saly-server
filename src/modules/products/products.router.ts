import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import ProductController from './products.controller';

// import { CreateProductValidation, UpdateProductValidation } from './products.validator';

export class ProductRouter {
  public router: Router;
  protected productController: ProductController;
  protected validator: any;

  constructor() {
    this.productController = new ProductController();
    this.validator = createValidator({ passError: true });
    this.router = this.initRouter();
  }

  /**
   * Product router
   */
  private initRouter(): Router {
    const router: Router = Router();

    router
      .get(
        '/',
        // authentication.authByJWTApplication,
        this.productController.getProducts,
      )
      .get(
        '/:id',
        // authentication.authByJWTApplication,
        this.productController.getProduct,
      )
      .post(
        '/',
        // authentication.authByJWTApplication,
        // this.validator.body(CreateProductValidation),
        this.productController.createProduct,
      )
      .put(
        '/:id',
        // authentication.authByJWTApplication,
        // this.validator.body(UpdateProductValidation),
        this.productController.updateProduct,
      )
      .delete(
        '/:id',
        // authentication.authByJWTApplication,

        this.productController.deleteProduct,
      );
    return router;
  }
}

export const productRouter = new ProductRouter();
