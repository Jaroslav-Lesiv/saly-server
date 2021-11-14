import { Document, PaginateModel } from 'mongoose';
import { ORDER_TYPES, PAYMENT_TYPES } from '../../constants/main';
import { IngredientRelation } from '../ingredients/ingredients.types';
import { Modifier } from '../modifiers/modifiers.types';
import { Option } from '../options/options.types';
import { Product } from '../products/products.types';
// import { Product } from '../products/products.types';
import { Promotion } from '../promotions/promotions.types';
import { ORDER_PAYMENT_STATUS, ORDER_STATUS } from './orders.constants';
//////// REQUEST ORDER
export interface RequestProduct {
  _id: string;
  quantity: number;
  // ingredients:
  modifiers: {
    _id: string;
    options: {
      _id: string;
      quantity: number;
    }[];
  }[];
  notes: string;
}

export interface RequestOrder {
  products: RequestProduct[];
  branch_id?: string;
  promotion?: string;
  discount?: string;
}

/////////
export interface OrderIngredient extends IngredientRelation {
  quantity: number;
  errors: string[];
  blocked: boolean;
}
export interface OrderOption extends Option {
  quantity: number;
  ingredients: OrderIngredient[];
  errors: string[];
  blocked: boolean;
}

export interface OrderModifier extends Modifier<OrderOption> {
  errors: string[];
  blocked: boolean;
}

export interface OrderProduct extends Product {
}

export interface Order {
  external: string | null;
  deleted: boolean;
  order_type: ORDER_TYPES;
  order_status: ORDER_STATUS;

  payment_type: PAYMENT_TYPES;
  payment_status: ORDER_PAYMENT_STATUS;

  // products: OrderProduct[];
  // branch object here
  branch: null | {
    _id: any;
    name: string;
  };
  // customer object here
  customer: null | {
    _id: any;
    name: string;
    email: string | null;
    phone: string | null;
  };
  notes: string;
  channel: string;

  // promocode object here
  promotion: null | Promotion;

  subtotal: number;
  total: number;
}

export interface IOrderDocument extends Order, Document {
  onCreate: (product: IOrderDocument) => void;
  onEdit: (product: IOrderDocument) => void;
  onDelete: (product: IOrderDocument) => void;
}

export interface IOrderModel<T extends Document> extends PaginateModel<T> {}
