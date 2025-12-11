import { Request, Response } from "express";
import artifactServices from "../services/mission.services";

async function getArtifacts(req: Request, res: Response) {
  try {
    const artifacts = await artifactServices.getArtifacts();
    res.send(artifacts);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

export default { getArtifacts };
