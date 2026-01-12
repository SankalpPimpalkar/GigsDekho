import dotenv from "dotenv";
dotenv.config()

const ENV = {
    NODE_ENV: process.env.NODE_ENV || "development",
    REDIS: {
        USERNAME: process.env.REDIS_USERNAME,
        PASSWORD: process.env.REDIS_PASSWORD,
        HOST: process.env.REDIS_SOCKET_HOST,
        PORT: process.env.REDIS_SOCKET_PORT,
    },
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    CLIENT_URL: process.env.CLIENT_URL
}

export default ENV;