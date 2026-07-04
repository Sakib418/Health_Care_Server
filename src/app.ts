import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import config from './config';
import { uptime } from 'process';
import { timeStamp } from 'console';
import router from './app/routes';
import cookieparser from 'cookie-parser'

const app: Application = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

//parser
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Ph health care server..",
        Uptime: process.uptime().toFixed(2) + " sec",
        TimeStamp: new Date().toISOString()
    })
});


app.use("/api/v1",router);

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Server is running..",
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});


app.use(globalErrorHandler);

app.use(notFound);

export default app;