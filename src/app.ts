import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { Express, NextFunction, Request, Response } from 'express-serve-static-core';
import passport from 'passport';

import { config } from './config';
import { AppRouter } from './router';
import { ErrorHandling } from './services/errorHandling';

const app: any = express();
const router = new AppRouter();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded());

app.use(passport.initialize());
app.set('port', config.PORT);
app.use('/api/v1/', router.getAppRouter());
// app.use('*', (req, res) => {
//   res.status(404).json({ message: '' });
// });

function initErrorHandling(app: Express): void {
  // catch 404
  app.use((req: Request, res: Response) => {
    ErrorHandling.routeNotFound(req, res);
  });

  // prod error handling without stack traces
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('initErrorHandling:: err', err);
    ErrorHandling.prod(err, req, res, next);
  });
}

initErrorHandling(app);


export default app;