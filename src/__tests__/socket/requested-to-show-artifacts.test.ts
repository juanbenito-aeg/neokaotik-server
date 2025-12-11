import handleRequestedToShowArtifacts from "../../socket/handlers/requested-to-show-artifacts";
import { SocketServerToClientEvents } from "../../constants/socket";
import { io } from "../../index";

jest.clearAllMocks();

describe("handleRequestedToShowArtifacts", () => {
  let mockEmit: jest.Mock;
  let mockTo: jest.Mock;

  beforeEach(() => {
    mockEmit = jest.fn();
    mockTo = jest.fn().mockReturnValue({ emit: mockEmit });

    jest.spyOn(io, "to").mockImplementation(mockTo);
  });

  it("should emit the REQUESTED_TO_SHOW_ARTIFACTS event", async () => {
    await handleRequestedToShowArtifacts();

    expect(mockEmit).toHaveBeenCalledWith(
      SocketServerToClientEvents.REQUESTED_TO_SHOW_ARTIFACTS
    );
  });
});
