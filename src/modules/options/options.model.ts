import { model, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { MODELS, STOCK_STATUS } from '../../constants/main';
import { ITaxDocument } from '../taxes/taxes.types';
import { IOptionDocument, IOptionModel } from './options.types';

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

export const optionSchema: Schema<IOptionDocument> = new Schema(
  {
    external: { type: String, default: null, required: false },
    active: { type: Boolean, default: true, required: true },
    name: { type: String, required: true },
    image: { type: String, default: '', required: false },
    unit: {
      enabled: { type: Boolean, default: false, required: true },
      name: { type: String, default: '', required: false },
      weight: { type: Number, default: 0, required: true },
    },
    price: {
      calculated: { type: Boolean, default: false, required: true },
      regular_price: { type: Number, required: true, min: 0 },
      sale_price: { type: Number, default: null, required: false, min: 0 },
    },
    cost: {
      calculated: { type: Boolean, required: true, default: false },
      // standart price
      regular_cost: { type: Number, required: true },
    },
    tax: {
      type: productTaxSchema,
      required: false,
      default: null,
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
    ingredients: {
      type: [ingredientRelationSchema],
    },
    branches: {
      list: {
        type: [branchRelationSchema],
        default: [],
      },
      all: { type: Boolean, default: true, required: true },
    },
  },
  {
    timestamps: true,
  },
);

// const prepareOption = async (option: IOptionDocument) => {
//   // await option.populate();
//   const _option: any = safeHydration(option);
//   delete _option._id;
//   // delete _modifier.options;
//   delete _option.__v;
//   return _option;
// };
optionSchema.methods.onCreate = async (option: IOptionDocument) => {
  // const _modifier = await prepareModifier(modifier);
  // const branch_products = branches.map((branch: IBranchDocument) => {
  //   return {
  //     ..._product,
  //     branch: branch._id,
  //   };
  // });
  // await BranchProductModel.insertMany(branch_products);
};

optionSchema.methods.onEdit = async (option: IOptionDocument) => {
  // const _option = await prepareOption(option);
  // const products = await BranchProductModel.find({
  //   'modifier.options._id': option._id,
  // });
  // await Promise.all(
  //   products.map(async (product) => {
  //     product.modifiers = product.modifiers.map((modifier) => {
  //       modifier.options = modifier.options.map((o) => {
  //         if (o._id.equals(option._id)) {
  //           Object.entries(_option).forEach(([key, value]) => {
  //             // @ts-ignore
  //             o[key] = value;
  //           });
  //           // return {
  //           //   ...m,
  //           //   _modifier,
  //           // };
  //         }
  //         return o;
  //       });
  //       return modifier;
  //     });
  //     await product.save();
  //   }),
  // );
};

optionSchema.methods.onDelete = async (option: IOptionDocument) => {
  // const products = await BranchProductModel.find({
  //   'modifier.options._id': option._id,
  // });
  // await Promise.all(
  //   products.map(async (product) => {
  //     product.modifiers = product.modifiers.map((modifier) => {
  //       modifier.options = modifier.options.filter((o) => !o._id.equals(option._id));
  //       return modifier;
  //     });
  //     await product.save();
  //   }),
  // );
};

optionSchema.plugin(mongoosePaginate);

// optionSchema.post('save', async function () {
//   await OptionModel.updateMany(
//     { 'ingredients._id': this._id },
//     {
//       $set: {
//         'permissions.$': this,
//       },
//     },
//   );
// });

const OptionModel: IOptionModel<IOptionDocument> = model<IOptionDocument>(
  MODELS.OPTION,
  optionSchema,
) as IOptionModel<IOptionDocument>;

export default OptionModel;
