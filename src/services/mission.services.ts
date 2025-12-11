import artifactDb from "../db/artifact.db";

async function getArtifacts() {
  const artifacts = await artifactDb.getArtifacts();
  return artifacts;
}

export default { getArtifacts };
