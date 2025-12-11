import { Schema, model } from "mongoose";
import IArtifact from "../interfaces/IArtifact";
import { ArtifactState } from "../constants/general";

const pointSchema = new Schema(
  {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  {
    _id: false,
  }
);

const artifactSchema = new Schema<IArtifact>({
  name: { type: String, required: true },
  state: {
    type: String,
    required: true,
    enum: [ArtifactState.ACTIVE, ArtifactState.COLLECTED],
  },
  location: { type: pointSchema, required: true },
});

const Artifact = model<IArtifact>("Artifact", artifactSchema);

export default Artifact;
