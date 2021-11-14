import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { Express, NextFunction, Request, Response } from 'express-serve-static-core';
import * as http from 'http';
import passport from 'passport';

import { config } from './config';
import { AppRouter } from './router';
import database from './services/database';
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
const runServer = async () => {
  const server = http.createServer(app);
  server.on('error', onError);
  server.on('listening', onListening);
  console.log('RUNNING DB', config.PORT);

  await database();
  server.listen(config.PORT);
  console.log('LISTENING', config.PORT);
};

runServer();

// Server error handling
function onError(error: NodeJS.ErrnoException): void {
  console.log('SERVER onError ');
  // if (error.syscall !== "listen") throw error;
  // const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  // switch (error.code) {
  // 	case "EACCES":
  // 		logger(`${bind} requires elevated privileges`);
  // 		process.exit(1);
  // 		break;
  // 	case "EADDRINUSE":
  // 		logger(`${bind} is already in use`);
  // 		process.exit(1);
  // 		break;
  // 	default:
  // 		throw error;
  // }
}

// On server listening handler
function onListening(): void {
  // const addr = server.address();
  // const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr && addr.port}`;
  // logger(`App started and listening on ${bind}`);
  console.log('SERVER onListening ');
}

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, app closing...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, app closing...');
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  console.log(`Unhandled promise rejection thrown: `);
  console.log(reason);
  process.exit(1);
});
