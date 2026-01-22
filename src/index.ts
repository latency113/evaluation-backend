import 'dotenv/config.js';
import express, { Request, Response } from "express";
import cors from 'cors';
import router from "./features/controllers/index.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Main Router
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Error handling middleware should be last
app.use(errorMiddleware);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT,'0.0.0.0',() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
