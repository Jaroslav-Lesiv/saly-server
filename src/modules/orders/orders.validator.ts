import Joi from 'joi';

import { ORDER_TYPES, PAYMENT_TYPES } from '../../constants/main';

export const OrderOptions = Joi.object({
  _id: Joi.string().required(),
  quantity: Joi.number().required().min(1),
});

export const OrderModifier = Joi.object({
  _id: Joi.string().required(),
  options: Joi.array().items(OrderOptions),
});

export const OrderProduct = Joi.object({
  _id: Joi.string().required(),
  quantity: Joi.number().required().min(1),
  modifiers: Joi.array().items(OrderModifier),
  notes: Joi.string(),
});

export const OrderCalculatorRequest = Joi.object({
  branch_id: Joi.string().required(),
  promotion: Joi.string().required(),
  discount: Joi.string().required(),
  products: Joi.array().items(OrderProduct),
  payment_type: Joi.number().allow(
    PAYMENT_TYPES.CASH,
    PAYMENT_TYPES.WALLET,
    PAYMENT_TYPES.ONLINE_PAYMENT,
    PAYMENT_TYPES.TERMINAL,
  ),
  delivery_type: Joi.number().allow(
    ORDER_TYPES.DINE_IN,
    ORDER_TYPES.PICKUP,
    ORDER_TYPES.TO_GO,
    ORDER_TYPES.CURBSIDE,
    ORDER_TYPES.DELIVERY,
  ),
  notes: Joi.string(),
});
