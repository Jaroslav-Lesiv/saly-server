import { STOCK_STATUS } from '../../constants/main';
import { IDiscountDocument } from '../../modules/discounts/discounts.types';
import { OrderProduct, RequestOrder } from '../../modules/orders/orders.types';
import { PRODUCT_ERRORS } from '../../modules/products/products.errors';
import { IProductDocument } from '../../modules/products/products.types';
import { IPromotionDocument } from '../../modules/promotions/promotions.types';
import { ErrorObject } from '../../utils';

interface IProps {
  branch_id: string | null;
  request_products: RequestOrder['products'];
  real_products: IProductDocument[];
  products: OrderProduct[];
  discount: IDiscountDocument | null;
  promotion: IPromotionDocument | null;
}

export class OrderValidator {
  private errors = new ErrorObject();

  private request_products: RequestOrder['products'] = [];
  private real_products: IProductDocument[] = [];
  private products: OrderProduct[] = [];

  private existing_products: OrderProduct[] = [];

  private branch_id: string | null = null;

  private discount: IDiscountDocument | null = null;
  private promotion: IPromotionDocument | null = null;

  constructor(props: IProps) {
    this.branch_id = props.branch_id;
    this.products = props.products;
    this.discount = props.discount;
    this.promotion = props.promotion;
    this.real_products = props.real_products;
    this.request_products = props.request_products;
  }
  log = () => {
    console.log(this.branch_id, this.promotion, this.discount);
  };

  validateRequestProducts = () => {
    let existing_products: any = [];
    this.request_products.forEach((request_product) => {
      const _product = this.real_products.find((_p) => _p._id.equals(request_product._id));
      if (!_product) {
        this.errors.addError(PRODUCT_ERRORS.NOT_AVAILABLE, ['products', request_product._id]);
        return;
      }

      if (
        !_product.branches.all &&
        _product.branches.list.some((branch) => branch._id.equals(this.branch_id))
      ) {
        this.errors.addError(PRODUCT_ERRORS.NOT_AVAILABLE_IN_BRANCH, [
          'products',
          request_product._id,
        ]);
        return;
      }

      if (_product.in_stock === STOCK_STATUS.OUT_OF_STOCK) {
        this.errors.addError(PRODUCT_ERRORS.OUT_OF_STOCK, ['products', request_product._id]);
        return;
      }

      // let existing_modifiers: any = [];
      // request_product.modifiers.forEach((modifier) => {
      //   const _modifier = _product.modifiers.find((_m) => _m._id.equals(modifier._id));
      //   if (!_modifier) {
      //     this.errors.addError(MODIFIERS_ERRORS.NOT_AVAILABLE, [
      //       'products',
      //       request_product._id,
      //       'modifiers',
      //       modifier._id,
      //     ]);
      //     return;
      //   }

      //   if (
      //     !_modifier.branches.all &&
      //     _modifier.branches.list.some((branch) => branch._id.equals(this.branch_id))
      //   ) {
      //     this.errors.addError(MODIFIERS_ERRORS.NOT_AVAILABLE_IN_BRANCH, [
      //       'products',
      //       request_product._id,
      //       'modifiers',
      //       modifier._id,
      //     ]);
      //     return;
      //   }

      //   let existing_options: any = [];
      //   // modifier.options.forEach((option) => {
      //   //   const _option = _modifier.options.find((_o) => _o._id.equals(option._id));
      //   //   if (!_option) {
      //   //     this.errors.addError(OPTION_ERRORS.NOT_AVAILABLE, [
      //   //       'products',
      //   //       request_product._id,
      //   //       'modifiers',
      //   //       modifier._id,
      //   //       'options',
      //   //       option._id,
      //   //     ]);
      //   //     return;
      //   //   }

      //   //   // @ts-ignore
      //   //   existing_options.push({ ..._option.toObject(), quantity: option.quantity });

      //   //   // let messages = [];
      //   //   // if (_option.max_quantity && option.quantity > _option.max_quantity) {
      //   //   //   messages.push(OPTION_ERRORS.MAX_QUANTITY);
      //   //   // }
      //   //   // if (_option.min_quantity && option.quantity < _option.min_quantity) {
      //   //   //   messages.push(OPTION_ERRORS.MIN_QUANTITY);
      //   //   // }
      //   //   if (_option.in_stock === STOCK_STATUS.OUT_OF_STOCK) {
      //   //     this.errors.addError(OPTION_ERRORS.OUT_OF_STOCK, ['products', request_product._id]);
      //   //     return;
      //   //   }
      //   //   // if (messages.length) {
      //   //   //   messages.forEach((message) =>
      //   //   //     this.errors.addError(message, [
      //   //   //       'products',
      //   //   //       request_product._id,
      //   //   //       'modifiers',
      //   //   //       modifier._id,
      //   //   //       'options',
      //   //   //       option._id,
      //   //   //     ]),
      //   //   //   );
      //   //   // }
      //   // });

      //   // @ts-ignore
      //   existing_modifiers.push({ ..._modifier.toObject(), options: existing_options });
      // });
      // existing_products.push({
      //   ..._product.toObject(),
      //   quantity: request_product.quantity,
      //   modifiers: existing_modifiers,
      //   notes: request_product.notes,
      // });
    });

    this.existing_products = existing_products;
  };

  public get result() {
    return {
      errors: this.errors.result,
      products: this.products,
      existing_products: this.existing_products,
    };
  }
}
