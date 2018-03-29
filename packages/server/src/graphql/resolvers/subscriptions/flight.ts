import {redisPubSub,CHANNEL} from '../../redisPubSub'

export const messageAdded = {
    subscribe:
        () => {return redisPubSub.asyncIterator(CHANNEL);
    }
}