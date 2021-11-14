import { Document, PaginateModel } from 'mongoose';

import { STOCK_STATUS } from '../../constants/main';
import { IBranchRelation } from '../branches/branches.types';
import { IngredientRelation } from '../ingredients/ingredients.types';
import { IModifierDocument } from '../modifiers/modifiers.types';
import { Tax } from '../taxes/taxes.types';
import { PRODUCT_SELLING_METHOD } from './products.constants';

export interface ProductIngredients {
  // _id: Schema.Types.ObjectId;
  name: string;
  price: number;
}

interface ProductModifier {
  unique_options: boolean;
  quantity: {
    free_quantity: number;
    min_quantity: number;
    max_quantity: number;
  };
  modifier: string | IModifierDocument;
}

export interface Product {
  external: string | null;
  active: boolean;
  deleted: boolean;

  name: string;
  description: string;
  image: string;

  preparation: {
    time: number;
  };
  calories: {
    // display calores
    display: boolean;
    protein: number;
    fat: number;
    carbohydrate: number;
    // calculate from ingredients
    calculated: boolean;
  };
  in_stock: STOCK_STATUS;
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

  category: any;

  selling_method: PRODUCT_SELLING_METHOD;
  modifiers: ProductModifier[];

  branches: {
    list: IBranchRelation[];
    all: boolean;
  };
}

export interface IProductDocument extends Product, Document {}

export interface IProductModel<T extends Document> extends PaginateModel<T> {}
