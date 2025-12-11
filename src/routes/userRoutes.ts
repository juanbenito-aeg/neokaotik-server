import express, { Router } from "express";
const router = express.Router();

import middleware from "../middlewares/auth.middleware";
import userController from "../controllers/userController";

// TESTING
router.get("/kaotika", middleware.verifyIdToken, userController.getKaotikaUser);

// TESTING
router.get("/mongo", middleware.verifyIdToken, userController.getMongoUser);

router.post("/log-in", middleware.verifyIdToken, userController.loginUser);

router.post(
  "/access-logged-in",
  middleware.verifyIdToken,
  userController.loggedUser
);

router.get("/get/:userEmail", userController.getUser);

router.patch("/update/:userEmail", userController.updateUser);

router.get("/get-acolytes", userController.getAcolytes);

router.get("/non-acolyte-players", userController.getNonAcolytePlayers);

export default router;
