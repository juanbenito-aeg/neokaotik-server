import express from "express";
import { createServer } from "node:http";
import authRoutes from "../routes/auth.routes";
import playerRoutes from "../routes/player.routes";
import missionRoutes from "../routes/mission.routes";

const app = express();

const httpServer = createServer(app);

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/players", playerRoutes);
app.use("/missions", missionRoutes);

export { app, httpServer };
