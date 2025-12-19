import express from "express";
import missionControllers from "../controllers/mission.controllers";

const router = express.Router();

router.get("/artifacts", missionControllers.getArtifacts);

export default router;
