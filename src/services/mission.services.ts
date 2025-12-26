import artifactDb from "../db/artifact.db";
import dieaseDb from "../db/diease.db";

async function getArtifacts() {
  const artifacts = await artifactDb.getArtifacts();
  return artifacts;
}

async function getDiseases() {
  const diseases = await dieaseDb.getDiseases();
  return diseases;
}

export default { getArtifacts, getDiseases };
