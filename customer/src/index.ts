import express, { NextFunction, Request, Response } from 'express';
import { Channel } from 'amqplib';
import cors from 'cors'
import session from 'express-session';
import passport from './configs/passport'
import databaseConnectionAsync from './configs/databaseConfiguration';
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/profileRoutes'
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middleware/error-handler';
import { createChannel, subscribeMessage } from './utils';
import { config } from './configs/envConfiguration';

// Extend the Request interface to include the channel property
declare global {
    namespace Express {
        interface Request {
            channel?: Channel;
        }
    }
}

const app = express();
// Middleware configurations
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// app.use(async (req: Request, res: Response, next: NextFunction) => {
//     try {
        
//         let channel = await CreateChannel(); // Assuming 'CreateChannel()' retrieves the channel object
        
//         req.channel = channel;
//         console.log('channel created')
//         next();
//     } catch (error) {
//         console.error('Error creating channel:', error);
//         next(error);
//     }
// });

(async () => {
    try {
        const channel:Channel = await createChannel();

        // Pass the channel and queue name to the consumer function
        await subscribeMessage(channel);
        (global as any).rabbitMQChannel = channel;

        // Start your server or other application logic here
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
})();

// Routes
app.use('/api',authRoutes)
app.use('/api/user',userRoutes);

// Catch-all route for handling 404 errors
app.all('*', (req, res, next) => {
   
    throw next (new NotFoundError());
    
});

// Register the error handler middleware
app.use(errorHandler);

const start = async () => {
    try {
        const DATABASE_URL = config.DB_URL as string;
        await databaseConnectionAsync(DATABASE_URL);
    } catch (error) {
        console.log(error);
    }

    app.listen(config.PORT,()=>{
        console.log('listening on port 8001!');
    })   
}

start();