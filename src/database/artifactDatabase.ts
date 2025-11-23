import Artifact from "../models/artifactModel";

async function getArtifacts() {
  const artifacts = await Artifact.find({});
  return artifacts;
}

export default { getArtifacts };
