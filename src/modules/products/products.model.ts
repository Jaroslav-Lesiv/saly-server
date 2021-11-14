import { model, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { MODELS, STOCK_STATUS } from '../../constants/main';
import { ITaxDocument } from '../taxes/taxes.types';
import { PRODUCT_SELLING_METHOD } from './products.constants';
import { IProductDocument, IProductModel } from './products.types';

const branchRelationSchema: any = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: MODELS.BRANCH, required: true, index: true },
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
  deleted: { type: Boolean, required: true },
  external: { type: String, required: false, default: null },
});

const ingredientRelationSchema: any = {
  _id: { type: Schema.Types.ObjectId, ref: MODELS.BRANCH, required: true, index: true },
  external: { type: String, default: null, required: false },
  name: { type: String, required: true, intl: true },
  active: { type: Boolean, default: true, required: true },
  deleted: { type: Boolean, default: false, required: true },
  price: { type: Number, default: 0, required: true },
  calories: {
    protein: { type: Number, default: 0, required: true, min: 0 },
    fat: { type: Number, default: 0, required: true, min: 0 },
    carbohydrate: { type: Number, default: 0, required: true, min: 0 },
  },
  quantity: { type: Number, default: 1, required: true, min: 1 },
  // editable: { type: Boolean, default: false, required: true },
  // minimum: { type: Number, default: 1, required: true },
  // maximum: { type: Number, default: 0, required: true },
};

const productTaxSchema: Schema<ITaxDocument> = new Schema({
  _id: { type: Types.ObjectId, required: true },
  external: { type: String, default: null, required: false },
  name: { type: String, default: '', required: true },
  deleted: { type: Boolean, default: false, required: true },
  amount: { type: Number, default: 0, required: true, min: 0, max: 100 },
});

export const productSchema: Schema<IProductDocument> = new Schema(
  {
    active: { type: Boolean, default: true, required: true },
    external: { type: String, default: null },

    name: { type: String, required: true },
    description: { type: String, default: '', required: false },
    image: { type: String, default: '', required: false },
    preparation: {
      time: { type: Number, default: 0, required: true },
    },
    calories: {
      display: { type: Boolean, default: false, required: true },
      protein: { type: Number, default: 0, required: true, min: 0 },
      fat: { type: Number, default: 0, required: true, min: 0 },
      carbohydrate: { type: Number, default: 0, required: true, min: 0 },
      // calculate from ingredients
      calculated: { type: Boolean, required: true, default: false },
    },
    in_stock: {
      type: Number,
      enum: [STOCK_STATUS.IN_STOCK, STOCK_STATUS.OUT_OF_STOCK],
      default: STOCK_STATUS.IN_STOCK,
    },

    unit: {
      enabled: { type: Boolean, default: false, required: true },
      name: { type: String, default: '', required: false },
      weight: { type: Number, default: 0, required: true },
    },
    price: {
      calculated: { type: Boolean, default: false, required: true },
      // standart price
      regular_price: { type: Number, required: true },
      // sale price
      sale_price: { type: Number, default: null, required: false },
    },
    cost: {
      calculated: { type: Boolean, required: true, default: false },
      // standart price
      regular_cost: { type: Number, required: true },
    },

    category: { type: Schema.Types.ObjectId, ref: MODELS.CATEGORY, required: false },
    modifiers: {
      type: [
        {
          unique_options: { type: Boolean, default: true, required: true },
          quantity: {
            free_quantity: { type: Number, default: 0, min: 0 },
            min_quantity: { type: Number, default: 0, min: 0 },
            max_quantity: { type: Number, default: 0, min: 0 },
          },
          modifier: {
            type: Schema.Types.ObjectId,
            ref: MODELS.MODIFIER,
            required: true
          }
        }
      ],
      default: [],
    },
    branches: {
      list: {
        type: [branchRelationSchema],
        default: [],
      },
      all: { type: Boolean, default: true, required: true },
    },
    ingredients: {
      type: [ingredientRelationSchema],
    },
    tax: {
      type: productTaxSchema,
      required: false,
      default: null,
    },
    selling_method: {
      type: Number,
      enum: [PRODUCT_SELLING_METHOD.UNIT, PRODUCT_SELLING_METHOD.WEIGHT],
      default: PRODUCT_SELLING_METHOD.UNIT,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.plugin(mongoosePaginate);

const ProductModel: IProductModel<IProductDocument> = model<IProductDocument>(
  MODELS.PRODUCT,
  productSchema,
) as IProductModel<IProductDocument>;

export default ProductModel;
