import { Document, PaginateModel } from 'mongoose';

export interface Tax {
  external: string | null;
  name: string;
  deleted: boolean;
  active: boolean;
  amount: number;
}

export interface ITaxDocument extends Tax, Document {}

export interface ITaxModel<T extends Document> extends PaginateModel<T> {}
