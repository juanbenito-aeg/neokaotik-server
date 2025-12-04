import artifactDatabase from "../database/artifactDatabase";

async function getArtifacts() {
  const artifacts = await artifactDatabase.getArtifacts();
  return artifacts;
}

export default { getArtifacts };
