import { Request, Response } from 'express-serve-static-core';
import { LeanDocument, PaginateResult } from 'mongoose';
import { Calculator } from '../../services/calculator/calculator';

import { MODELS, STOCK_STATUS } from '../../constants/main';
import { OrderValidator } from '../../services/calculator/validator';
import { paginator, safeHydration, safeHydrationDocs } from '../../utils';
import DiscountModel from '../discounts/discounts.model';
import { PRODUCT_ERRORS } from '../products/products.errors';
import ProductModel from '../products/products.model';
import { IProductDocument } from '../products/products.types';
import { PROMOTION_ERRORS } from '../promotions/promotions.errors';
import PromotionModel from '../promotions/promotions.model';
import { ORDER_ERRORS } from './orders.errors';
import OrderModel from './orders.model';
import { IOrderDocument, RequestOrder } from './orders.types';

class OrderController {
  public getOrders = async (req: Request, res: Response, next: any) => {
    try {
      const { query, pagination } = paginator(req.query);

      const result: PaginateResult<IOrderDocument> = await OrderModel.paginate(query, pagination);
      res.status(200).send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getOrder = async (req: Request, res: Response, next: any) => {
    try {
      const order: IOrderDocument | null = await OrderModel.findOne({
        _id: req.params.id,
      });
      if (!order) {
        return res.status(404).send({ message: ORDER_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(order));
    } catch (error: any) {
      next(error);
    }
  };

  public deleteOrder = async (req: Request, res: Response, next: any) => {
    try {
      const order: IOrderDocument | null = await OrderModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          deleted: true,
        },
      );
      if (!order) {
        return res.status(404).send({ message: ORDER_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(order));
    } catch (error: any) {
      next(error);
    }
  };

  public restoreOrder = async (req: Request, res: Response, next: any) => {
    try {
      const order: IOrderDocument | null = await OrderModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          deleted: false,
        },
      );
      if (!order) {
        return res.status(404).send({ message: ORDER_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(order));
    } catch (error: any) {
      next(error);
    }
  };

  public calculate = async (req: Request, res: Response, next: any) => {
    try {
      const data: RequestOrder = req.body;
      let discountQuery = null;
      let promotionQuery = null;
      if (data.promotion) promotionQuery = PromotionModel.findById(data.promotion);
      if (data.discount) discountQuery = DiscountModel.findById(data.discount);

      const activeAndNotDeleted = {
        active: true,
        deleted: false,
      };
      const query: any = {
        $and: [activeAndNotDeleted],
      };
      if (data.branch_id) {
        const branchRelation = {
          $or: [
            {
              'branches.all': true,
            },
            {
              'branches.list._id': data.branch_id,
              'branch.list.active': true,
              'branch.list.deleted': false,
            },
          ],
        };
        query['$and'].push(branchRelation);
      }

      const productsQuery = ProductModel.find({
        _id: data.products.map((product: any) => product._id),
        ...query,
      }).populate({
        path: 'modifiers',
        model: MODELS.MODIFIER,
        match: query,
        populate: {
          path: 'options',
          match: query,
          model: MODELS.OPTION,
        },
      });

      // Retrieve dependencies
      let [discount, promotion, products] = await Promise.all([
        discountQuery,
        promotionQuery,
        productsQuery,
      ]);
      // this.products = props.products;
      // this.discount = props.discount;
      // this.promotion = props.promotion;
      // this.real_products = props.real_products;
      // this.request_products = props.request_products;

      const validator = new OrderValidator({
        request_products: data.products,
        real_products: products,
        products: [],
        discount,
        promotion,
        branch_id: null,
      });

      validator.validateRequestProducts();

      const {  existing_products } = validator.result;

      const calculator = new Calculator({
        products: existing_products,
        discount,
        promotion,

        branch_id: null,
      });

      calculator.calculateProductPrices();
      calculator.calculateSubtotal();
      calculator.calculateDiscount();
      calculator.calculatePromotion();

      const result = calculator.result;
      const result1 = validator.result;
      return res.send({
        result,
        result1,
      });
    } catch (error: any) {
      console.log({ error });
      next(error);
    }
  };

  public createOrder = async (req: Request, res: Response, next: any) => {
    try {
      let errors: any = {
        products: {},
      };

      const products = await ProductModel.find({
        _id: {
          $in: req.body.products.map((p: any) => p._id),
        },
      });

      const data = req.body;
      if (data.products) {
        // const ids = await data.products.map((product: any) => product._id);

        // const products = await BranchProductModel.find({ _id: { $in: ids } });
        data.products.forEach((product: LeanDocument<IProductDocument>) => {
          const _product = products.find((p) => p._id.equals(product._id));
          const productErrors = [];
          if (!_product) {
            productErrors.push(PRODUCT_ERRORS.NOT_FOUND);
          }

          if (_product) {
            // Is product still active
            if (!_product.active) {
              productErrors.push(PRODUCT_ERRORS.NOT_ACTIVE);
            }
            // Is products deleted
            if (_product.deleted) {
              productErrors.push(PRODUCT_ERRORS.DELETED);
            }
            // Stock validation
            if (_product.in_stock === STOCK_STATUS.OUT_OF_STOCK) {
              productErrors.push(PRODUCT_ERRORS.OUT_OF_STOCK);
            }
            // Modifiers validation
            // product.modifiers.forEach(modifier => {
            //   const _modifier = _product.modifiers.find(m => m._id === modifier._id)
            // })
          }

          if (productErrors.length) {
            errors.products[product._id] = productErrors;
          }
        });

        // console.log(promotion)
        // if (!promotion || promotion.deleted || !promotion.active) {
        //   return res.send({
        //     message: PROMOTION_ERRORS.NOT_AVAILABLE
        //   })
        // }
        // data.products = products;
      }

      if (data.promotion) {
        const promotion = await PromotionModel.findById(data.promotion);
        console.log(promotion);
        if (!promotion || promotion.deleted || !promotion.active) {
          return res.send({
            message: PROMOTION_ERRORS.NOT_AVAILABLE,
          });
        }
        data.promotion = promotion;
      }
      // const order = new OrderModel(data);
      // await order.save();
      // res.send(order);

      res.send(errors);
    } catch (error: any) {
      next(error);
    }
  };

  public updateOrder = async (req: Request, res: Response, next: any) => {
    try {
      const order: IOrderDocument | null = await OrderModel.findOne({
        _id: req.params.id,
      });
      if (!order) {
        return res.status(404).send({ message: ORDER_ERRORS.NOT_FOUND });
      }

      // DEFINE PROMOTION
      // let promotion = null;
      // // promocode can be changed just in draft status
      // if (order.order_status === ORDER_STATUS.DRAFT && req.body.promotion) {
      //   promotion = await PromotionModel.findById(req.body.promotion).populate('categories');
      // }
      // if (order.promotion) promotion = new PromotionModel(order.promotion);
      // END DEFINE PROMOTION
      // if (order.promotion)
      // order.promotion = promotion;

      await order.save();
      res.status(200).send(safeHydration(order));
    } catch (error: any) {
      next(error);
    }
  };
}

export default OrderController;
