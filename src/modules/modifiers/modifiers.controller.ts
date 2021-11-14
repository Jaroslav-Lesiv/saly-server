import { Request, Response } from 'express-serve-static-core';

import { paginator, safeHydration, safeHydrationDocs } from '../../utils';
import { MODIFIERS_ERRORS } from './modifier.errors';
import ModifierModel from './modifiers.model';

class ModifierController {
  public getModifiers = async (req: Request, res: Response, next: any) => {
    try {
      const { pagination, query } = paginator(req.query);
      const result = await ModifierModel.paginate(query, { ...pagination, populate: 'options' });

      res.send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getModifier = async (req: Request, res: Response, next: any) => {
    try {
      const modifier = await ModifierModel.findById(req.params.id);
      if (!modifier) {
        return res.status(404).send({ message: MODIFIERS_ERRORS.NOT_FOUND });
      }
      res.send(safeHydration(modifier));
    } catch (error: any) {
      next(error);
    }
  };

  public createModifier = async (req: Request, res: Response, next: any) => {
    try {
      const modifier = new ModifierModel(req.body);
      await modifier.save();
      res.send(modifier);
    } catch (error: any) {
      next(error);
    }
  };

  public updateModifier = async (req: Request, res: Response, next: any) => {
    try {
      const modifier = await ModifierModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!modifier) {
        return res.status(404).send({ message: MODIFIERS_ERRORS.NOT_FOUND });
      }
      await modifier.onEdit(modifier)
      res.send(safeHydration(modifier));
    } catch (error: any) {
      next(error);
    }
  };

  public deleteModifier = async (req: Request, res: Response, next: any) => {
    try {
      const modifier = await ModifierModel.findByIdAndRemove(req.params.id);
      if (!modifier) {
        return res.status(404).send({ message: MODIFIERS_ERRORS.NOT_FOUND });
      }
      await modifier.onDelete(modifier)
      res.send(safeHydration(modifier));
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

export default ModifierController;
