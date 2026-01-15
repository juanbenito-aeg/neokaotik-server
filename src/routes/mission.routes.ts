import express from "express";
import missionControllers from "../controllers/mission.controllers";
import { jwtMiddleware } from "../middleware/jwt.middleware";

const router = express.Router();

router.get(
  "/artifacts",
  jwtMiddleware.verifyJWT,
  missionControllers.getArtifacts
);
router.get(
  "/diseases",
  jwtMiddleware.verifyJWT,
  missionControllers.getDiseases
);

export default router;
