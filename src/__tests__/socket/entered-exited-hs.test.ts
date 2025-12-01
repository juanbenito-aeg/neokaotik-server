import { Socket } from "socket.io";
import { Types } from "mongoose";
import { handleAcolyteOrMortimerEnteredOrExitedHS } from "../../socket/handlers/entered-exited-hs";
import User from "../../database/userDatabase";
import { SocketServerToClientEvents } from "../../constants";
import { sendMessageToOneOrMoreRecipients } from "../../utils";

jest.mock("../../database/userDatabase");
jest.mock("../../utils");

jest.mock("socket.io", () => ({
  Socket: jest.fn().mockImplementation(() => ({
    emit: jest.fn(),
    broadcast: {
      emit: jest.fn(),
    },
  })),
}));

describe("entered-exited-hs socket event", () => {
  let socket: Socket;
  let mockAcknowledgeEvent: jest.Mock;

  beforeEach(() => {
    socket = new (Socket as unknown as jest.Mock)();
    mockAcknowledgeEvent = jest.fn();

    User.getAcolytes = jest.fn();
    (User.updateUserByField as jest.Mock).mockResolvedValue({
      _id: new Types.ObjectId(),
      is_inside_hs: true,
      rol: "Acolyte",
    });
  });

  it("should call updateUserByField to update player data when entered or exited HS", async () => {
    const acolyteOrMortimerId = new Types.ObjectId();
    const isInsideHS = true;

    await handleAcolyteOrMortimerEnteredOrExitedHS(
      acolyteOrMortimerId,
      isInsideHS,
      mockAcknowledgeEvent,
      socket
    );

    expect(User.updateUserByField).toHaveBeenCalledWith(
      { _id: acolyteOrMortimerId },
      { is_inside_hs: isInsideHS }
    );
  });

  it("should emit the ENTERED_EXITED_HS event", async () => {
    const acolyteOrMortimerId = new Types.ObjectId();
    const isInsideHS = true;

    await handleAcolyteOrMortimerEnteredOrExitedHS(
      acolyteOrMortimerId,
      isInsideHS,
      mockAcknowledgeEvent,
      socket
    );

    expect(socket.broadcast.emit).toHaveBeenCalledWith(
      SocketServerToClientEvents.ENTERED_EXITED_HS,
      acolyteOrMortimerId,
      isInsideHS
    );
  });

  it("should not call sendMessageToOneOrMoreRecipients if not all acolytes are inside HS or not all artifacts are collected", async () => {
    const acolyteOrMortimerId = new Types.ObjectId();
    const isInsideHS = true;

    (User.getAcolytes as jest.Mock).mockResolvedValue([
      {
        found_artifacts: [],
        is_inside_hs: true,
      },
      {
        found_artifacts: [
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
        ],
        is_inside_hs: false,
      },
    ]);

    await handleAcolyteOrMortimerEnteredOrExitedHS(
      acolyteOrMortimerId,
      isInsideHS,
      mockAcknowledgeEvent,
      socket
    );

    expect(sendMessageToOneOrMoreRecipients).not.toHaveBeenCalled();
  });
});
