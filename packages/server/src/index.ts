import { initServer } from './server';
import { logger } from './core/logger/logger';

initServer().catch(e => {
  logger.error(`Unable to start server: `, e);
});
