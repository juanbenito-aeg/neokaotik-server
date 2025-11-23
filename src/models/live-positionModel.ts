import mongoose, { Schema, model } from "mongoose";
import { pointSchema } from "../schemas/generics";
import ILivePosition from "../interfaces/ILivePosition";

const livePositionSchema = new Schema<ILivePosition>(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    location: { type: pointSchema, required: true },
  },
  {
    collection: "live_positions",
  }
);

const LivePosition = model<ILivePosition>("LivePosition", livePositionSchema);

export default LivePosition;
