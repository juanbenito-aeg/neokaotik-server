import { Types } from "mongoose";

interface IDisease {
  _id: Types.ObjectId;
  name: string;
  penalty: string;
}

export default IDisease;
