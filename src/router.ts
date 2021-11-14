import { Router } from 'express';

import { branchRouter } from './modules/branches/branches.router';
import { categoryRouter } from './modules/categories/categories.router';
import { comboRouter } from './modules/combo/combo.router';
import { consumerRouter } from './modules/consumers/consumer.router';
import { discountRouter } from './modules/discounts/discounts.router';
import { ingredientRouter } from './modules/ingredients/ingredients.router';
import { menuRouter } from './modules/menu/menu.router';
import { modifierRouter } from './modules/modifiers/modifiers.router';
import { optionRouter } from './modules/options/options.router';
import { ordersRouter } from './modules/orders/orders.router';
import { productRouter } from './modules/products/products.router';
import { promotionRouter } from './modules/promotions/promotions.router';
import { taxRouter } from './modules/taxes/taxes.router';

export class AppRouter {
  protected router: Router = Router();

  /**
   * Main app router
   */
  public getAppRouter(): Router {
    this.router.use('/ingredients', ingredientRouter.router);
    this.router.use('/promotions', promotionRouter.router);
    this.router.use('/discounts', discountRouter.router);
    this.router.use('/consumers', consumerRouter.router);
    this.router.use('/options', optionRouter.router);
    this.router.use('/modifiers', modifierRouter.router);
    this.router.use('/products', productRouter.router);
    this.router.use('/branches', branchRouter.router);
    this.router.use('/categories', categoryRouter.router);
    this.router.use('/combos', comboRouter.router);
    this.router.use('/orders', ordersRouter.router);
    this.router.use('/taxes', taxRouter.router);
    this.router.use('/menu', menuRouter.router);

    return this.router;
  }
}
