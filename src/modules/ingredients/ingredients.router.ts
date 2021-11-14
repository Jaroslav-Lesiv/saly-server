import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import IngredientController from './ingredients.controller';
import { IngredientBodyValidation } from './ingredients.validator';

export class IngredientRouter {
  public router: Router;
  protected ingredientsController: IngredientController;
  protected validator: any;

  constructor() {
    this.ingredientsController = new IngredientController();
    this.validator = createValidator({ passError: true });
    this.router = this.initRouter();
  }

  /**
   * Ingredient router
   */
  private initRouter(): Router {
    const router: Router = Router();

    router
      .get('/', this.ingredientsController.getIngredients)
      .get('/:id', this.ingredientsController.getIngredients)
      .post(
        '/',
        this.validator.body(IngredientBodyValidation),
        this.ingredientsController.createIngredient,
      )
      .put(
        '/:id',
        this.validator.body(IngredientBodyValidation),
        this.ingredientsController.updateIngredient,
      )
      .delete('/:id', this.ingredientsController.deleteIngredient);
    return router;
  }
}

export const ingredientRouter = new IngredientRouter();
