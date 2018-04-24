import {config} from '../../../settings/config';
const redis = require("redis");
const client = redis.createClient(config.port, config.host);
const  massage = [];


export const airTraffic = (root, {}, context) => {
    // massage.length =0;
    console.log("1");

    let x = () => {
        client.lrange(config.SIMULATION_KEY, config.START, config.END, (err, chunks) => {
            chunks.forEach(chunk => {
                // console.log(chunk);
                massage.push(JSON.parse(chunk));
            });
            console.log("2");
        });
    };
    let y = () => {
        return massage;
    }
    x();
    y();
    console.log("3");

} ;

