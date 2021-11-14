import { Request, Response } from 'express-serve-static-core';
import { PaginateResult } from 'mongoose';

import { paginator, safeHydration, safeHydrationDocs } from '../../utils';
import { PROMOTION_ERRORS } from './promotions.errors';
import PromotionModel from './promotions.model';
import { IPromotionDocument } from './promotions.types';

class PromotionController {
  public getPromotions = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.product as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }
      const { query, pagination } = paginator(req.query);

      const result: PaginateResult<IPromotionDocument> = await PromotionModel.paginate(
        query,
        pagination,
      );
      res.status(200).send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getPromotion = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.product as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }

      const product: IPromotionDocument | null = await PromotionModel.findOne({
        _id: req.params.id,
        // service: application.service,
      });

      if (!product) {
        return res.status(404).send({ message: PROMOTION_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(product));
    } catch (error: any) {
      next(error);
    }
  };

  public createPromotion = async (req: any, res: Response, next: any) => {
    try {
      // const application: IApplicationDocument = req.product;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }

      const product = new PromotionModel({
        ...req.body,
        // service: application.service,
      });
      await product.save();
      await product.onCreate(product);
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

  public updatePromotion = async (req: Request, res: Response, next: any) => {
    try {
      const product: IPromotionDocument | null = await PromotionModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          ...req.body,
        },
        { new: true },
      );

      if (!product) {
        return res.status(404).send({ message: PROMOTION_ERRORS.NOT_FOUND });
      }
      await product.onEdit(product);
      res.status(200).send(safeHydration(product));
    } catch (error: any) {
      next(error);
    }
  };

  public deletePromotion = async (req: Request, res: Response, next: any) => {
    try {
      const product: IPromotionDocument | null = await PromotionModel.findByIdAndRemove(
        {
          _id: req.params.id,
          // service: application.service,
        },
        { new: true },
      );
      if (!product) {
        return res.status(404).send({ message: PROMOTION_ERRORS.NOT_FOUND });
      }
      await product.onDelete(product);
      res.status(200).send(product);
    } catch (error: any) {
      next(error);
    }
  };

  // public createPromotion = async (req: Request, res: Response, next: any) => {
  //   try {
  //     const service = req.product as IServiceDocument;
  //     if (!service) {
  //       return res.status(404).send({ message: SERVICE_ERRORS.NOT_FOUND });
  //     }
  //     const product = new PromotionModel({ ...req.body, service: service._id });
  //     await product.save();
  //     res.status(200).send({
  //       product: product.toObject(),
  //     });
  //   } catch (error: any) {
  //     next(error);
  //   }
  // };
}

export default PromotionController;
