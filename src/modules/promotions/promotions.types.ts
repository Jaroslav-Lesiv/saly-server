import { Document, PaginateModel } from 'mongoose';

import { ORDER_TYPES } from '../../constants/main';
import { PROMOCODE_TYPE } from './promotions.constants';

export interface Promotion {
  _id: any;
  external: string | null;
  taxable: boolean;
  active: boolean;
  deleted: boolean;
  name: string;
  code: string;

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

export interface IPromotionDocument extends Promotion, Document {
  _id: any;

  onCreate: (promotion: IPromotionDocument) => void;
  onEdit: (promotion: IPromotionDocument) => void;
  onDelete: (promotion: IPromotionDocument) => void;
}

export interface IPromotionModel<T extends Document> extends PaginateModel<T> {}
