import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import moment from 'moment';
import { MODELS, ORDER_TYPES } from '../../constants/main';
import { IPromotionDocument, IPromotionModel } from './promotions.types';
import { PROMOCODE_TYPE } from './promotions.constants';
import { IOrderDocument } from '../orders/orders.types';
import { PROMOTION_ERRORS } from './promotions.errors';

const branchRelationSchema: any = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: MODELS.BRANCH, required: true },
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
  deleted: { type: Boolean, required: true },
  external: { type: String, required: false, default: null },
});

export const promotionSchemaObject = {
  external: { type: String, default: null, required: false },
  // taxable: boolean;
  active: { type: Boolean, default: true, required: true },
  deleted: { type: Boolean, default: false, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },

  start_date: { type: Date, default: null, required: false },
  end_date: { type: Date, default: null, required: false },

  // start working each day in that time
  start_time: { type: Number, default: null, required: false },
  // end working each day in that time
  end_time: { type: Number, default: null, required: false },

  days_of_week: {
    type: [Number],
    enum: [1, 2, 3, 4, 5, 6, 7],
    required: false,
    default: [1, 2, 3, 4, 5, 6, 7],
  },

  discount: {
    discount_type: {
      type: Number,
      enum: [PROMOCODE_TYPE.BASE, PROMOCODE_TYPE.PERCENT],
      required: true,
    },
    amount: { type: Number, required: true },
    minimum_order_price: { type: Number, default: null, required: false },
    maximum_discount: { type: Number, default: null, required: false },
  },

  branches: {
    list: [branchRelationSchema],
    all: { type: Boolean, default: true, required: true },
  },
  categories: {
    list: [
      {
        _id: { type: Schema.Types.ObjectId, ref: MODELS.CATEGORY, required: true },
        name: { type: String, required: true },
      },
    ],
    all: { type: Boolean, default: true, required: true },
  },
  products: {
    list: [
      {
        _id: { type: Schema.Types.ObjectId, ref: MODELS.PRODUCT, required: true },
        name: { type: String, required: true },
      },
    ],
    all: { type: Boolean, default: true, required: true },
  },
  customers: {
    list: [
      {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
      },
    ],
    all: { type: Boolean, default: true, required: true },
  },

  usage: {
    maximum: { type: Number, default: null, required: false },
    // per_customer: number;
    current: { type: Number, default: 0, required: true },
  },

  order_types: {
    type: [Number],
    default: [
      ORDER_TYPES.CURBSIDE,
      ORDER_TYPES.DINE_IN,
      ORDER_TYPES.PICKUP,
      ORDER_TYPES.TO_GO,
      ORDER_TYPES.DELIVERY,
    ],
  },
};

export const promotionSchema: Schema<IPromotionDocument> = new Schema(promotionSchemaObject, {
  timestamps: true,
});

// const preparePromotion = async (promotion: IPromotionDocument) => {
//   await promotion.populate({
//     path: 'modifiers',
//     populate: {
//       path: 'options',
//       model: 'Option',
//     },
//   });
//   const _promotion: any = safeHydration(promotion);
//   _promotion.promotion = _promotion._id;
//   delete _promotion._id;
//   return _promotion;
// };

promotionSchema.methods.applyPromotionToOrder = async function (order: IOrderDocument) {
  const errors = [];

  // applied discounts should be replaced
  // let removeDiscounts = false;

  // is promotion applied for current order
  const applied: boolean = order.promotion && this._id.equals(order.promotion._id);

  // is promotion available for custoomer
  if (!this.customers.all || (order.customer && this.customers.list.includes(order.customer._id))) {
    errors.push(PROMOTION_ERRORS.NOT_AVAILABLE_FOR_CURRENT_CONSUMER);
  }
  // if order type is not available
  if (!this.order_types.includes(order.order_type)) {
    errors.push(PROMOTION_ERRORS.NOT_AVAILABLE_FOR_CURRENT_ORDER_TYPE);
  }
  // if branch is not selected for promocoode
  if (!this.branches.all || (order.branch && !this.branches.list.includes(order.branch._id))) {
    errors.push(PROMOTION_ERRORS.NOT_AVAILABLE_IN_BRANCH);
  }

  // Ignore next errors if promotion was applied already for this order
  if (!applied) {
    if (this.usage.maximum >= this.usage.current) {
      errors.push(PROMOTION_ERRORS.MAXIMUM_USAGE);
    }
    if (!this.active) {
      errors.push(PROMOTION_ERRORS.NOT_ACTIVE);
    }
    if (!this.delete) {
      errors.push(PROMOTION_ERRORS.DELETED);
    }
    // Is available in current day of week
    if (this.days_of_week && !this.days_of_week.includes(moment().day())) {
      errors.push(PROMOTION_ERRORS.NOT_AVAILABLE_TODAY);
    }
    // Is current day is after start
    if (this.start_date && moment().isBefore(moment(this.start_date))) {
      errors.push(PROMOTION_ERRORS.NOT_AVAILABLE);
    }
    // Is current day is before end
    if (this.end_date && moment().isAfter(moment(this.end_date))) {
      errors.push(PROMOTION_ERRORS.NOT_AVAILABLE);
    }
    // Is current time is after start time
    if (this.start_time && moment().isAfter(moment(this.start_time, 'HH'), 'hour')) {
      errors.push(PROMOTION_ERRORS.NOT_AVAILABLE);
    }
    // Is current time is before end time
    if (this.end_time && moment().isBefore(moment(this.end_time, 'HH'), 'hour')) {
      errors.push(PROMOTION_ERRORS.NOT_AVAILABLE);
    }
  }

  // if prmocode cant be applied
  // if (removeDiscounts) {
  //   // remove all discounts from products
  //   order.products = order.products.map((product: any) => ({
  //     ...product,
  //     price: {
  //       ...product.price,
  //       discounted_price: null,
  //     },
  //   }));
  // } else if (!errors.length) {
  //   // const maximum_discount = this.discount.maximum_discount;
  //   // let current_discount = 0;
  //   // const getPercentDiscount = (price: number) => price / 100 * this.discount.amount;
  //   // const getBaseDiscount = (price: number) => price / 100 * this.discount.amount;
  //   // const discount =
  //   // order.products = order.products.map((product) => ({
  //   //   ...product,
  //   //   price: {
  //   //     ...product.price,
  //   //     discounted_price: null,
  //   //   },
  //   // }));
  // }
};

promotionSchema.methods.onCreate = async (promotion: IPromotionDocument) => {
  // // Insert promotion in all branches
  // const _promotion = await preparePromotion(promotion);
  // const branches = await BranchModel.find();
  // const branch_promotions = branches.map((branch: IBranchDocument) => {
  //   return {
  //     ..._promotion,
  //     branch: branch._id,
  //   };
  // });
  // await BranchPromotionModel.collection.insertMany(branch_promotions);
};

promotionSchema.methods.onEdit = async (promotion: IPromotionDocument) => {
  // // Update promotion in all branches
  // const _promotion = await preparePromotion(promotion);
  // await BranchPromotionModel.updateMany({ promotion: promotion._id }, _promotion);
};

promotionSchema.methods.onDelete = async (promotion: IPromotionDocument) => {
  // Delete all promotions in branch
  // await BranchPromotionModel.deleteMany({ promotion: promotion._id });
};

promotionSchema.plugin(mongoosePaginate);

const PromotionModel: IPromotionModel<IPromotionDocument> = model<IPromotionDocument>(
  MODELS.PROMOTIN,
  promotionSchema,
) as IPromotionModel<IPromotionDocument>;

export default PromotionModel;
