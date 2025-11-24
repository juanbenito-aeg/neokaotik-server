import { Types } from "mongoose";
import { ArtifactState } from "../constants";

interface IArtifact {
  _id: Types.ObjectId;
  name: string;
  source: string;
  state: ArtifactState;
  location: Location;
}

interface Location {
  type: "Point";
  coordinates: number[];
}

export default IArtifact;
