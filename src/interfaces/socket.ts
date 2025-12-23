import {
  SocketServerToClientEvents,
  SocketClientToServerEvents,
} from "../constants/socket";
import { Types } from "mongoose";
import { Location } from "./geolocalization";
import { Fields, VoidFunction } from "./generics";

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
  [SocketServerToClientEvents.ARTIFACT_PRESS_MANAGED]: (
    isArtifactCollected: boolean,
    acolyteId?: Types.ObjectId,
    artifactId?: Types.ObjectId
  ) => void;
  [SocketServerToClientEvents.PLAYER_ENTERED_EXITED_HS]: (
    acolyteOrMortimerId: Types.ObjectId,
    isInsideHS: boolean
  ) => void;
  [SocketServerToClientEvents.REQUESTED_TO_SHOW_ARTIFACTS]: () => void;
  [SocketServerToClientEvents.ARTIFACTS_SEARCH_VALIDATION_RESET_MANAGED]: (
    acolytesHaveCompletedArtifactsSearch: boolean
  ) => void;
  [SocketServerToClientEvents.ACOLYTE_BECAME_BETRAYER]: (
    acolyteId: Types.ObjectId,
    acolyteUpdatedFields: Fields
  ) => void;
  [SocketServerToClientEvents.ANGELO_SUBDUED]: VoidFunction;
}

// Declaration of the events used when receiving events from the client
interface ClientToServerEvents {
  [SocketClientToServerEvents.CONNECTION_OPEN]: (userEmail: string) => void;
  [SocketClientToServerEvents.ACCESS_TO_EXIT_FROM_LAB]: (
    acolyteEmail: string,
    isInside: boolean
  ) => void;
  [SocketClientToServerEvents.ACOLYTE_INSIDE_OUTSIDE_TOWER]: (
    acolyteIsInEntranceTower: boolean
  ) => void;
  [SocketClientToServerEvents.REMOVE_SPELL_PRESS]: () => void;
  [SocketClientToServerEvents.ACOLYTE_MOVED]: (
    acolyteId: Types.ObjectId,
    acolyteLocation: Location
  ) => void;
  [SocketClientToServerEvents.ARTIFACT_PRESSED]: (
    acolyteId: Types.ObjectId,
    acolyteLocation: Location,
    artifactId: Types.ObjectId,
    acknowledgeEvent: VoidFunction
  ) => void;
  [SocketClientToServerEvents.PLAYER_ENTERED_EXITED_HS]: (
    acolyteOrMortimerId: Types.ObjectId,
    isInsideHS: boolean,
    acknowledgeEvent: VoidFunction
  ) => void;
  [SocketClientToServerEvents.REQUESTED_TO_SHOW_ARTIFACTS]: () => void;
  [SocketClientToServerEvents.ARTIFACTS_SEARCH_VALIDATED_RESET]: (
    isSearchValidated: boolean
  ) => void;
  [SocketClientToServerEvents.ACOLYTE_ACCEPTED_BETRAYAL]: (
    acolyteId: Types.ObjectId
  ) => void;
  [SocketClientToServerEvents.ANGELO_SUBDUED]: VoidFunction;
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
  is_inside_hs?: boolean;
}

export type {
  ServerToClientEvents,
  ClientToServerEvents,
  AcolyteDataToBroadcast,
  FieldsToUseInDisconnection,
};
