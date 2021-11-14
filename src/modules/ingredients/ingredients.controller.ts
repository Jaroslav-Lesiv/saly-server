import { Request, Response } from 'express-serve-static-core';

import { paginator, safeHydration, safeHydrationDocs } from '../../utils';
import { INGREDIENTS_ERRORS } from './ingredients.errors';
import IngredientsModel from './ingredients.model';

class IngredientsController {
  public getIngredients = async (req: Request, res: Response, next: any) => {
    try {
      const { pagination, query } = paginator(req.query);
      const result = await IngredientsModel.paginate(query, pagination);

      res.send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getIngredient = async (req: Request, res: Response, next: any) => {
    try {
      const ingredients = await IngredientsModel.findById(req.params.id);
      if (!ingredients) {
        return res.status(404).send({ message: INGREDIENTS_ERRORS.NOT_FOUND });
      }
      res.send(safeHydration(ingredients));
    } catch (error: any) {
      next(error);
    }
  };

  public createIngredient = async (req: Request, res: Response, next: any) => {
    try {
      const ingredients = new IngredientsModel(req.body);
      await ingredients.save();
      res.send(ingredients);
    } catch (error: any) {
      next(error);
    }
  };

  public updateIngredient = async (req: Request, res: Response, next: any) => {
    try {
      const ingredient = await IngredientsModel.findById(req.params.id);
      if (!ingredient) {
        return res.status(404).send({ message: INGREDIENTS_ERRORS.NOT_FOUND });
      }
      ingredient.set(req.body);
      await ingredient.save();
      // await ingredients.onEdit(ingredients)
      res.send(safeHydration(ingredient));
    } catch (error: any) {
      next(error);
    }
  };

  public deleteIngredient = async (req: Request, res: Response, next: any) => {
    try {
      const ingredients = await IngredientsModel.findByIdAndRemove(req.params.id);
      if (!ingredients) {
        return res.status(404).send({ message: INGREDIENTS_ERRORS.NOT_FOUND });
      }
      // await ingredients.onDelete(ingredients)
      res.send(safeHydration(ingredients));
    } catch (error: any) {
      next(error);
    }
  };

  // public getUser = async (req: Request, res: Response, next: any) => {
  //   try {
  //     const application = req.user as IApplicationDocument;
  //     if (!application) {
  //       return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
  //     }

  //     const user: IUserDocument | null = await UserModel.findOne({
  //       _id: req.params.id,
  //       service: application.service,
  //     });

  //     if (!user) {
  //       return res.status(404).send({ message: USER_ERRORS.NOT_FOUND });
  //     }
  //     res.status(200).send(safeHydration(user));
  //   } catch (error: any) {
  //     next(error);
  //   }
  // };

  // public createUser = async (req: any, res: Response, next: any) => {
  //   try {
  //     const application: IApplicationDocument = req.user;
  //     if (!application) {
  //       return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
  //     }

  //     const user = new UserModel({
  //       ...req.body,
  //       service: application.service,
  //     });
  //     await user.save();
  //     LogModel.create({
  //       user: user.toObject(),
  //       service: user.service,
  //       application: application._id,
  //       event: LOG_EVENTS.USER_CREATED,
  //     });
  //     res.send(safeHydration(user));
  //   } catch (error: any) {
  //     next(error);
  //   }
  // };

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

export default IngredientsController;
