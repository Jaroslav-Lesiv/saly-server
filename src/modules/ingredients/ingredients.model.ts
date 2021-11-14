import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import OptionModel from '../options/options.model';
import ProductModel from '../products/products.model';
import { IIngredientDocument, IIngredientModel } from './ingredients.types';

const ingredientsSchema: Schema<IIngredientDocument> = new Schema(
  {
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
  },
  {
    timestamps: true,
  },
);

ingredientsSchema.post('save', async function () {
  // Update ingredients in all relations
  // Ingridient relations has Products, Options
  const filter = { 'ingredients._id': this._id };
  const update = {
    $set: {
      'ingredients.$.external': this.external,
      'ingredients.$.name': this.name,
      'ingredients.$.active': this.active,
      'ingredients.$.deleted': this.deleted,
      'ingredients.$.price': this.price,
      'ingredients.$.calories': this.calories,
    },
  };
  await Promise.all([
    OptionModel.collection.updateMany(filter, update),
    ProductModel.collection.updateMany(filter, update),
  ]);
});

ingredientsSchema.plugin(mongoosePaginate);

const IngredientModel: IIngredientModel<IIngredientDocument> = model<IIngredientDocument>(
  'Ingredients',
  ingredientsSchema,
) as IIngredientModel<IIngredientDocument>;

export default IngredientModel;
