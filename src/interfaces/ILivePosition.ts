import { Types } from "mongoose";
import Location from "./Location";

interface ILivePosition {
  _id: Types.ObjectId;
  player: Types.ObjectId;
  location: Location;
}

export default ILivePosition;
