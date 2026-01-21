import 'dotenv/config';
import express from "express";
import cors from 'cors';
import router from "./features/controllers";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
const app = express();
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
// Main Router
app.use("/api/v1", router);
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
// Error handling middleware should be last
app.use(errorMiddleware);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
