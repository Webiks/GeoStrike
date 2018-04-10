import {RedisPubSub} from 'graphql-redis-subscriptions';
import {config} from '../settings/config'
export const CHANNEL = config.channel;

const options = {
    host: config.host,
    port: config.port,
    retry_strategy: options => {
        // reconnect after
        return Math.max(options.attempt * 100, 3000);
    }
};

export const redisPubSub = new RedisPubSub({
    connection: options
});



redisPubSub.subscribe(CHANNEL, (payload) => {

    try {
        console.log("redisPubSub:" + JSON.stringify(payload));
    } catch (error) {
        console.error(`Error trying to extract new message from payload`);
        console.error(error.message);
    }
});