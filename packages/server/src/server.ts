import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Express } from 'express';
import * as session from 'express-session';
import { logger } from './core/logger/logger';
import schema from './graphql/schema';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { createContext, resolveGameAndPlayer } from './graphql/context';
import { createServer } from 'http';
import {     SubscriptionServer } from 'subscriptions-transport-ws-temp';
import { execute, subscribe } from 'graphql';

export async function initServer() {
  const env = process.env.NODE_ENV || 'development';
  const PORT = process.env.PORT || 3000;
  const server: Express = express();


server.get('/test', (req, res) => res.send('Hello ohad!'))


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
        ...resolveGameAndPlayer(request.headers['player-token'] as string, context.games),
        ...context,
      },
      debug: true,
    }))
  );

  const wsSchema = process.env.WS_SCHEMA || 'ws';
  server.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
      query: ``,
      subscriptionsEndpoint: `${wsSchema}://localhost:3000/subscriptions`,
    })
  );

  const httpServer = createServer(server);

  httpServer.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}...`);
    logger.info(`GraphQL HTTP: http://localhost:${PORT}/graphql`);
    logger.info(`GraphiQL HTTP: http://localhost:${PORT}/graphiql`);
    logger.info(`GraphQL Subscriptions WebSocket: ${wsSchema}://localhost:${PORT}/subscriptions`);

    SubscriptionServer.create({
      schema,
      execute,
      subscribe,
      onConnect: connectionParams => {
        return {
          ...resolveGameAndPlayer(connectionParams['player-token'], context.games),
          ...context,
        };
      },
    }, {
      server: httpServer,
      path: '/subscriptions',
    });
  });
}
