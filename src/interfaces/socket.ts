import {
  SocketServerToClientEvents,
  SocketClientToServerEvents,
} from "../constants";

// Declaration of the events used when sending and broadcasting events to the client
interface ServerToClientEvents {
  [SocketServerToClientEvents.ACOLYTE_DISCONNECTED]: (
    acolyteEmail: string
  ) => void;
  [SocketServerToClientEvents.ACOLYTE_INSIDE_OUTSIDE_LAB]: (
    updatedAcolyteData: AcolyteDataToBroadcast
  ) => void;
}

// Declaration of the events used when receiving events from the client
interface ClientToServerEvents {
  [SocketClientToServerEvents.CONNECTION_OPEN]: (userEmail: string) => void;
  [SocketClientToServerEvents.ACCESS_TO_EXIT_FROM_LAB]: (
    acolyteEmail: string,
    isInside: boolean
  ) => void;
}

interface AcolyteDataToBroadcast {
  email: string;
  isInside: boolean;
  nickname: string;
  avatar: string;
}

interface FieldsToUseInDisconnection {
  socketId: string;
  isInside?: boolean;
}

export type {
  ServerToClientEvents,
  ClientToServerEvents,
  AcolyteDataToBroadcast,
  FieldsToUseInDisconnection,
};
