import { Types } from "mongoose";
import artifactDatabase from "../../database/artifactDatabase";
import { ArtifactState, SocketServerToClientEvents } from "../../constants";
import userDatabase from "../../database/userDatabase";
import USER_ROLES from "../../roles/roles";
import { io } from "../..";

async function handleArtifactPressed(
  acolyteId: Types.ObjectId,
  artifactId: Types.ObjectId,
  socketId: string
) {
  console.log(
    `Handling tap of acolyte with _id "${acolyteId}" on artifact with _id "${artifactId}"...`
  );

  // Update pressed artifact's "state" field

  await artifactDatabase.updateArtifactsByField(
    { _id: artifactId },
    { state: ArtifactState.COLLECTED }
  );

  // Update collector's "found_artifacts" field

  const { found_artifacts } = (await userDatabase.getUserByField(
    { _id: acolyteId },
    "found_artifacts"
  ))!;

  await userDatabase.updateUserByField(
    { _id: acolyteId },
    { found_artifacts: [...found_artifacts!, artifactId] }
  );

  // Emit "artifact collected" to collector & Mortimer

  const { socketId: mortimerSocketId } = (await userDatabase.getUserByField(
    { rol: USER_ROLES.MORTIMER },
    "socketId"
  ))!;

  const collectorAndMortimerSocketIds = [socketId, mortimerSocketId];

  io.to(collectorAndMortimerSocketIds).emit(
    SocketServerToClientEvents.ARTIFACT_COLLECTED,
    acolyteId,
    artifactId
  );

  console.log(
    `Acolyte with _id "${acolyteId}" & Mortimer have been informed about artifact's (with _id "${artifactId}") collection`
  );
}

export default handleArtifactPressed;
