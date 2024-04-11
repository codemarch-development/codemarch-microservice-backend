import express, {Request,Response, NextFunction } from 'express';
import cors from 'cors'
import session from 'express-session';
import { Channel } from 'amqplib';
import passport from './configs/passport';
import databaseConnectionAsync from './configs/databaseConfiguration';
import codeCampsRoutes from './routes/codecampRoutes';
import { CreateChannel } from './utils/index'
import { config } from './configs/envConfiguration'
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middleware/error-handler';

// Extend the Request interface to include the channel property
declare global {
    namespace Express {
        interface Request {
            rabbitMQChannel?: Channel;
        }
    }
}

const app = express();


// Middleware configurations]

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

let channel: Channel | null = null;

// Middleware to attach the channel object to the request
// app.use(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const channel = await CreateChannel();
//         req.rabbitMQChannel = channel;
//         next();
//     } catch (error) {
//         console.error('Error creating channel:', error);
//         next(error);
//     }
// });

(async () => {
    try {
        const channel = await CreateChannel();
        // Pass the channel to other parts of your application
        // For example, you can pass it to route handlers or services
        // You can also store it in a global variable or dependency injection container
        // For simplicity, let's store it as a global variable
        (global as any).rabbitMQChannel = channel;
        console.log('Channel createddddd');

        // Start your server or other application logic here
    } catch (error) {
        throw error
        console.error('Error connecting to RabbitMQ:', error);
    }
})();

// Routes
app.use('/api/codeCamps',codeCampsRoutes);

// Catch-all route for handling 404 errors
app.all('*', (_req, _res, next) => {
   
    throw next (new NotFoundError());
    
});

// Register the error handler middleware
app.use(errorHandler);
console.log(config.DB_URL)
const start = async () => {
    try {
        const DATABASE_URL = config.DB_URL as string;
        await databaseConnectionAsync(DATABASE_URL);
    } catch (error) {
        console.log(error);
    }

    app.listen(config.PORT,()=>{
        console.log('listening on port 8003!');
    })   
}

start();