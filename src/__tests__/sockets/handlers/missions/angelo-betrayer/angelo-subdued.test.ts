import { Socket } from "socket.io";
import {
  SocketClientToServerEvents,
  SocketServerToClientEvents,
} from "../../../../../constants/socket";
import subscribeToEvents from "../../../../../sockets/subscriptions";
import io from "../../../../../config/sockets";

jest.mock("../../../../../db/player.db");
jest.mock("../../../../../config/sockets");

const mockedSocket = { on: jest.fn() };

describe("'handleAngeloSubdued' socket event handler", () => {
  it("should emit the 'Angelo subdued' socket event to every connected client", (done) => {
    mockedSocket.on.mockImplementation(async (event, callback) => {
      if (event === SocketClientToServerEvents.ANGELO_SUBDUED) {
        await callback();

        expect(io.emit).toHaveBeenCalledWith(
          SocketServerToClientEvents.ANGELO_SUBDUED
        );

        done();
      }
    });

    subscribeToEvents(mockedSocket as unknown as Socket);
  });
});
