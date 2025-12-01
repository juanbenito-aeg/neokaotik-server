import { Socket } from "socket.io";
import handleRequestedToShowArtifacts from "../../socket/handlers/requested-to-show-artifacts";
import { SocketServerToClientEvents } from "../../constants";

jest.mock("socket.io", () => ({
  Socket: jest.fn().mockImplementation(() => ({
    emit: jest.fn(),
  })),
}));

describe("handleRequestedToShowArtifacts", () => {
  let socket: any;

  beforeEach(() => {
    socket = new (Socket as unknown as jest.Mock)();
  });

  it("should emit the REQUESTED_TO_SHOW_ARTIFACTS event", () => {
    handleRequestedToShowArtifacts(socket);

    expect(socket.emit).toHaveBeenCalledWith(
      SocketServerToClientEvents.REQUESTED_TO_SHOW_ARTIFACTS
    );
  });
});
