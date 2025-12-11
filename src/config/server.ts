import express from "express";
import { createServer } from "node:http";
import userRouter from "../routes/userRoutes";
import artifactRoutes from "../routes/artifactRoutes";

const app = express();

const httpServer = createServer(app);

app.use(express.json());
app.use("/user", userRouter);
app.use("/api/artifacts", artifactRoutes);

export { app, httpServer };
