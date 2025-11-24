import express from "express";
import artifactControllers from "../controllers/artifactControllers";

const router = express.Router();

router.get("/", artifactControllers.getArtifacts);

export default router;
