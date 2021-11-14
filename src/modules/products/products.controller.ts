import { Request, Response } from 'express-serve-static-core';
import { PaginateResult } from 'mongoose';

import { paginator, safeHydration, safeHydrationDocs } from '../../utils';
import { PRODUCT_ERRORS } from './products.errors';
import ProductModel from './products.model';
import { IProductDocument } from './products.types';

class ProductController {
  public getProducts = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.product as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }
      const { query, pagination } = paginator(req.query);

      const result: PaginateResult<IProductDocument> = await ProductModel.paginate(
        query,
        pagination,
      );
      res.status(200).send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getProduct = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.product as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }

      const product: IProductDocument | null = await ProductModel.findOne({
        _id: req.params.id,
        // service: application.service,
      });

      if (!product) {
        return res.status(404).send({ message: PRODUCT_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(product));
    } catch (error: any) {
      next(error);
    }
  };

  public createProduct = async (req: any, res: Response, next: any) => {
    try {
      // const application: IApplicationDocument = req.product;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }
      const product = new ProductModel({
        ...req.body,
        // service: application.service,
      });
      await product.save();
      // await product.onCreate(product);
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

  public updateProduct = async (req: Request, res: Response, next: any) => {
    try {
      const product: IProductDocument | null = await ProductModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          ...req.body,
        },
        { new: true },
      );

      if (!product) {
        return res.status(404).send({ message: PRODUCT_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(product));
    } catch (error: any) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.product as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }

      const product: IProductDocument | null = await ProductModel.findByIdAndRemove(
        {
          _id: req.params.id,
          // service: application.service,
        },
        { new: true },
      );
      if (!product) {
        return res.status(404).send({ message: PRODUCT_ERRORS.NOT_FOUND });
      }
      res.status(200).send(product);
    } catch (error: any) {
      next(error);
    }
  };

  // public createProduct = async (req: Request, res: Response, next: any) => {
  //   try {
  //     const service = req.product as IServiceDocument;
  //     if (!service) {
  //       return res.status(404).send({ message: SERVICE_ERRORS.NOT_FOUND });
  //     }
  //     const product = new ProductModel({ ...req.body, service: service._id });
  //     await product.save();
  //     res.status(200).send({
  //       product: product.toObject(),
  //     });
  //   } catch (error: any) {
  //     next(error);
  //   }
  // };
}

export default ProductController;
