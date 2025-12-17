import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';
import { clerkMiddleware } from '@clerk/express';


export function createApp(){
    const app = express();

    app.use(clerkMiddleware());

    app.use(helmet());

    app.use(
        cors({
            origin: ["http://localhost:3000"],
            credentials: true,
        })
    )

    app.use(express.json());

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}