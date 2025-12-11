import artifactDatabase from "../db/artifactDatabase";

async function getArtifacts() {
  const artifacts = await artifactDatabase.getArtifacts();
  return artifacts;
}

export default { getArtifacts };
