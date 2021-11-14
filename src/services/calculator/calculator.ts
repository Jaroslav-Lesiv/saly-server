import { DISCOUNT_TYPE } from '../../modules/discounts/discounts.constants';
import { IDiscountDocument } from '../../modules/discounts/discounts.types';
import { OrderProduct } from '../../modules/orders/orders.types';
import { PROMOCODE_TYPE } from '../../modules/promotions/promotions.constants';
import { IPromotionDocument } from '../../modules/promotions/promotions.types';
import { getPercentAmount } from '../../utils';

interface IProps {
  products: OrderProduct[];
  // combos: OrderProduct[];
  discount: IDiscountDocument | null;
  promotion: IPromotionDocument | null;

  branch_id: null | string;
}

export class Calculator {
  private total: number = 0;
  private subtotal: number = 0;
  private discount_amount: number = 0;
  private promotion_amount: number = 0;
  private branch_id: null | string = null;
  private products: OrderProduct[] = [];
  private discount: IDiscountDocument | null = null;
  private promotion: IPromotionDocument | null = null;

  constructor(props: IProps) {
    this.products = props.products;
    this.discount = props.discount;
    this.promotion = props.promotion;
    this.branch_id = props.branch_id;
  }
  // TODO: remove this
  public log = () => {
    console.log(this.promotion, this.discount, this.result);
  };

  // private getActualOptionPrice = (product: OrderOption): number => {
  //   if (product.price.calculated) {
  //     return product.ingredients.reduce(
  //       (sum, ingredient) => sum + ingredient.price * ingredient.quantity,
  //       0,
  //     );
  //   }
  //   return product.price.sale_price || product.price.regular_price;
  // };

  private getActualProductPrice = (product: OrderProduct): number => {
    let price = 0;
    // Get initial product price
    // if (product.price.calculated) {
    //   price = product.ingredients.reduce(
    //     (sum, ingredient) => sum + ingredient.price * ingredient.quantity,
    //     0,
    //   );
    // } else {
    //   price = product.price.sale_price || product.price.regular_price;
    // }
    // // Get additional product price based on modifiers
    // product.modifiers.forEach((modifier) => {
    //   modifier.options.forEach((option) => {
    //     const optionPrice = this.getActualOptionPrice(option);
    //     price += optionPrice * option.quantity;
    //   });
    // });
    return price;
  };

  calculateProductPrices = () => {
    this.products = this.products.map((product) => ({
      ...product,
      price: {
        ...product.price,
        actual_price: this.getActualProductPrice(product),
      },
    }));
  };

  calculateSubtotal = () => {
    // console.log(this.products.map(p => [p.price.actual_price, p.quantity]))
    // const subtotal = this.products.reduce(
    //   // TODO: IMPORTANT REMOVE ZERO !!!!!!!
    //   (sum, product) => (sum += (product.price.actual_price || 0) * product.quantity),
    //   0,
    // );
    // console.log({subtotal})
    // this.total = subtotal;
    // this.subtotal = subtotal;
  };

  calculateDiscount = () => {
    if (!this.discount) return;

    if (this.discount.products) {
    
    }

    if (this.discount.discount.discount_type === DISCOUNT_TYPE.PERCENT) {
      const amount = getPercentAmount(this.total, this.discount.discount.amount);
      this.discount_amount = amount;

      this.total = this.total - amount;
    } else if (this.discount.discount.discount_type === DISCOUNT_TYPE.BASE) {
      this.discount_amount = this.discount.discount.amount;
      this.total = this.total - this.discount.discount.amount;
    }
  };

  calculatePromotion = () => {
    // if promoton not was applied
    if (!this.promotion) return;
    // if promotion not available in the branch
    if (
      !this.promotion.branches.all &&
      !this.promotion.branches.list.some((branch) => branch._id.equals(this.branch_id))
    )
      return;

    if (this.promotion.discount.discount_type === PROMOCODE_TYPE.PERCENT) {
      const amount = getPercentAmount(this.total, this.promotion.discount.amount);
      this.promotion_amount = amount;

      this.total = this.total - amount;
    } else if (this.promotion.discount.discount_type === PROMOCODE_TYPE.BASE) {
      this.promotion_amount = this.promotion.discount.amount;
      this.total = this.total - this.promotion.discount.amount;
    }
  };

  public get result() {
    return {
      products: this.products,
      discount_amount: this.discount_amount,
      promotion_amount: this.promotion_amount,
      subtotal: this.subtotal,
      total: this.total,
    };
  }
}
