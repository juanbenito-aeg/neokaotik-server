import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import authControllers from "../controllers/auth.controllers";

const router = express.Router();

router.post("/log-in", authMiddleware.verifyIdToken, authControllers.logIn);
router.post(
  "/access-logged-in",
  authMiddleware.verifyIdToken,
  authControllers.accessLoggedIn
);

export default router;
