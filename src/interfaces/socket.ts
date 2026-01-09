import {
  SocketServerToClientEvents,
  SocketClientToServerEvents,
} from "../constants/socket";
import { Types } from "mongoose";
import { Location } from "./geolocalization";
import { Fields, VoidFunction } from "./generics";
import { AidType } from "../constants/general";
import { VoteAngeloTrial } from "../constants/missions";

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
  [SocketServerToClientEvents.REQUESTED_TO_SHOW_ARTIFACTS]: VoidFunction;
  [SocketServerToClientEvents.ARTIFACTS_SEARCH_VALIDATION_RESET_MANAGED]: (
    acolytesHaveCompletedArtifactsSearch: boolean
  ) => void;
  [SocketServerToClientEvents.ACOLYTE_BECAME_BETRAYER]: (
    acolyteId: Types.ObjectId,
    acolyteUpdatedFields: Fields
  ) => void;
  [SocketServerToClientEvents.ANGELO_SUBDUED]: VoidFunction;
  [SocketServerToClientEvents.ACOLYTE_RESISTANCE_RESTORED]: (
    acolyteId: Types.ObjectId,
    acolyteUpdatedAttributes: Fields
  ) => void;
  [SocketServerToClientEvents.CRON_TASK_EXECUTED]: (
    acolyteId: Types.ObjectId,
    acolyteUpdatedFields: Fields
  ) => void;
  [SocketServerToClientEvents.ACOLYTE_INFECTED]: (
    acolyteId: Types.ObjectId,
    acolyteUpdatedFields: Fields
  ) => void;
  [SocketServerToClientEvents.ACOLYTE_CURSED]: (
    acolyteId: Types.ObjectId,
    acolyteUpdatedFields: Fields
  ) => void;
  [SocketServerToClientEvents.MORTIMER_AIDED_ACOLYTE]: (
    acolyteId: Types.ObjectId,
    acolyteUpdatedFields: Fields
  ) => void;
  [SocketServerToClientEvents.ANGELO_DELIVERED]: (
    angeloUpdatedFields: Fields
  ) => void;
  [SocketServerToClientEvents.PLAYER_VOTED_ANGELO_TRIAL]: (
    playerId: string,
    vote: VoteAngeloTrial
  ) => void;
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
  [SocketClientToServerEvents.REMOVE_SPELL_PRESS]: VoidFunction;
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
  [SocketClientToServerEvents.REQUESTED_TO_SHOW_ARTIFACTS]: VoidFunction;
  [SocketClientToServerEvents.ARTIFACTS_SEARCH_VALIDATED_RESET]: (
    isSearchValidated: boolean
  ) => void;
  [SocketClientToServerEvents.ACOLYTE_ACCEPTED_BETRAYAL]: (
    acolyteId: Types.ObjectId
  ) => void;
  [SocketClientToServerEvents.ANGELO_SUBDUED]: VoidFunction;
  [SocketClientToServerEvents.ACOLYTE_RESTED]: (
    acolyteId: Types.ObjectId
  ) => void;
  [SocketClientToServerEvents.ACOLYTE_INFECTED]: (
    acolyteId: Types.ObjectId,
    diseaseId: Types.ObjectId
  ) => void;
  [SocketClientToServerEvents.ACOLYTE_CURSED]: (
    acolyteId: Types.ObjectId
  ) => void;
  [SocketClientToServerEvents.MORTIMER_AIDED_ACOLYTE]: (
    acolyteId: Types.ObjectId,
    aidType: AidType,
    diseaseId?: Types.ObjectId
  ) => void;
  [SocketClientToServerEvents.ANGELO_DELIVERED]: VoidFunction;
  [SocketClientToServerEvents.ANGELO_TRIAL_BEGAN]: VoidFunction;
  [SocketClientToServerEvents.PLAYER_VOTED_ANGELO_TRIAL]: (
    playerId: string,
    vote: VoteAngeloTrial
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
  is_inside_hs?: boolean;
}

export type {
  ServerToClientEvents,
  ClientToServerEvents,
  AcolyteDataToBroadcast,
  FieldsToUseInDisconnection,
};
