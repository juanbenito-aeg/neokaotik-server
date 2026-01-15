import express from "express";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { jwtControllers } from "../controllers/jwt.controllers";

const router = express.Router();

router.get(
  "/refresh",
  jwtMiddleware.verifyJWT,
  jwtMiddleware.createJWT,
  jwtControllers.refresh
);

export default router;
