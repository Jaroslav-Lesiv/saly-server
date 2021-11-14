import { Document, PaginateModel, Schema } from 'mongoose';
import { IBranchRelation } from '../branches/branches.types';
import { IOptionDocument } from '../options/options.types';
import { MODIFIER_TYPES } from './modifiers.constants';

export interface Modifier<IOption> {
  _id?: any;
  external: any;
  name: string;
  type: MODIFIER_TYPES;
  active: boolean;
  deleted: boolean;
  branches: {
    list: IBranchRelation[];
    all: boolean;
  };
  options: IOption[];
}

export interface IModifierDocument
  extends Modifier<IOptionDocument[] | Schema.Types.ObjectId[]>,
    Document {
  onCreate: (mdifier: IModifierDocument) => void;
  onEdit: (mdifier: IModifierDocument) => void;
  onDelete: (mdifier: IModifierDocument) => void;
}

export interface IModifierModel<T extends Document> extends PaginateModel<T> {}
