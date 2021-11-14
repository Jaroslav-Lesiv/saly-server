import { Request, Response } from 'express-serve-static-core';
import { PaginateResult } from 'mongoose';

import { paginator, safeHydration, safeHydrationDocs } from '../../utils';
import { COMBO_ERRORS } from './combo.errors';
import ComboModel from './combo.model';
import { IComboDocument } from './combo.types';

class ComboController {
  public getCategories = async (req: Request, res: Response, next: any) => {
    try {
      const { query, pagination } = paginator(req.query);
      const result: PaginateResult<IComboDocument> = await ComboModel.paginate(query, pagination);
      res.status(200).send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getCombo = async (req: Request, res: Response, next: any) => {
    try {
      const combo: IComboDocument | null = await ComboModel.findOne({
        _id: req.params.id,
      });

      if (!combo) {
        return res.status(404).send({ message: COMBO_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(combo));
    } catch (error: any) {
      next(error);
    }
  };

  public createCombo = async (req: any, res: Response, next: any) => {
    try {
      const combo = new ComboModel({
        ...req.body,
      });

      await combo.onCreate(combo);
      await combo.save();

      res.send(safeHydration(combo));
    } catch (error: any) {
      next(error);
    }
  };

  public updateCombo = async (req: Request, res: Response, next: any) => {
    try {
      const combo: IComboDocument | null = await ComboModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          ...req.body,
        },
        { new: true },
      );
      if (!combo) {
        return res.status(404).send({ message: COMBO_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(combo));
    } catch (error: any) {
      next(error);
    }
  };

  public deleteCombo = async (req: Request, res: Response, next: any) => {
    try {
      const combo: IComboDocument | null = await ComboModel.findByIdAndRemove(
        {
          _id: req.params.id,
        },
        { new: true },
      );
      if (!combo) {
        return res.status(404).send({ message: COMBO_ERRORS.NOT_FOUND });
      }
      await combo.onDelete(combo);
      res.status(200).send(safeHydration(combo));
    } catch (error: any) {
      next(error);
    }
  };
}

export default ComboController;
