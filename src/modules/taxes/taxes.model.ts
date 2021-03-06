import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { MODELS } from '../../constants/main';
import OptionModel from '../options/options.model';
import ProductModel from '../products/products.model';
import { ITaxDocument, ITaxModel } from './taxes.types';

const taxSchema: Schema<ITaxDocument> = new Schema(
  {
    external: { type: String, default: null, required: false, index: true },
    name: { type: String, default: '', required: true },
    active: { type: Boolean, default: true, required: true, index: true },
    deleted: { type: Boolean, default: false, required: true, index: true },
    amount: { type: Number, default: 0, required: true, min: 0, max: 100 },
  },
  {
    timestamps: true,
  },
);

taxSchema.plugin(mongoosePaginate);

taxSchema.post('save', async function () {
  const filter = { 'tax._id': this._id };
  const update = {
    $set: {
      'tax.external': this.external,
      'tax.name': this.name,
      'tax.active': this.active,
      'tax.deleted': this.deleted,
      'tax.amount': this.amount,
    },
  };
  // branch had relations in Categories, Modifiers, Options, Products
  // we should update all relations to prevent many requests in future
  // we should nt waitiing until updating is finished
  Promise.all([
    ProductModel.collection.updateMany(filter, update),
    OptionModel.collection.updateMany(filter, update),
  ]);
});

taxSchema.index({ active: 1, deleted: 1 });

const TaxModel: ITaxModel<ITaxDocument> = model<ITaxDocument>(
  MODELS.TAX,
  taxSchema,
) as ITaxModel<ITaxDocument>;

export default TaxModel;
