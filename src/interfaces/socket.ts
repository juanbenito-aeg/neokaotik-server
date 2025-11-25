import {
  SocketServerToClientEvents,
  SocketClientToServerEvents,
} from "../constants";
import { Types } from "mongoose";
import { Location } from "./geolocalization";

// Declaration of the events used when sending and broadcasting events to the client
interface ServerToClientEvents {
  [SocketServerToClientEvents.ACOLYTE_DISCONNECTED]: (
    acolyteEmail: string
  ) => void;
  [SocketServerToClientEvents.ACOLYTE_INSIDE_OUTSIDE_LAB]: (
    updatedAcolyteData: AcolyteDataToBroadcast
  ) => void;
  [SocketServerToClientEvents.ACOLYTE_TOWER_ACCESS]: (
    acolyteData: AcolyteDataToAccessOrExitTower
  ) => void;
  [SocketServerToClientEvents.ACOLYTE_POSITION_CHANGED]: (
    acolyteId: Types.ObjectId,
    acolyteLocation: Location
  ) => void;
}

// Declaration of the events used when receiving events from the client
interface ClientToServerEvents {
  [SocketClientToServerEvents.CONNECTION_OPEN]: (userEmail: string) => void;
  [SocketClientToServerEvents.ACCESS_TO_EXIT_FROM_LAB]: (
    acolyteEmail: string,
    isInside: boolean
  ) => void;
  [SocketClientToServerEvents.INSIDE_OUTSIDE_TOWER_ENTRANCE]: (
    acolyteIsInEntranceTower: boolean
  ) => void;
  [SocketClientToServerEvents.REMOVE_SPELL_PRESS]: () => void;
  [SocketClientToServerEvents.ACOLYTE_MOVED]: (
    acolyteId: Types.ObjectId,
    acolyteLocation: Location
  ) => void;
}

interface AcolyteDataToBroadcast {
  email: string;
  isInside: boolean;
  nickname: string;
  avatar: string;
}

interface AcolyteDataToAccessOrExitTower {
  is_in_tower_entrance: boolean;
  is_inside_tower: boolean;
}

interface FieldsToUseInDisconnection {
  socketId: string;
  isInside?: boolean;
  is_in_tower_entrance?: boolean;
  is_inside_tower?: boolean;
}

export type {
  ServerToClientEvents,
  ClientToServerEvents,
  AcolyteDataToBroadcast,
  FieldsToUseInDisconnection,
};
