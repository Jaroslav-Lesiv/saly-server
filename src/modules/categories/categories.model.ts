import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { MODELS } from '../../constants/main';
import { ICategoryDocument, ICategoryModel } from './categories.types';

const branchRelationSchema: any = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: MODELS.BRANCH, required: true, index: true },
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
  deleted: { type: Boolean, required: true },
  external: { type: String, required: false, default: null },
});

const categorySchema: Schema<ICategoryDocument> = new Schema(
  {
    external: { type: String, default: null, required: false },
    active: { type: Boolean, default: true, required: true },
    deleted: { type: Boolean, default: false, required: true },
    name: { type: String, default: '', required: true },
    products: {
      type: [
        {
          ref: MODELS.PRODUCT,
          type: Schema.Types.ObjectId,
        },
      ],
    },
    combos: {
      type: [
        {
          ref: MODELS.COMBO,
          type: Schema.Types.ObjectId,
        },
      ],
    },
    branches: {
      list: {
        type:  [branchRelationSchema],
        default: []
      },
      all: { type: Boolean, default: true, required: true },
    },
    // groups: {
    //   type: [
    //     {
    //       ref: MODELS.PRODUCT,
    //       type: Schema.Types.ObjectId,
    //     }
    //   ]
    // },
    // coompos: {
    //   type: [
    //     {
    //       ref: MODELS.PRODUCT,
    //       type: Schema.Types.ObjectId,
    //     }
    //   ]
    // }
    sort: { type: Number, default: 1, required: true },
  },
  {
    timestamps: true,
  },
);

categorySchema.plugin(mongoosePaginate);

categorySchema.methods.onCreate = async (category: ICategoryDocument) => {};
categorySchema.methods.onEdit = async (category: ICategoryDocument) => {};
categorySchema.methods.onDelete = async (category: ICategoryDocument) => {};

const CategoryModel: ICategoryModel<ICategoryDocument> = model<ICategoryDocument>(
  MODELS.CATEGORY,
  categorySchema,
) as ICategoryModel<ICategoryDocument>;

export default CategoryModel;
