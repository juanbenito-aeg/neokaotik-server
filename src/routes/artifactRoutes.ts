import express from "express";
import artifactControllers from "../controllers/mission.controllers";

const router = express.Router();

router.get("/", artifactControllers.getArtifacts);

export default router;
