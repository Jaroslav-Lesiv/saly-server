import { Document, PaginateModel } from 'mongoose';

import { STOCK_STATUS } from '../../constants/main';
import { IBranchRelation } from '../branches/branches.types';
import { IngredientRelation } from '../ingredients/ingredients.types';
import { Tax } from '../taxes/taxes.types';

export interface Option {
  _id?: any;
  external: string | null;
  active: boolean;
  name: string;
  image: string;
  unit: {
    enabled: boolean;
    name: string;
    weight: number;
  };
  ingredients: IngredientRelation[];
  price: {
    calculated: boolean;
    regular_price: number;
    sale_price: number | null;
  };
  cost: {
    calculated: boolean;
    regular_cost: number;
  };
  tax: null | Tax;
  calories: {
    // display calores
    display: boolean;
    protein: number,
    fat: number,
    carbohydrate: number,
    // calculate from ingredients
    calculated: boolean;
  },
  in_stock: STOCK_STATUS;

  branches: {
    list: IBranchRelation[];
    all: boolean;
  };
}

export interface IOptionDocument extends Option, Document<any> {
  onCreate: (option: IOptionDocument) => void;
  onEdit: (option: IOptionDocument) => void;
  onDelete: (option: IOptionDocument) => void;
}

export interface IOptionModel<T extends Document> extends PaginateModel<T> {}
