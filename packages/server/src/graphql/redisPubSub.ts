import {RedisPubSub} from 'graphql-redis-subscriptions';

export const CHANNEL = `messageAdded`;

const Config = {
    serverPort:  3002,
    redisHost:  'localhost',
    redisPort:  6379
}
const options = {
    host: Config.redisHost,
    port: Config.redisPort,
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