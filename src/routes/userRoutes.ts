import express, { Router } from "express";
const router = express.Router();

import middleware from "../middlewares/auth.middleware";
import playerController from "../controllers/player.controllers";
import authController from "../controllers/auth.controllers";

router.post("/log-in", middleware.verifyIdToken, authController.logIn);

router.post(
  "/access-logged-in",
  middleware.verifyIdToken,
  authController.accessLoggedIn
);

router.get("/get/:playerEmail", playerController.getPlayer);

router.patch("/update/:playerEmail", playerController.updatePlayer);

router.get("/get-acolytes", playerController.getAcolytes);

router.get("/non-acolyte-players", playerController.getNonAcolytePlayers);

export default router;
