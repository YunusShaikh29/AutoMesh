import dotenv from "dotenv"
dotenv.config()
import express, { type Express, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from './v0/routes/authRouter';
import { workflowRouter } from './v0/routes/workflowRoute';
import { credentialsRouter } from './v0/routes/credentialsRoute';
import { webhookRouter } from './v0/routes/webhookRouter';
import {executionRouter} from "./v0/routes/executionRouter";
import { googleOAuthRouter } from "./v0/routes/googleOAuth";

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Express backend!');
});

app.use('/api/v0/auth', authRouter);
app.use('/api/v0/workflows', workflowRouter);
app.use('/api/v0/credentials', credentialsRouter);
app.use('/webhook', webhookRouter);
app.use("/api/v0", executionRouter);
app.use("/api/v0", googleOAuthRouter);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});