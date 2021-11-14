import { Request, Response } from 'express-serve-static-core';
import { PaginateResult } from 'mongoose';

import { paginator, safeHydration, safeHydrationDocs } from '../../utils';
import { TAX_ERRORS } from './taxes.errors';
import TaxModel from './taxes.model';
import { ITaxDocument } from './taxes.types';

class TaxController {
  public getCategories = async (req: Request, res: Response, next: any) => {
    try {
      const { query, pagination } = paginator(req.query);
      const result: PaginateResult<ITaxDocument> = await TaxModel.paginate(query, pagination);
      res.status(200).send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getTax = async (req: Request, res: Response, next: any) => {
    try {
      const tax: ITaxDocument | null = await TaxModel.findOne({
        _id: req.params.id,
      });

      if (!tax) {
        return res.status(404).send({ message: TAX_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(tax));
    } catch (error: any) {
      next(error);
    }
  };

  public createTax = async (req: any, res: Response, next: any) => {
    try {
      const tax = new TaxModel({
        ...req.body,
      });
      await tax.save();
      res.send(safeHydration(tax));
    } catch (error: any) {
      next(error);
    }
  };

  public updateTax = async (req: Request, res: Response, next: any) => {
    try {
      const tax: ITaxDocument | null = await TaxModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          ...req.body,
        },
        { new: true },
      );
      if (!tax) {
        return res.status(404).send({ message: TAX_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(tax));
    } catch (error: any) {
      next(error);
    }
  };

  public deleteTax = async (req: Request, res: Response, next: any) => {
    try {
      const tax: ITaxDocument | null = await TaxModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          deleted: true,
        },
        { new: true },
      );
      if (!tax) {
        return res.status(404).send({ message: TAX_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(tax));
    } catch (error: any) {
      next(error);
    }
  };
}

export default TaxController;
