import { Document, PaginateModel } from 'mongoose';
import { IBranchRelation } from '../branches/branches.types';

export interface Category {
  external: string | null;
  active: boolean;
  deleted: boolean;
  name: string;
  products: any[];
  sort: number;
  branches: {
    list: IBranchRelation[];
    all: boolean;
  };

  groups: any[];
  combos: any[];
}

export interface ICategoryDocument extends Category, Document {
  onCreate: (category: ICategoryDocument) => void;
  onEdit: (category: ICategoryDocument) => void;
  onDelete: (category: ICategoryDocument) => void;
}

export interface ICategoryModel<T extends Document> extends PaginateModel<T> {}
