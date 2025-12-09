import { Types } from "mongoose";
import { io } from "../..";
import { ArtifactState } from "../../constants/general";
import artifactDatabase from "../../database/artifactDatabase";
import handleArtifactPressed from "../../socket/handlers/artifact-pressed";
import { Location } from "../../interfaces/geolocalization";

jest.mock("../../database/userDatabase");
jest.mock("../../database/artifactDatabase");
jest.mock("../../helpers/socket.helpers");

describe("handleArtifactPressed", () => {
  let mockEmit: jest.Mock;
  let mockTo: jest.Mock;

  beforeEach(() => {
    mockEmit = jest.fn();
    mockTo = jest.fn().mockReturnValue({ emit: mockEmit });

    jest.spyOn(io, "to").mockImplementation(mockTo);
  });

  const location: Location = { type: "Point", coordinates: [-34567, 323443] };
  const acolyteId = new Types.ObjectId();
  const artifactId = new Types.ObjectId();

  it("should not collect artifact if it is already collected", async () => {
    (artifactDatabase.getArtifactById as jest.Mock).mockResolvedValue({
      state: ArtifactState.COLLECTED,
      location: { type: "Point", coordinates: [-34567, 323444] },
    });

    await handleArtifactPressed(acolyteId, location, artifactId);

    expect(mockEmit).not.toHaveBeenCalled();
  });
});
