import express from "express";
const router = express.Router();

import middleware from "../middlewares/auth.middleware";
import userController from "../controllers/userController";
import authController from "../controllers/auth.controllers";

// TESTING
router.get("/mongo", middleware.verifyIdToken, userController.getMongoUser);

router.post("/log-in", middleware.verifyIdToken, authController.loginPlayer);

router.post(
  "/access-logged-in",
  middleware.verifyIdToken,
  authController.loggedPlayer
);

router.get("/get/:userEmail", userController.getUser);

router.patch("/update/:userEmail", userController.updateUser);

router.get("/get-acolytes", userController.getAcolytes);

router.get("/non-acolyte-players", userController.getNonAcolytePlayers);

export default router;
