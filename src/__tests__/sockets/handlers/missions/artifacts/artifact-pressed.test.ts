import { Types } from "mongoose";
import io from "../../../../../config/sockets";
import { ArtifactState } from "../../../../../constants/general";
import artifactDb from "../../../../../db/artifact.db";
import handleArtifactPressed from "../../../../../sockets/handlers/missions/artifacts/artifact-pressed";
import { Location } from "../../../../../interfaces/geolocalization";

jest.mock("../../../../../db/player.db");
jest.mock("../../../../../db/artifact.db");
jest.mock("../../../../../helpers/socket.helpers");

describe("'handleArtifactPressed' socket event handler", () => {
  let mockEmit: jest.Mock;
  let mockTo: jest.Mock;

  beforeEach(() => {
    mockEmit = jest.fn();
    mockTo = jest.fn().mockReturnValue({ emit: mockEmit });

    jest.spyOn(io, "to").mockImplementation(mockTo);
  });

  const acolyteId = new Types.ObjectId();
  const acolyteLocation: Location = {
    type: "Point",
    coordinates: [-34567, 323443],
  };
  const artifactId = new Types.ObjectId();
  const acknowledgeEvent = () => {};
  const acolyteSocketId = "acolyte's socket ID";

  it("should inform just the acolyte that has pressed the artifact about a failed collection", async () => {
    (artifactDb.getArtifactById as jest.Mock).mockResolvedValue({
      state:
        ArtifactState.COLLECTED /* An acolyte already owns the artifact, so trying to take it again is considered a failed collection */,
      location: { type: "Point", coordinates: [-34567, 323444] },
    });

    await handleArtifactPressed(
      acolyteId,
      acolyteLocation,
      artifactId,
      acknowledgeEvent,
      acolyteSocketId
    );

    expect(mockTo).toHaveBeenCalledWith([acolyteSocketId]);
  });
});
