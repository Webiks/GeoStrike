import { Logger } from 'winston';
import * as winston from 'winston';
import * as moment from 'moment';

export const logger = new Logger({
  transports: [
    new (winston.transports.Console)({
      timestamp: () => {
        return moment().format('DD.MM.YYYY(Z) HH:mm:ss');
      },
      level: process.env.LOG_LEVEL || 'silly',
      colorize: true
    })
  ]
});

export default logger;
