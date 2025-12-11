import { Types } from "mongoose";
import artifactDb from "../../../../database/artifactDatabase";
import { ArtifactState } from "../../../../constants/general";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import playerDb from "../../../../database/userDatabase";
import { UserRole } from "../../../../constants/player";
import { io } from "../../../..";
import { Location } from "../../../../interfaces/geolocalization";
import { getAcolytesSocketId } from "../../../../helpers/socket.helpers";
import { VoidFunction } from "../../../../interfaces/generics";

async function handleArtifactPressed(
  acolyteId: Types.ObjectId,
  acolyteLocation: Location,
  artifactId: Types.ObjectId,
  acknowledgeEvent: VoidFunction,
  acolyteSocketId: string
) {
  // Make the client know the event has been received, so that it does not have to emit it again
  acknowledgeEvent();

  console.log(
    `Handling tap of acolyte with _id "${acolyteId}" on artifact with _id "${artifactId}"...`
  );

  let relevantSocketIds = [acolyteSocketId];
  let isArtifactCollected = true;

  const artifactAvailable = await isArtifactAvailable(artifactId);

  if (artifactAvailable) {
    const distanceBetweenUserAndArtifact =
      await calculateDistanceBetweenUserAndArtifact(
        acolyteLocation,
        artifactId
      );

    if (distanceBetweenUserAndArtifact < 1) {
      // Update pressed artifact's "state" field

      await artifactDb.updateArtifactsByField(
        { _id: artifactId },
        { state: ArtifactState.COLLECTED }
      );

      // Update collector's "found_artifacts" field

      const { found_artifacts } = (await playerDb.getUserByField(
        { _id: acolyteId },
        "found_artifacts"
      ))!;

      await playerDb.updateUserByField(
        { _id: acolyteId },
        { found_artifacts: [...found_artifacts!, artifactId] }
      );

      const acolytesSocketIds = await getAcolytesSocketId();

      const { socketId: mortimerSocketId } = (await playerDb.getUserByField(
        { rol: UserRole.MORTIMER },
        "socketId"
      ))!;

      relevantSocketIds = [...acolytesSocketIds, mortimerSocketId];
    } else {
      isArtifactCollected = false;

      console.log(
        `Distance between acolyte with _id "${acolyteId}" & artifact with _id "${artifactId}" is of 1 m or more, so the tap has had no effect.`
      );
    }
  }

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.ARTIFACT_PRESS_MANAGED,
    isArtifactCollected,
    isArtifactCollected ? acolyteId : undefined,
    isArtifactCollected ? artifactId : undefined
  );

  console.log(
    `Relevant players have been informed about artifact's (with _id "${artifactId}") successful/failed collection.`
  );
}

async function isArtifactAvailable(artifactId: Types.ObjectId) {
  const acolytes = await playerDb.getAcolytes();
  const artifact = await artifactDb.getArtifactById(artifactId, "state");

  const isArtifactAvailable = artifact?.state === ArtifactState.ACTIVE;

  if (!isArtifactAvailable) {
    console.log(`Artifact with _id "${artifactId}" is not available.`);
    return false;
  }

  const artifactHasBeenCollected = acolytes.find((acolyte) =>
    acolyte.found_artifacts?.includes(artifactId)
  );

  if (artifactHasBeenCollected) {
    console.log(
      `Artifact with _id "${artifactId}" has already been collected.`
    );
    return false;
  }

  console.log(`Artifact with _id "${artifactId}" is available for collection.`);
  return true;
}

async function calculateDistanceBetweenUserAndArtifact(
  acolyteLocation: Location,
  artifactId: Types.ObjectId
) {
  const [acolyteLongitude, acolyteLatitude] = acolyteLocation.coordinates;

  const artifact = await artifactDb.getArtifactById(artifactId, "location");
  const [artifactLongitude, artifactLatitude] = artifact!.location.coordinates;

  // Calculate distance between latitude/longitude points (φ is latitude, λ is longitude, R is earth’s radius)

  const R = 6371e3; // meters
  const φ1 = (acolyteLatitude! * Math.PI) / 180; // φ, λ in radians
  const φ2 = (artifactLatitude! * Math.PI) / 180;
  const Δφ = ((artifactLatitude! - acolyteLatitude!) * Math.PI) / 180;
  const Δλ = ((artifactLongitude! - acolyteLongitude!) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in meters

  return d;
}

export default handleArtifactPressed;
