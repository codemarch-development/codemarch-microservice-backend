import express from 'express';
import cors from 'cors'
import session from 'express-session';
import passport from './configs/passport'
import databaseConnectionAsync from './configs/databaseConfiguration';
import courseRoutes from './routes/courseRoutes';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middleware/error-handler';
import { config } from './configs/envConfiguration';

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



// Routes
app.use('/api/courses',courseRoutes);

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
        console.log('listening on port 8002!');
    })   
}

start();