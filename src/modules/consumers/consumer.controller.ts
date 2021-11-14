import axios from 'axios';
import { Request, Response } from 'express-serve-static-core';
import { USER_ROLES } from '../../constants/main';

class ConsumerController {
  client = axios.create({
    baseURL: process.env.AUTH_SERVICE_DOMAIN,
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      Authorization: `Bearer ${process.env.AUTH_SERVICE_KEY}`,
    },
  });
  public getConsumers = async (req: Request, res: Response, next: any) => {
    try {
      const response = await this.client.get(`/api/v1/users`, {
        params: req.query
      });
      res.status(200).send(response.data);
    } catch (error: any) {
      if (error?.isAxiosError) {
        const status = error.response?.status || 400;
        return res.status(status).send(error.response.data);
      }
      next(error);
    }
  };

  public getConsumer = async (req: Request, res: Response, next: any) => {
    try {
      const response = await this.client.get(`/api/v1/users/${req.params.id}`);
      res.status(200).send(response.data);
    } catch (error: any) {
      if (error?.isAxiosError) {
        const status = error.response?.status || 400;
        return res.status(status).send(error.response.data);
      }
      next(error);
    }
  };

  public createConsumer = async (req: Request, res: Response, next: any) => {
    try {
      const response = await this.client.post(`/api/v1/users`, {
        ...req.body,
        password: req.body.password || Date.now().toString(),
        role: USER_ROLES.CONSUMER,
      });
      res.status(200).send(response.data);
    } catch (error: any) {
      if (error?.isAxiosError) {
        return res.status(400).send(error.response.data);
      }
      next(error);
    }
  };

  public updateConsumer = async (req: Request, res: Response, next: any) => {
    try {
      const response = await this.client.put(`/api/v1/users/${req.params.id}`, {
        ...req.body,
      });
      res.status(200).send(response.data);
    } catch (error: any) {
      if (error?.isAxiosError) {
        return res.status(400).send(error.response.data);
      }
      next(error);
    }
  };

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

export default ConsumerController;
