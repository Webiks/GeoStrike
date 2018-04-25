import {config} from '../../../settings/config';
import {redisPubSub} from '../../redisPubSub'
const redis = require("redis");

const client = redis.createClient(config.port, config.host);



export const airTraffic = (root, {args}, context) => {
    let message = [];
    client.lrange(config.SIMULATION_KEY, config.START, config.END, (err, chunks) => {
        chunks.forEach(
            chunk => {
                chunk = JSON.parse(chunk);
                message.push(chunk);
            });
        redisPubSub.publish(config.channel,
            {
                "messageAdded": message
            });


    });
    return true;

};

