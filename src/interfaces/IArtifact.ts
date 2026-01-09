import { Types } from "mongoose";
import { ArtifactState } from "../constants/missions";
import { Location } from "./geolocalization";

interface IArtifact {
  _id: Types.ObjectId;
  name: string;
  state: ArtifactState;
  location: Location;
}

export default IArtifact;
