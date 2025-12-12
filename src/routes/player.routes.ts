import express from "express";
import playerControllers from "../controllers/player.controllers";

const router = express.Router();

router.get("/acolytes", playerControllers.getAcolytes);
router.get("/non-acolytes", playerControllers.getNonAcolytePlayers);
router.get("/:email", playerControllers.getPlayer);
router.patch("/:email", playerControllers.updatePlayer);

export default router;
