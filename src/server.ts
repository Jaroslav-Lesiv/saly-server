import { config } from './config';
import * as http from 'http';
import app from './app';
import { Database } from './services/database';

const runServer = async () => {
  const server = http.createServer(app);
  server.on('error', onError);
  server.on('listening', onListening);
  console.log('RUNNING DB', config.PORT);

  const database = new Database();
  await database.connect();
  
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
