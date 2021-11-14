import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { MODELS, ORDER_TYPES, PAYMENT_TYPES } from '../../constants/main';
import { promotionSchemaObject } from '../promotions/promotions.model';
import { ORDER_PAYMENT_STATUS, ORDER_STATUS } from './orders.constants';
import { IOrderDocument, IOrderModel } from './orders.types';

// import { IProductDocument, IProductModel } from './orders.types';

export const orderSchema: any = new Schema(
  {
    deleted: { type: Boolean, default: false, required: true },
    external: { type: String, default: null, required: false },
    order_type: {
      type: Number,
      enum: [
        ORDER_TYPES.CURBSIDE,
        ORDER_TYPES.DELIVERY,
        ORDER_TYPES.DINE_IN,
        ORDER_TYPES.PICKUP,
        ORDER_TYPES.TO_GO,
      ],
      required: true,
    },
    order_status: {
      type: Number,
      enum: [
        ORDER_STATUS.DRAFT,
        ORDER_STATUS.CANCELLED,
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.IN_DELIVERY,
        ORDER_STATUS.PENDING,
        ORDER_STATUS.RETURNED,
        ORDER_STATUS.WAITING_FOR_DELIVERY,
        ORDER_STATUS.WAITING_FOR_PAYMENT,
        ORDER_STATUS.WAITING_FOR_PICKUP,
      ],
      default: ORDER_STATUS.DRAFT,
      required: true,
    },

    payment_type: {
      type: Number,
      enum: [
        PAYMENT_TYPES.CASH,
        PAYMENT_TYPES.ONLINE_PAYMENT,
        PAYMENT_TYPES.TERMINAL,
        PAYMENT_TYPES.WALLET,
      ],
      required: true,
    },
    payment_status: {
      type: Number,
      enum: [
        ORDER_PAYMENT_STATUS.PENDING,
        ORDER_PAYMENT_STATUS.WAITING_FOR_PAYMENT,
        ORDER_PAYMENT_STATUS.PAYMENT_CONFIRMATION,
        ORDER_PAYMENT_STATUS.PAID,
      ],
      default: ORDER_PAYMENT_STATUS.PENDING,
      required: true,
    },

    products: {
      type: [Object],
      default: []
    },

    branch: {
      type: {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
      },
      default: null,
      required: false,
    },
    // customer object here
    customer: {
      type: {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        email: { type: String, required: false },
        phone: { type: String, required: true },
      },
      default: null,
      required: false,
    },
    notes: { type: String, default: '', requred: false },
    channel: { type: String, default: '', requred: false },

    promotion: {
      type: promotionSchemaObject,
      default: null,
      required: false,
    },

    subtotal: { type: Number, requred: true },
    total: { type: Number, requred: true },
  },
  {
    timestamps: true,
  },
);

orderSchema.plugin(mongoosePaginate);

const OrderModel: IOrderModel<IOrderDocument> = model<IOrderDocument>(
  MODELS.ORDER,
  orderSchema,
) as IOrderModel<IOrderDocument>;

export default OrderModel;
