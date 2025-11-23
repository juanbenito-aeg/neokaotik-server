import { Types } from "mongoose";
import Location from "./Location";
import { ArtifactState } from "../constants";

interface IArtifact {
  _id: Types.ObjectId;
  name: string;
  source: string;
  state: ArtifactState;
  location: Location;
}

export default IArtifact;
