import { Response } from 'express-serve-static-core';
import { flatten } from 'flat';

import { ErrorObject, paginator, safeHydration, safeHydrationDocs } from '../../utils';
import { BRANCHES_ERRORS } from '../branches/branches.errors';
import BranchModel from '../branches/branches.model';
import { INGREDIENTS_ERRORS } from '../ingredients/ingredients.errors';
import IngredientModel from '../ingredients/ingredients.model';
import { TAX_ERRORS } from '../taxes/taxes.errors';
import TaxModel from '../taxes/taxes.model';
import { OPTION_ERRORS } from './options.errors';
import OptionModel from './options.model';

class OptionController {
  public getOptions = async (req: any, res: Response, next: any) => {
    try {
      const { pagination, query } = paginator(req.query);
      const result = await OptionModel.paginate(query, pagination);
      res.send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getOption = async (req: any, res: Response, next: any) => {
    try {
      const option = await OptionModel.findById(req.params.id);
      if (!option) {
        return res.status(404).send({ message: OPTION_ERRORS.NOT_FOUND });
      }
      res.send(safeHydration(option));
    } catch (error: any) {
      next(error);
    }
  };

  public createOption = async (req: any, res: Response, next: any) => {
    try {
      const errors = new ErrorObject();
      const option_constructor = {
        ...req.body,
        tax: null,
        ingredients: [],
        branches: {
          all: req.body.branches.all,
          list: []
        }
      };

      // ingredients validatin
      if (req.body.ingredients?.length) {
        const ingredients = await IngredientModel.find({
          _id: { $in: req.body.ingredients.map((ingredient: any) => ingredient._id) },
        });
        req.body.ingredients.forEach((query_ingredient: any) => {
          const found_ingredient = ingredients.find((ingredient) =>
            ingredient._id.equals(query_ingredient._id),
          );
          if (!found_ingredient) {
            errors.addError(
              INGREDIENTS_ERRORS.NOT_FOUND,
              ['ingredients', query_ingredient._id],
              true,
            );
            return;
          }
          if (!found_ingredient.active) {
            errors.addError(
              INGREDIENTS_ERRORS.NOT_ACTIVE,
              ['ingredients', query_ingredient._id],
              true,
            );
          }
          if (found_ingredient.deleted) {
            errors.addError(
              INGREDIENTS_ERRORS.DELETED,
              ['ingredients', query_ingredient._id],
              true,
            );
          }
          option_constructor.ingredients.push({
            ...found_ingredient.toObject(),
            quantity: query_ingredient.quantity,
          });
        });
      }
      // ingredients validation end

      // tax validation
      if (req.body.tax) {
        const found_tax = await TaxModel.findById(req.body.tax);
        if (found_tax) {
          if (!found_tax.active) {
            errors.addError(TAX_ERRORS.NOT_ACTIVE, ['tax', req.body.tax], true);
          } else if (found_tax.deleted) {
            errors.addError(TAX_ERRORS.DELETED, ['tax', req.body.tax], true);
          }
        } else {
          errors.addError(TAX_ERRORS.NOT_FOUND, ['tax', req.body.tax], true);
        }
      }
      // tax validation end

      // branches validation
      if (req.body.branches.list.length) {
        const branches = await BranchModel.find({
          _id: { $in: req.body.branches.list },
        });
        req.body.branches.list.forEach((query_branch: any) => {
          const found_branch = branches.find((branch) => branch._id.equals(query_branch));
          if (!found_branch) {
            errors.addError(BRANCHES_ERRORS.NOT_FOUND, ['ingredients', query_branch], true);
            return;
          }

          option_constructor.branches.list.push(found_branch)
        });
      }
      // branches validation and

      const option = new OptionModel(option_constructor);

      if (errors.blocked) {
        return res.status(400).send(errors.result);
      }

      await option.save();
      res.send(safeHydration(option));
    } catch (error: any) {
      next(error);
    }
  };

  public updateOption = async (req: any, res: Response, next: any) => {
    try {
      const option = await OptionModel.findByIdAndUpdate(req.params.id, flatten(req.body), {
        new: true,
      });
      if (!option) {
        return res.status(404).send({ message: OPTION_ERRORS.NOT_FOUND });
      }
      await option.onEdit(option);
      res.send(safeHydration(option));
    } catch (error: any) {
      next(error);
    }
  };

  public deleteOption = async (req: any, res: Response, next: any) => {
    try {
      const option = await OptionModel.findByIdAndRemove(req.params.id);
      if (!option) {
        return res.status(404).send({ message: OPTION_ERRORS.NOT_FOUND });
      }
      await option.onDelete(option);
      res.send({});
    } catch (error: any) {
      next(error);
    }
  };

  // public updateUser = async (req: Request, res: Response, next: any) => {
  //   try {
  //     const application = req.user as IApplicationDocument;
  //     if (!application) {
  //       return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
  //     }
  //     const _user = await UserModel.findOne({
  //       _id: req.params.id,
  //       service: application.service,
  //     });
  //     console.log({ _user });

  //     const user: IUserDocument | null = await UserModel.findOneAndUpdate(
  //       {
  //         _id: req.params.id,
  //         service: application.service,
  //       },
  //       {
  //         ...req.body,
  //       },
  //       { new: true },
  //     );
  //     if (!user) {
  //       return res.status(404).send({ message: USER_ERRORS.NOT_FOUND });
  //     }
  //     LogModel.create({
  //       user: user.toObject(),
  //       service: user.service,
  //       application: application._id,
  //       event: LOG_EVENTS.USER_UPDATED,
  //     });
  //     res.status(200).send(safeHydration(user));
  //   } catch (error: any) {
  //     next(error);
  //   }
  // };

  // public deleteUser = async (req: Request, res: Response, next: any) => {
  //   try {
  //     const application = req.user as IApplicationDocument;
  //     if (!application) {
  //       return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
  //     }

  //     const user: IUserDocument | null = await UserModel.findByIdAndRemove(
  //       {
  //         _id: req.params.id,
  //         service: application.service,
  //       },
  //       { new: true },
  //     );
  //     if (!user) {
  //       return res.status(404).send({ message: USER_ERRORS.NOT_FOUND });
  //     }
  //     LogModel.create({
  //       user: user.toObject(),
  //       service: user.service,
  //       application: application._id,
  //       event: LOG_EVENTS.USER_DELETED,
  //     });
  //     res.status(200).send(user);
  //   } catch (error: any) {
  //     next(error);
  //   }
  // };

  // public createUser = async (req: Request, res: Response, next: any) => {
  //   try {
  //     const service = req.user as IServiceDocument;
  //     if (!service) {
  //       return res.status(404).send({ message: SERVICE_ERRORS.NOT_FOUND });
  //     }
  //     const user = new UserModel({ ...req.body, service: service._id });
  //     await user.save();
  //     res.status(200).send({
  //       user: user.toObject(),
  //     });
  //   } catch (error: any) {
  //     next(error);
  //   }
  // };
}

export default OptionController;
