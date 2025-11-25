import { Types } from "mongoose";
import { ArtifactState } from "../constants";
import { Location } from "./geolocalization";

interface IArtifact {
  _id: Types.ObjectId;
  name: string;
  source: string;
  state: ArtifactState;
  location: Location;
}

export default IArtifact;
