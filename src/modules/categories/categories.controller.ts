import { Request, Response } from 'express-serve-static-core';
import { PaginateResult } from 'mongoose';

import { paginator, safeHydration, safeHydrationDocs } from '../../utils';
import { CATEGORY_ERRORS } from './categories.errors';
import CategoryModel from './categories.model';
import { ICategoryDocument } from './categories.types';

class CategoryController {
  public getCategories = async (req: Request, res: Response, next: any) => {
    try {
      const { query, pagination } = paginator(req.query);
      const result: PaginateResult<ICategoryDocument> = await CategoryModel.paginate(
        query,
        pagination,
      );
      res.status(200).send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getCategory = async (req: Request, res: Response, next: any) => {
    try {
      const category: ICategoryDocument | null = await CategoryModel.findOne({
        _id: req.params.id,
      });

      if (!category) {
        return res.status(404).send({ message: CATEGORY_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(category));
    } catch (error: any) {
      next(error);
    }
  };

  public createCategory = async (req: any, res: Response, next: any) => {
    try {
      const category = new CategoryModel({
        ...req.body,
      });

      await category.onCreate(category);
      await category.save();

      res.send(safeHydration(category));
    } catch (error: any) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: any) => {
    try {
      const category: ICategoryDocument | null = await CategoryModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          ...req.body,
        },
        { new: true },
      );
      if (!category) {
        return res.status(404).send({ message: CATEGORY_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(category));
    } catch (error: any) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: any) => {
    try {
      const category: ICategoryDocument | null = await CategoryModel.findByIdAndRemove(
        {
          _id: req.params.id,
        },
        { new: true },
      );
      if (!category) {
        return res.status(404).send({ message: CATEGORY_ERRORS.NOT_FOUND });
      }
      await category.onDelete(category);
      res.status(200).send(safeHydration(category));
    } catch (error: any) {
      next(error);
    }
  };
}

export default CategoryController;
