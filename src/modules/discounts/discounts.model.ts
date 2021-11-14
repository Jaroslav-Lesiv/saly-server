import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import moment from 'moment';
import { MODELS, ORDER_TYPES } from '../../constants/main';
import { IDiscountDocument, IDiscountModel } from './discounts.types';
import { DISCOUNT_TYPE } from './discounts.constants';
import { IOrderDocument } from '../orders/orders.types';
import { DISCOUNT_ERRORS } from './discounts.errors';

const branchRelationSchema: any = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: MODELS.BRANCH, required: true },
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
  deleted: { type: Boolean, required: true },
  external: { type: String, required: false, default: null },
});

export const discountSchemaObject = {
  external: { type: String, default: null, required: false },
  // taxable: boolean;
  active: { type: Boolean, default: true, required: true },
  deleted: { type: Boolean, default: false, required: true },
  name: { type: String, required: true },

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
      enum: [DISCOUNT_TYPE.BASE, DISCOUNT_TYPE.PERCENT],
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

export const discountSchema: Schema<IDiscountDocument> = new Schema(discountSchemaObject, {
  timestamps: true,
});

// const prepareDiscount = async (discount: IDiscountDocument) => {
//   await discount.populate({
//     path: 'modifiers',
//     populate: {
//       path: 'options',
//       model: 'Option',
//     },
//   });
//   const _discount: any = safeHydration(discount);
//   _discount.discount = _discount._id;
//   delete _discount._id;
//   return _discount;
// };

discountSchema.methods.validateDiscountOnOrder = async function (order: IOrderDocument) {
  const errors = [];

  // applied discounts should be replaced
  // let removeDiscounts = false;

  // is discount applied for current order
  // const applied: boolean = order.discount && this._id.equals(order.discount._id);
  const applied: boolean = false;

  // is discount available for custoomer
  if (!this.customers.all || (order.customer && this.customers.list.includes(order.customer._id))) {
    errors.push(DISCOUNT_ERRORS.NOT_AVAILABLE_FOR_CURRENT_CONSUMER);
  }
  // if order type is not available
  if (!this.order_types.includes(order.order_type)) {
    errors.push(DISCOUNT_ERRORS.NOT_AVAILABLE_FOR_CURRENT_ORDER_TYPE);
  }
  // if branch is not selected for promocoode
  if (!this.branches.all || (order.branch && !this.branches.list.includes(order.branch._id))) {
    errors.push(DISCOUNT_ERRORS.NOT_AVAILABLE_IN_BRANCH);
  }

  // Ignore next errors if discount was applied already for this order
  if (!applied) {
    if (this.usage.maximum >= this.usage.current) {
      errors.push(DISCOUNT_ERRORS.MAXIMUM_USAGE);
    }
    if (!this.active) {
      errors.push(DISCOUNT_ERRORS.NOT_ACTIVE);
    }
    if (!this.delete) {
      errors.push(DISCOUNT_ERRORS.DELETED);
    }
    // Is available in current day of week
    if (this.days_of_week && !this.days_of_week.includes(moment().day())) {
      errors.push(DISCOUNT_ERRORS.NOT_AVAILABLE_TODAY);
    }
    // Is current day is after start
    if (this.start_date && moment().isBefore(moment(this.start_date))) {
      errors.push(DISCOUNT_ERRORS.NOT_AVAILABLE);
    }
    // Is current day is before end
    if (this.end_date && moment().isAfter(moment(this.end_date))) {
      errors.push(DISCOUNT_ERRORS.NOT_AVAILABLE);
    }
    // Is current time is after start time
    if (this.start_time && moment().isAfter(moment(this.start_time, 'HH'), 'hour')) {
      errors.push(DISCOUNT_ERRORS.NOT_AVAILABLE);
    }
    // Is current time is before end time
    if (this.end_time && moment().isBefore(moment(this.end_time, 'HH'), 'hour')) {
      errors.push(DISCOUNT_ERRORS.NOT_AVAILABLE);
    }
  }

  // if prmocode cant be applied
  // if (removeDiscounts) {
  //   // remove all discounts from products
  //   order.products = order.products.map((product) => ({
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

discountSchema.methods.onCreate = async (discount: IDiscountDocument) => {
  // // Insert discount in all branches
  // const _discount = await prepareDiscount(discount);
  // const branches = await BranchModel.find();
  // const branch_discounts = branches.map((branch: IBranchDocument) => {
  //   return {
  //     ..._discount,
  //     branch: branch._id,
  //   };
  // });
  // await BranchDiscountModel.collection.insertMany(branch_discounts);
};

discountSchema.methods.onEdit = async (discount: IDiscountDocument) => {
  // // Update discount in all branches
  // const _discount = await prepareDiscount(discount);
  // await BranchDiscountModel.updateMany({ discount: discount._id }, _discount);
};

discountSchema.methods.onDelete = async (discount: IDiscountDocument) => {
  // Delete all discounts in branch
  // await BranchDiscountModel.deleteMany({ discount: discount._id });
};

discountSchema.plugin(mongoosePaginate);

const DiscountModel: IDiscountModel<IDiscountDocument> = model<IDiscountDocument>(
  MODELS.DISCOUNT,
  discountSchema,
) as IDiscountModel<IDiscountDocument>;

export default DiscountModel;
