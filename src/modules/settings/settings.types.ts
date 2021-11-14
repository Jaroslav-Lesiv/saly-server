import { Document, PaginateModel } from 'mongoose';

export interface Settings {
  tax: {
    enabled: boolean;
    percent: number;
    apply_for_all: boolean;
  };
  payment_types: [
    {
      is_default: boolean;
      name: string;
    },
  ];
  currency: string;
  business_name: string;
  timezone: string;
  receipt: {
    imgage: string;
    header: string;
    footer: string;
    display_order_number: boolean;
    display_receipt_number: boolean;
    display_subtotal: boolean;
    rounding: boolean;
  };
}

export interface ISettingsDocument extends Settings, Document {}

export interface ISettingsModel<T extends Document> extends PaginateModel<T> {}
