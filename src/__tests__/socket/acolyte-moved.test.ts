import { Types } from "mongoose";
import { io } from "../..";
import handleAcolyteMoved from "../../socket/handlers/acolyte-moved";
import { Location } from "../../interfaces/geolocalization";
import { SocketServerToClientEvents } from "../../constants";

describe("handleAcolyteMoved", () => {
  let mockEmit: any;
  let mockTo: any;

  beforeEach(() => {
    mockEmit = jest.fn();
    mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
    jest.spyOn(io, "to").mockImplementation(mockTo);
  });

  it("should emit when acolyte position changed", async () => {
    const acolyteId = new Types.ObjectId();
    const location: Location = { type: "Point", coordinates: [-23464, 23456] };

    await handleAcolyteMoved(acolyteId, location);

    expect(mockEmit).toHaveBeenCalledWith(
      SocketServerToClientEvents.ACOLYTE_POSITION_CHANGED,
      acolyteId,
      location
    );
  });
});
