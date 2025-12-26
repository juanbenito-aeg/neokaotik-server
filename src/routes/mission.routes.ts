import express from "express";
import missionControllers from "../controllers/mission.controllers";

const router = express.Router();

router.get("/artifacts", missionControllers.getArtifacts);
router.get("/diseases", missionControllers.getDiseases);

export default router;
