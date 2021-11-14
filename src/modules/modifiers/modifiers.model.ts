import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { MODELS } from '../../constants/main';
import { MODIFIER_TYPES } from './modifiers.constants';
import { IModifierDocument, IModifierModel } from './modifiers.types';

const branchRelationSchema: any = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: MODELS.BRANCH, required: true, index: true },
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
  deleted: { type: Boolean, required: true },
  external: { type: String, required: false, default: null },
});

export const modifierSchema: Schema<IModifierDocument> = new Schema(
  {
    external: { type: String, default: null, required: false },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [MODIFIER_TYPES.SINGLE, MODIFIER_TYPES.MULTI],
      required: true,
    },
    active: { type: Boolean, default: true, required: true },
    deleted: { type: Boolean, default: false, required: true },
   
    branches: {
      list: {
        type: [branchRelationSchema],
        default: [],
      },
      all: { type: Boolean, default: true, required: true },
    },
    options: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Option',
      },
    ],
  },
  {
    timestamps: true,
  },
);

// const prepareModifier = async (modifier: IModifierDocument) => {
//   await modifier.populate('options');
//   const _modifier: any = safeHydration(modifier);
//   delete _modifier._id;
//   // delete _modifier.options;
//   delete _modifier.__v;
//   return _modifier;
// };

modifierSchema.methods.onCreate = async (modifier: IModifierDocument) => {
  // const _modifier = await prepareModifier(modifier);
  // const branch_products = branches.map((branch: IBranchDocument) => {
  //   return {
  //     ..._product,
  //     branch: branch._id,
  //   };
  // });
  // await BranchProductModel.insertMany(branch_products);
};

modifierSchema.methods.onEdit = async (modifier: IModifierDocument) => {
  // const _modifier = await prepareModifier(modifier);
  // const products = await BranchProductModel.find({
  //   'modifier._id': modifier._id,
  // });
  // console.log('------------------', products.length)
  // await Promise.all(
  //   products.map(async (product) => {
  //     product.modifiers = product.modifiers.map((m) => {
  //       if (m._id.equals(modifier._id)) {
  //         Object.entries(_modifier).forEach(([key, value]) => {
  //           // @ts-ignore
  //           m[key] = value;
  //         });
  //         // return {
  //         //   ...m,
  //         //   _modifier,
  //         // };
  //       }
  //       return m;
  //     });
  //     await product.save();
  //   }),
  // );
  // await Promise.all(
  //   products.map(async (product: IBranchProductDocument) => {
  //     const a = product.modifiers.id(modifier._id);
  //     console.log({a})
  //     if (a) {
  //       a.update(_modifier);
  //     }
  //     await product.save();
  //   }),
  // );
};

modifierSchema.methods.onDelete = async (modifier: IModifierDocument) => {
  // const products = await BranchProductModel.find({
  //   'modifier._id': modifier._id,
  // });
  // await Promise.all(
  //   products.map(async (product) => {
  //     product.modifiers = product.modifiers.filter((m) => !m._id.equals(modifier._id));
  //     await product.save();
  //   }),
  // );
};

modifierSchema.plugin(mongoosePaginate);

const ModifierModel: IModifierModel<IModifierDocument> = model<IModifierDocument>(
  'Modifier',
  modifierSchema,
) as IModifierModel<IModifierDocument>;

export default ModifierModel;

// const mod = {
//   name: 'Potato',
//   type: 'single',
//   options: ['6187d5db9b352f09c289c0e0', '6187d53a9b352f09c289c0c1'],
//   branches: {
//     list: [
//       {
//         external: '',
//         active: true,
//         deleted: false,
//         name: 'Paperoni2',
//         description: '',
//         image: '',
//         phone: '',
//         address: {
//           label: 'My add',
//           lat: 10,
//           lng: 10,
//         },
//         _id: '6188c2d4bc08cb6aea27dcca',
//         createdAt: '2021-11-08T06:25:24.432Z',
//         updatedAt: '2021-11-08T06:25:24.432Z',
//         __v: 0,
//       },
//     ],
//   },
// };
// const mods = [];
// for (let i = 0; i < 10000; i++) {
//   mods.push({ ...mod, name: `asdfg ${i}` });
// }
// ModifierModel.insertMany(mods);
