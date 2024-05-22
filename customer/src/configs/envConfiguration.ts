import dotEnv from 'dotenv';

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "prod") {

    dotEnv.config();
    console.log("Loaded environment config from .env");
} else {
    dotEnv.config({
        path:'./.env.dev',
    });
    console.log('Loaded developer environment config from .env.dev')
}

export const config = {
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    DB_URL: process.env.MONGODB_URL,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    APP_JWT_KEY: process.env.APP_JWT_KEY,
    EXCHANGE_NAME:'DATA_EXCHANGE',
    CODECAMP_BINDING_KEY:'CODECAMP_SERVICE',
    CUSTOMER_BINDING_KEY:'CUSTOMER_SERVICE',
    CODECAMP_QUEUE:'CODECAMP_QUEUE',
    COURSE_QUEUE:'COURSE_QUEUE'
};