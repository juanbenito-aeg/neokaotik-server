import { HydratedDocument } from "mongoose";
import { ArtifactState, SocketServerToClientEvents } from "../../constants";
import artifactDatabase from "../../database/artifactDatabase";
import userDatabase from "../../database/userDatabase";
import { Fields } from "../../interfaces/generics";
import USER_ROLES from "../../roles/roles";
import IPlayer from "../../interfaces/IPlayer";
import { io } from "../..";

async function handleArtifactsSearchValidatedReset(
  isSearchValidated: boolean,
  mortimerSocketId: string
) {
  const validationOrResetString = isSearchValidated ? "validation" : "reset";

  console.log(`Handling artifacts search ${validationOrResetString}...`);

  await updateAcolytesAndArtifactsFields(isSearchValidated);

  const acolytesSocketIds = await getAcolytesSocketIds();

  const relevantSocketIds = [mortimerSocketId, ...acolytesSocketIds];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.ARTIFACTS_SEARCH_VALIDATION_RESET_MANAGED,
    isSearchValidated
  );

  console.log(
    `The artifacts search ${validationOrResetString} has been managed, & acolytes & Mortimer have been informed about it.`
  );
}

async function updateAcolytesAndArtifactsFields(isSearchValidated: boolean) {
  const changesToApplyToAcolytes: Fields = {
    found_artifacts: [],
  };

  if (isSearchValidated) {
    changesToApplyToAcolytes.has_completed_artifacts_search = true;
  } else {
    // If the search has been reset, set artifacts' "state" field to "active"
    await artifactDatabase.updateArtifactsByField(
      {},
      { state: ArtifactState.ACTIVE }
    );
  }

  // Update acolytes' "found_artifacts" & "has_completed_artifacts_search" fields (the latter just when the search has been validated)
  await userDatabase.updateUsersByField(
    { rol: USER_ROLES.ACOLYTE },
    changesToApplyToAcolytes
  );
}

async function getAcolytesSocketIds() {
  const acolytes: HydratedDocument<IPlayer>[] = await userDatabase.getAcolytes(
    "socketId"
  );

  const acolytesSocketIds = acolytes.map((acolyte) => acolyte.socketId);

  return acolytesSocketIds;
}

export default handleArtifactsSearchValidatedReset;
