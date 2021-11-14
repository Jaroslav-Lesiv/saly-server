import { Document, PaginateModel } from 'mongoose';

import { ORDER_TYPES } from '../../constants/main';
import { IOrderDocument } from '../orders/orders.types';
import { PROMOCODE_TYPE } from './discounts.constants';

export interface Discount {
  _id: any;
  external: string | null;
  taxable: boolean;
  active: boolean;
  deleted: boolean;
  name: string;

  start_date: Date | null;
  end_date: Date | null;

  // start working each day in that time
  start_time: number | null;
  // end working each day in that time
  end_time: number | null;

  days_of_week: number[];

  discount: {
    discount_type: PROMOCODE_TYPE;
    amount: number;
    minimum_order_price: number;
    maximum_discount: number;
  };

  branches: {
    list: {
      _id: any;
      name: string;
      active: string;
      deleted: string;
      external: string;
    }[];
    all: boolean;
  };
  categories: {
    list: {
      _id: any;
      name: string;
    }[];
    all: boolean;
  };
  products: {
    list: {
      _id: any;
      name: string;
    }[];
    all: boolean;
  };
  customers: {
    list: {
      _id: any;
      name: string;
    }[];
    all: boolean;
  };

  usage: {
    maximum: number;
    current: number;
  };

  order_types: ORDER_TYPES[];
}

export interface IDiscountDocument extends Discount, Document {
  _id: any;

  validateDiscountOnOrder: (order: IOrderDocument) => void;
  onEdit: (discount: IDiscountDocument) => void;
  onDelete: (discount: IDiscountDocument) => void;
}

export interface IDiscountModel<T extends Document> extends PaginateModel<T> {}
