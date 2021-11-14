import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { MODELS } from '../../constants/main';
import CategoryModel from '../categories/categories.model';
import ComboModel from '../combo/combo.model';
import ModifierModel from '../modifiers/modifiers.model';
import OptionModel from '../options/options.model';
import ProductModel from '../products/products.model';
import PromotionModel from '../promotions/promotions.model';
import { IBranchDocument, IBranchModel } from './branches.types';

const branchSchema: Schema<IBranchDocument> = new Schema(
  {
    external: { type: String, default: '', required: false },
    active: { type: Boolean, default: true, required: true },
    deleted: { type: Boolean, default: false, required: true },
    name: { type: String, default: '', required: true },
    description: { type: String, default: '', required: false },
    image: { type: String, default: '', required: false },
    phone: { type: String, default: '', required: false },
    address: {
      label: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    // payment_types: BranchPaymentType[];
    // order_types: BranchOrderType[];
  },
  {
    timestamps: true,
  },
);

branchSchema.plugin(mongoosePaginate);

branchSchema.post('save', async function () {
  const filter = { 'branches.list._id': this._id };
  const update = {
    $set: {
      'branches.list.$.name': this.name,
      'branches.list.$.active': this.active,
      'branches.list.$.deleted': this.deleted,
      'branches.list.$.external': this.external,
    },
  };
  // branch had relations in Categories, Modifiers, Options, Products
  // we should update all relations to prevent many requests in future
  await Promise.all([
    CategoryModel.collection.updateMany(filter, update),
    OptionModel.collection.updateMany(filter, update),
    ProductModel.collection.updateMany(filter, update),
    ModifierModel.collection.updateMany(filter, update),
    PromotionModel.collection.updateMany(filter, update),
    ComboModel.collection.updateMany(filter, update),
  ]);
});

const BranchModel: IBranchModel<IBranchDocument> = model<IBranchDocument>(
  MODELS.BRANCH,
  branchSchema,
) as IBranchModel<IBranchDocument>;

export default BranchModel;
