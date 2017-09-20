import { initServer } from './server';
import { logger } from './core/logger/logger';
import { loadPath } from './core/background-character/path-node';
import { BackgroundCharacterManager } from './core/background-character/background-character-manager';

initServer().catch(e => {
  logger.error(`Unable to start server: `, e);
});

new BackgroundCharacterManager('1',null);