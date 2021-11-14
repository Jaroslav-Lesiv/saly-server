export enum LANGUAGES {
  UA,
  EN,
  RU,
}

export enum JWT_TYPE {
  SERVICE,
  APPLICATION,
  USER,
}

export enum STOCK_STATUS {
  OUT_OF_STOCK,
  IN_STOCK,
}

export enum PAYMENT_TYPES {
  CASH,
  WALLET,
  ONLINE_PAYMENT,
  TERMINAL,
}

export enum ORDER_TYPES {
  DINE_IN,
  PICKUP,
  TO_GO,
  CURBSIDE,
  DELIVERY,
}

export enum MODELS {
  BRANCH = 'Branch',
  BRANCH_PRODUCTS = 'BranchProducts',
  PRODUCT = 'Product',
  MODIFIER = 'Modifier',
  OPTION = 'Option',
  CATEGORY = 'Category',
  COMBO = 'Combo',
  ORDER = 'Order',
  PROMOTIN = 'Promotion',
  DISCOUNT = 'Discount',
  TAX = 'Tax'
}

export enum USER_ROLES {
  ADMIN,
  WORKER,
  CONSUMER,
}
