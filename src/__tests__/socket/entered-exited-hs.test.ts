import { Types } from "mongoose";
import { handleAcolyteOrMortimerEnteredOrExitedHS } from "../../socket/handlers/entered-exited-hs";
import Player from "../../db/player.db";
import { SocketServerToClientEvents } from "../../constants/socket";
import { sendMessageToOneOrMoreRecipients } from "../../services/fcm.services";
import { io } from "../../index";

jest.mock("../../db/player.db");
jest.mock("../../services/fcm.services");

describe("entered-exited-hs socket event", () => {
  let mockEmit: any;
  let mockAcknowledgeEvent: jest.Mock;

  beforeEach(() => {
    mockEmit = jest.fn();
    jest.spyOn(io, "emit").mockImplementation(mockEmit);

    mockAcknowledgeEvent = jest.fn();

    Player.getAcolytes = jest.fn();
    (Player.updatePlayerByField as jest.Mock).mockResolvedValue({
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
      mockAcknowledgeEvent
    );

    expect(Player.updatePlayerByField).toHaveBeenCalledWith(
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
      mockAcknowledgeEvent
    );

    expect(io.emit).toHaveBeenCalledWith(
      SocketServerToClientEvents.ENTERED_EXITED_HS,
      acolyteOrMortimerId,
      isInsideHS
    );
  });

  it("should not call sendMessageToOneOrMoreRecipients if not all acolytes are inside HS or not all artifacts are collected", async () => {
    const acolyteOrMortimerId = new Types.ObjectId();
    const isInsideHS = true;

    (Player.getAcolytes as jest.Mock).mockResolvedValue([
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
      mockAcknowledgeEvent
    );

    expect(sendMessageToOneOrMoreRecipients).not.toHaveBeenCalled();
  });
});
