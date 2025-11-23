import { Schema, model } from "mongoose";
import IArtifact from "../interfaces/IArtifact";
import { ArtifactState } from "../constants";
import { pointSchema } from "../schemas/generics";

const artifactSchema = new Schema<IArtifact>({
  name: { type: String, required: true },
  source: { type: String, required: true },
  state: {
    type: String,
    required: true,
    enum: [ArtifactState.ACTIVE, ArtifactState.COLLECTED],
  },
  location: { type: pointSchema, required: true },
});

const Artifact = model<IArtifact>("Artifact", artifactSchema);

export default Artifact;
