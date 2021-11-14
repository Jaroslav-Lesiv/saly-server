import { Request, Response } from 'express-serve-static-core';
import { PaginateResult } from 'mongoose';

import { paginator, safeHydration, safeHydrationDocs } from '../../utils';
import { DISCOUNT_ERRORS } from './discounts.errors';
import DiscountModel from './discounts.model';
import { IDiscountDocument } from './discounts.types';

class DiscountController {
  public getDiscounts = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.product as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }
      const { query, pagination } = paginator(req.query);

      const result: PaginateResult<IDiscountDocument> = await DiscountModel.paginate(
        query,
        pagination,
      );
      res.status(200).send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getDiscount = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.product as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }

      const product: IDiscountDocument | null = await DiscountModel.findOne({
        _id: req.params.id,
        // service: application.service,
      });

      if (!product) {
        return res.status(404).send({ message: DISCOUNT_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(product));
    } catch (error: any) {
      next(error);
    }
  };

  public createDiscount = async (req: any, res: Response, next: any) => {
    try {
      // const application: IApplicationDocument = req.product;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }

      const product = new DiscountModel({
        ...req.body,
        // service: application.service,
      });
      await product.save();
      // LogModel.create({
      //   product: product.toObject(),
      //   service: product.service,
      //   application: application._id,
      //   event: LOG_EVENTS.USER_CREATED,
      // });
      res.send(safeHydration(product));
    } catch (error: any) {
      next(error);
    }
  };

  public updateDiscount = async (req: Request, res: Response, next: any) => {
    try {
      const product: IDiscountDocument | null = await DiscountModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          ...req.body,
        },
        { new: true },
      );

      if (!product) {
        return res.status(404).send({ message: DISCOUNT_ERRORS.NOT_FOUND });
      }
      await product.onEdit(product);
      res.status(200).send(safeHydration(product));
    } catch (error: any) {
      next(error);
    }
  };

  public deleteDiscount = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.product as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }

      const product: IDiscountDocument | null = await DiscountModel.findByIdAndRemove(
        {
          _id: req.params.id,
          // service: application.service,
        },
        { new: true },
      );
      if (!product) {
        return res.status(404).send({ message: DISCOUNT_ERRORS.NOT_FOUND });
      }
      await product.onDelete(product);
      res.status(200).send(product);
    } catch (error: any) {
      next(error);
    }
  };

  // public createDiscount = async (req: Request, res: Response, next: any) => {
  //   try {
  //     const service = req.product as IServiceDocument;
  //     if (!service) {
  //       return res.status(404).send({ message: SERVICE_ERRORS.NOT_FOUND });
  //     }
  //     const product = new DiscountModel({ ...req.body, service: service._id });
  //     await product.save();
  //     res.status(200).send({
  //       product: product.toObject(),
  //     });
  //   } catch (error: any) {
  //     next(error);
  //   }
  // };
}

export default DiscountController;
