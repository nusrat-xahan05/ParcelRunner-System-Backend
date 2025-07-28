import express, { Application, Request, Response } from "express";
import cors from "cors";
import { router } from "./routes";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1', router);

app.get('/', (res: Response, req: Request) => {
    res.status(200).json({
        message: "Welcome to ParcelRunner Backend System"
    });
})


export default app;