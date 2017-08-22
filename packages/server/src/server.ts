import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import { Express } from 'express';
import { logger } from './core/logger/logger';

export async function initServer() {
  const env = process.env.NODE_ENV || 'development';
  const PORT = process.env.PORT || 3000;
  const server: Express = express();

  server.use(morgan(env === 'development' ? 'dev' : 'combined'));
  server.use(cors());
  server.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
    })
  );
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());

  server.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}...`);
  });
}
