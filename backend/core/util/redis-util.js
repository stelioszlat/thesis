// import config from '../config.json';
const { createClient } = require('redis');

const host = "redis://localhost:6379" // process.env.REDIS_HOST

const client = createClient({
    url: host
});

exports.connect = async () => {
    await client.connect().then(() => { console.log("Connected to cache on " + host) });
}

// export const cacheHealthCheck = (): boolean => {
//     client.exists().then((num: any) => {
//         return true;
//     }).catch((err: any) => {
//         console.log('Redis client error.');
//         return false;
//     });
// }

exports.get = async (key) => {
    return await client.get(key).then(data => { return JSON.parse(data)});
}

exports.set = async (key, value) => {
    return await client.set(key, JSON.stringify(value));
}

exports.delete = async (key) => {
    return await client.del(key);
}

exports.keys = async (pattern) => {
    return await client.keys(pattern);
}