import { Request, Response } from "express";
import missionServices from "../services/mission.services";

async function getArtifacts(req: Request, res: Response) {
  try {
    const artifacts = await missionServices.getArtifacts();
    res.send(artifacts);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

async function getDiseases(req: Request, res: Response) {
  try {
    const diseases = await missionServices.getDiseases();
    res.send(diseases);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

export default { getArtifacts, getDiseases };
