import express from "express";
import playerControllers from "../controllers/player.controllers";
import { jwtMiddleware } from "../middleware/jwt.middleware";

const router = express.Router();

router.get("/acolytes", jwtMiddleware.verifyJWT, playerControllers.getAcolytes);
router.get(
  "/non-acolytes",
  jwtMiddleware.verifyJWT,
  playerControllers.getNonAcolytePlayers
);
router.get("/:email", jwtMiddleware.verifyJWT, playerControllers.getPlayer);
router.patch(
  "/:email",
  jwtMiddleware.verifyJWT,
  playerControllers.updatePlayer
);

export default router;
