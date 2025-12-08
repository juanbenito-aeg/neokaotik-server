import { Types } from "mongoose";
import artifactDatabase from "../../database/artifactDatabase";
import { ArtifactState, SocketServerToClientEvents } from "../../constants";
import userDatabase from "../../database/userDatabase";
import USER_ROLES from "../../roles/roles";
import { io } from "../..";
import { Location } from "../../interfaces/geolocalization";
import { getAcolytesSocketId } from "../../helpers/socket.helpers";

async function handleArtifactPressed(
  acolyteId: Types.ObjectId,
  acolyteLocation: Location,
  artifactId: Types.ObjectId
) {
  console.log(
    `Handling tap of acolyte with _id "${acolyteId}" on artifact with _id "${artifactId}"...`
  );

  const artifactAvailable = await isArtifactAvailable(artifactId);
  if (!artifactAvailable) {
    console.log(`Artifact with ID "${artifactId}" cannot be collected.`);
    return;
  }

  const distanceBetweenUserAndArtifact =
    await calculateDistanceBetweenUserAndArtifact(acolyteLocation, artifactId);

  if (distanceBetweenUserAndArtifact < 1) {
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

    // Emit "artifact collected" to acolytes & Mortimer

    const acolytesSocketIds = await getAcolytesSocketId();

    const { socketId: mortimerSocketId } = (await userDatabase.getUserByField(
      { rol: USER_ROLES.MORTIMER },
      "socketId"
    ))!;

    const acolytesAndMortimerSocketIds = [
      ...acolytesSocketIds,
      mortimerSocketId,
    ];

    io.to(acolytesAndMortimerSocketIds).emit(
      SocketServerToClientEvents.ARTIFACT_COLLECTED,
      acolyteId,
      artifactId
    );

    console.log(
      `Acolytes & Mortimer have been informed about artifact's (with _id "${artifactId}") collection.`
    );
  } else {
    console.log(
      `Distance between acolyte with _id "${acolyteId}" & artifact with _id "${artifactId}" is of 1 m or more, so the tap has had no effect`
    );
  }
}

async function isArtifactAvailable(artifactId: Types.ObjectId) {
  const acolytes = await userDatabase.getAcolytes();
  const artifact = await artifactDatabase.getArtifactById(artifactId, "state");

  const isArtifactAvailable = artifact?.state === ArtifactState.ACTIVE;

  if (!isArtifactAvailable) {
    console.log(`Artifact with ID ${artifactId} is not available`);
    return false;
  }

  const artifactHasBeenCollected = acolytes.find((acolyte) =>
    acolyte.found_artifacts?.includes(artifactId)
  );

  if (artifactHasBeenCollected) {
    console.log(`Artifact with ID ${artifactId} has already been collected.`);
    return false;
  }

  console.log(`Artifact with ID ${artifactId} is available for collection.`);
  return true;
}

async function calculateDistanceBetweenUserAndArtifact(
  acolyteLocation: Location,
  artifactId: Types.ObjectId
) {
  const [acolyteLongitude, acolyteLatitude] = acolyteLocation.coordinates;

  const artifact = await artifactDatabase.getArtifactById(
    artifactId,
    "location"
  );
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
