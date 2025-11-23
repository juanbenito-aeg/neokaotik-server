import LivePosition from "../models/live-positionModel";

async function updateLivePositionByPlayer(
  playerId: string,
  newCoordinates: [number, number]
) {
  try {
    const updatedPosition = await LivePosition.findOneAndUpdate(
      { player: playerId },
      {
        $set: {
          location: {
            type: "Point",
            coordinates: newCoordinates,
          },
        },
      },
      { new: true }
    );

    return updatedPosition;
  } catch (err) {
    throw err;
  }
}

export { updateLivePositionByPlayer };
