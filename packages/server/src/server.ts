import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import { Express } from 'express';
import { logger } from './core/logger/logger';
import { schema } from './graphql/schema';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import { createContext } from './graphql/context';

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

  const context = createContext();

  server.use(
    '/graphql',
    graphqlExpress(request => ({
      schema,
      formatError: err => {
        logger.warn('Resolver error:', err.message);

        return err;
      },
      logFunction: msg => {
        if (msg && typeof msg === 'object' && msg.key) {
          logger.debug(msg as any);
        }
      },
      context: {
        player: null, // TODO: Implement using UserGameToken header
        ...context,
      },
    }))
  );

  server.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
      query: ``,
    })
  );

  server.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}...`);
  });
}
