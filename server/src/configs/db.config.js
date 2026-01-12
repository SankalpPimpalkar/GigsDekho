import { createClient } from 'redis';
import mongoose from "mongoose";
import ENV from './env.config.js';

export const redis = createClient({
    username: ENV.REDIS.USERNAME,
    password: ENV.REDIS.PASSWORD,
    socket: {
        host: ENV.REDIS.HOST,
        port: ENV.REDIS.PORT
    }
});

export async function connectRedis() {
    try {
        const response = await redis.connect();
        console.log("✅ Redis Connected", response.CLIENT_GETNAME)

    } catch (error) {
        console.log("Redis Connection Error: ", error)
        process.exit(1)
    }
}

export async function connectMongoDB() {
    try {
        const response = await mongoose.connect(ENV.MONGO_URL, { dbName: 'gigsdekho' })
        console.log("✅ Mongodb Connected", response.connection.host)

    } catch (error) {
        console.log("Mongodb Connection Error: ", error)
        process.exit(1)
    }
}