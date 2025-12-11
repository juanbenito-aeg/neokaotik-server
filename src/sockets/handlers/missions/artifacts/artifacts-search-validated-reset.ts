import { ArtifactState } from "../../../../constants/general";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import artifactDb from "../../../../db/artifact.db";
import playerDb from "../../../../db/player.db";
import { Fields } from "../../../../interfaces/generics";
import { PlayerRole } from "../../../../constants/player";
import { io } from "../../../..";
import { getAcolytesSocketId } from "../../../../helpers/socket.helpers";

async function handleArtifactsSearchValidatedReset(
  isSearchValidated: boolean,
  mortimerSocketId: string
) {
  const validationOrResetString = isSearchValidated ? "validation" : "reset";

  console.log(`Handling artifacts search ${validationOrResetString}...`);

  await updateAcolytesAndArtifactsFields(isSearchValidated);

  const acolytesSocketId = await getAcolytesSocketId();

  const relevantSocketIds = [mortimerSocketId, ...acolytesSocketId];

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
    await artifactDb.updateArtifactsByField(
      {},
      { state: ArtifactState.ACTIVE }
    );
  }

  // Update acolytes' "found_artifacts" & "has_completed_artifacts_search" fields (the latter just when the search has been validated)
  await playerDb.updatePlayersByField(
    { rol: PlayerRole.ACOLYTE },
    changesToApplyToAcolytes
  );
}

export default handleArtifactsSearchValidatedReset;
