import { Schema, model } from "mongoose";
import IDisease from "../interfaces/IDisease";

const diseaseSchema = new Schema<IDisease>({
  name: String,
  penalty: String,
});

const Disease = model<IDisease>("Disease", diseaseSchema);

export default Disease;
