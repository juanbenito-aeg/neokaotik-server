import Artifact from "../models/artifactModel";
import { Fields } from "../interfaces/generics";

async function getArtifacts() {
  const artifacts = await Artifact.find({});
  return artifacts;
}

async function updateArtifactsByField(
  fieldToFilterBy: Fields,
  changesToApply: Fields
) {
  await Artifact.updateMany(fieldToFilterBy, changesToApply);
}

export default { getArtifacts, updateArtifactsByField };
