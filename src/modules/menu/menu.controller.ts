import { Request, Response } from 'express-serve-static-core';

import { MODELS } from '../../constants/main';
import CategoryModel from '../categories/categories.model';

class MenuController {
  public getMenu = async (req: Request, res: Response, next: any) => {
    try {
      const branchRelation = {
        $or: [
          {
            'branches.all': true,
          },
          {
            'branches.list._id': req.query.branch_id,
            'branch.list.active': true,
            'branch.list.deleted': false,
          },
        ],
      };
      const activeAndNotDeleted = {
        active: true,
        deleted: false,
      };
      const query = {
        $and: [activeAndNotDeleted, branchRelation],
      };
      // const productsQuery = ProductModel.find({
      //   $or: [
      //     {
      //       'branches.all': true,
      //     },
      //     {
      //       'branches.list._id': req.query.branch_id,
      //     },
      //   ],
      // }).populate({
      //   path: 'modifiers',
      //   populate: {
      //     path: 'options',
      //     model: 'Option',
      //   },
      // });
      const categoriesQuery = CategoryModel.find(query)
        .populate({
          path: 'products',
          match: query,
          populate: {
            path: 'modifiers',
            model: MODELS.MODIFIER,
            match: query,
            populate: {
              path: 'options',
              model: MODELS.OPTION,
            },
          },
        })
        .populate({
          path: 'combos',
          match: query,
          populate: {
            path: 'products',
            model: MODELS.PRODUCT,
            match: query,
            populate: {
              path: 'modifiers',
              model: MODELS.MODIFIER,
              match: query,
              populate: {
                path: 'options',
                model: MODELS.OPTION,
              },
            },
          },
        });

      const [
        // products,
        categories,
      ] = await Promise.all([
        //  productsQuery,
        categoriesQuery,
      ]);
      return res.send({
        // products,
        categories,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

export default MenuController;
