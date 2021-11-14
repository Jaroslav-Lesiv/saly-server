import { Document, PaginateModel } from 'mongoose';

export interface Branch {
  external: string | null;
  active: boolean;
  deleted: boolean;
  name: string;
  description: string;
  image: string;
  phone: string;
  address: {
    label: string;
    lat: number;
    lng: number;
  };
  last_menu_update: string;
  // payme∏nt_types: BranchPaymentType[];
  // order_types: BranchOrderType[];
}

export interface IBranchRelation {
  _id: any;
  name: string;
  active: string;
  deleted: string;
  external: string;
}

// // ON FURURE
// export interface IBranchRelation {
//   _id: any;
//   name: string;
//   active: string;
//   deleted: string;
//   external: string;

//   price: number;
//   active_in_branch: boolean;
//   in_stock: boolean; 
// }

export interface IBranchDocument extends Branch, Document {
 
}

export interface IBranchModel<T extends Document> extends PaginateModel<T> {}
