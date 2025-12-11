import { Types } from "mongoose";
import Artifact from "../models/artifact.model";
import { Fields } from "../interfaces/generics";

async function getArtifactById(
  id: Types.ObjectId,
  fieldsToIncludeOrExclude = ""
) {
  const artifact = await Artifact.findById(id, fieldsToIncludeOrExclude);
  return artifact;
}

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

export default { getArtifactById, getArtifacts, updateArtifactsByField };
