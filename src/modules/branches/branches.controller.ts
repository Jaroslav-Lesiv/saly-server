import { Request, Response } from 'express-serve-static-core';
import { PaginateResult } from 'mongoose';

import { paginator, safeHydration, safeHydrationDocs } from '../../utils';
import { BRANCHES_ERRORS } from './branches.errors';
import BranchModel from './branches.model';
import { IBranchDocument } from './branches.types';

class BranchController {
  public getBranchs = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.branch as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }
      const { query, pagination } = paginator(req.query);

      const result: PaginateResult<IBranchDocument> = await BranchModel.paginate(query, pagination);
      res.status(200).send(safeHydrationDocs(result));
    } catch (error: any) {
      next(error);
    }
  };

  public getBranch = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.branch as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }

      const branch: IBranchDocument | null = await BranchModel.findOne({
        _id: req.params.id,
        // service: application.service,
      });

      if (!branch) {
        return res.status(404).send({ message: BRANCHES_ERRORS.NOT_FOUND });
      }
      res.status(200).send(safeHydration(branch));
    } catch (error: any) {
      next(error);
    }
  };

  public createBranch = async (req: any, res: Response, next: any) => {
    try {
      // const application: IApplicationDocument = req.branch;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }

      const branch = new BranchModel({
        ...req.body,
        // service: application.service,
      });

      await branch.save();

      res.send(safeHydration(branch));
    } catch (error: any) {
      next(error);
    }
  };

  public updateBranch = async (req: Request, res: Response, next: any) => {
    try {
      const branch: IBranchDocument | null = await BranchModel.findById({
        _id: req.params.id,
      });
      if (!branch) {
        return res.status(404).send({ message: BRANCHES_ERRORS.NOT_FOUND });
      }
      branch.set(req.body);
      await branch.save();
      res.status(200).send(safeHydration(branch));
    } catch (error: any) {
      next(error);
    }
  };

  public deleteBranch = async (req: Request, res: Response, next: any) => {
    try {
      // const application = req.branch as IApplicationDocument;
      // if (!application) {
      //   return res.status(404).send({ message: APPLICATION_ERRORS.NOT_FOUND });
      // }

      const branch: IBranchDocument | null = await BranchModel.findByIdAndRemove(
        {
          _id: req.params.id,
          // service: application.service,
        },
        { new: true },
      );
      if (!branch) {
        return res.status(404).send({ message: BRANCHES_ERRORS.NOT_FOUND });
      }

      res.status(200).send(branch);
    } catch (error: any) {
      next(error);
    }
  };

  // public createBranch = async (req: Request, res: Response, next: any) => {
  //   try {
  //     const service = req.branch as IServiceDocument;
  //     if (!service) {
  //       return res.status(404).send({ message: SERVICE_ERRORS.NOT_FOUND });
  //     }
  //     const branch = new BranchModel({ ...req.body, service: service._id });
  //     await branch.save();
  //     res.status(200).send({
  //       branch: branch.toObject(),
  //     });
  //   } catch (error: any) {
  //     next(error);
  //   }
  // };
}

export default BranchController;
