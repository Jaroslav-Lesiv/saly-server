import { Document, PaginateModel } from 'mongoose';
import { IBranchRelation } from '../branches/branches.types';

export interface Combo {
  external: string | null;
  active: boolean;
  deleted: boolean;
  name: string;
  description: string;
  price: {
    // actual price
    // current_price: { type: Number, required: true },
    // standart price
    regular_price: { type: Number, required: true },
    // sale price
    sale_price: { type: Number, default: null, required: false },
    // should actual be calculated from
  },
  products: [{
    product: any[];
  }]
  branches: {
    list: IBranchRelation[];
    all: boolean;
  };
}

export interface IComboDocument extends Combo, Document {
  onCreate: (combo: IComboDocument) => void;
  onEdit: (combo: IComboDocument) => void;
  onDelete: (combo: IComboDocument) => void;
}

export interface IComboModel<T extends Document> extends PaginateModel<T> {}
