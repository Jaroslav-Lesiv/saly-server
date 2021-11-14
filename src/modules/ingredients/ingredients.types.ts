import { Document, PaginateModel } from 'mongoose';

// export interface Ingredient {
//   _id?: any;
//   external: any;
//   name: string;
//   active: boolean;
//   deleted: boolean;
//   price: number;
// }

export interface IngredientRelation {
  _id?: any;
  external: any;
  name: string;
  active: boolean;
  deleted: boolean;
  price: number;
  calories: {
    protein: number,
    fat: number,
    carbohydrate: number
  },
}

export interface IIngredientDocument extends IngredientRelation, Document {
  // onCreate: (mdifier: IIngredientsDocument) => void;
  // onEdit: (mdifier: IIngredientsDocument) => void;
  // onDelete: (mdifier: IIngredientsDocument) => void;
}

export interface IIngredientModel<T extends Document> extends PaginateModel<T> {}
