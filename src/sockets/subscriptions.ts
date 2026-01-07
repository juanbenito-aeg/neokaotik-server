import { Socket } from "socket.io";
import {
  SocketClientToServerEvents,
  SocketGeneralEvents,
} from "../constants/socket";
import handleAccessToExitFromLab from "./handlers/missions/angelo-lab/access-to-exit-from-lab";
import handleAcolyteInsideOutsideTower from "./handlers/missions/swamp-tower/acolyte-inside-outside-tower";
import { Types } from "mongoose";
import handleScrollPress from "./handlers/missions/swamp-tower/scroll-press";
import handleRemoveSpellPress from "./handlers/missions/swamp-tower/remove-spell-press";
import handleAcolyteMoved from "./handlers/missions/artifacts/acolyte-moved";
import handleArtifactPressed from "./handlers/missions/artifacts/artifact-pressed";
import handleRequestedToShowArtifacts from "./handlers/missions/artifacts/requested-to-show-artifacts";
import handleArtifactsSearchValidatedReset from "./handlers/missions/artifacts/artifacts-search-validated-reset";
import { Location } from "../interfaces/geolocalization";
import { VoidFunction } from "../interfaces/generics";
import handleConnectionOpen from "./handlers/connections/connection-open";
import handlePlayerEnteredExitedHS from "./handlers/missions/artifacts/player-entered-exited-hs";
import handleDisconnection from "./handlers/connections/disconnection";
import handleAcolyteAcceptedBetrayal from "./handlers/missions/angelo-betrayer/acolyte-accepted-betrayal";
import handleAngeloSubdued from "./handlers/missions/angelo-betrayer/angelo-subdued";
import handleAcolyteRested from "./handlers/missions/decay-flesh/acolyte-rested";
import { handleAcolyteInfected } from "./handlers/missions/decay-flesh/acolyte-infected";
import handleAcolyteCursed from "./handlers/missions/decay-flesh/acolyte-cursed";
import handleMortimerAidedAcolyte from "./handlers/missions/decay-flesh/mortimer-aided-acolyte";
import { AidType } from "../constants/general";
import handleMortimerNotifiedForAngeloDeliver from "./handlers/missions/angelo-betrayer/mortimer-notified-for-Angelo's-deliver";
import handleAngeloDelivered from "./handlers/missions/angelo-betrayer/angelo-delivered";
import handleAngeloTrialBegan from "./handlers/missions/angelo-trial/angelo-trial-began";

function subscribeToEvents(socket: Socket) {
  console.log(
    `The client with the id "${socket.id}" connected to the server socket.`
  );

  socket.on(
    SocketClientToServerEvents.CONNECTION_OPEN,
    (playerEmail: string) => {
      handleConnectionOpen(socket, playerEmail);
    }
  );

  socket.on(
    SocketClientToServerEvents.PLAYER_ENTERED_EXITED_HS,
    handlePlayerEnteredExitedHS
  );

  socket.on(
    SocketClientToServerEvents.REQUESTED_TO_SHOW_ARTIFACTS,
    handleRequestedToShowArtifacts
  );

  socket.on(
    SocketClientToServerEvents.ACOLYTE_INSIDE_OUTSIDE_TOWER,
    (isInTowerEntrance: boolean) => {
      handleAcolyteInsideOutsideTower(socket.id, isInTowerEntrance);
    }
  );

  socket.on(
    SocketClientToServerEvents.ACCESS_TO_EXIT_FROM_LAB,
    (acolyteEmail: string, isInside: boolean) => {
      handleAccessToExitFromLab(socket.id, acolyteEmail, isInside);
    }
  );

  socket.on(SocketClientToServerEvents.SCROLL_PRESS, handleScrollPress);

  socket.on(
    SocketClientToServerEvents.REMOVE_SPELL_PRESS,
    handleRemoveSpellPress
  );

  socket.on(SocketClientToServerEvents.ACOLYTE_MOVED, handleAcolyteMoved);

  socket.on(
    SocketClientToServerEvents.ARTIFACT_PRESSED,
    (
      acolyteId: Types.ObjectId,
      acolyteLocation: Location,
      artifactId: Types.ObjectId,
      acknowledgeEvent: VoidFunction
    ) => {
      handleArtifactPressed(
        acolyteId,
        acolyteLocation,
        artifactId,
        acknowledgeEvent,
        socket.id
      );
    }
  );

  socket.on(
    SocketClientToServerEvents.ARTIFACTS_SEARCH_VALIDATED_RESET,
    (isSearchValidated: boolean) => {
      handleArtifactsSearchValidatedReset(isSearchValidated, socket.id);
    }
  );

  socket.on(
    SocketClientToServerEvents.ACOLYTE_ACCEPTED_BETRAYAL,
    handleAcolyteAcceptedBetrayal
  );

  socket.on(SocketClientToServerEvents.ANGELO_SUBDUED, handleAngeloSubdued);

  socket.on(
    SocketClientToServerEvents.ACOLYTE_RESTED,
    (acolyteId: Types.ObjectId) => {
      handleAcolyteRested(acolyteId, socket.id);
    }
  );

  socket.on(SocketClientToServerEvents.ACOLYTE_INFECTED, handleAcolyteInfected);

  socket.on(
    SocketClientToServerEvents.ACOLYTE_CURSED,
    (acolyteId: Types.ObjectId) => {
      handleAcolyteCursed(acolyteId);
    }
  );

  socket.on(
    SocketClientToServerEvents.MORTIMER_AIDED_ACOLYTE,
    (
      acolyteId: Types.ObjectId,
      aidType: AidType,
      diseaseId?: Types.ObjectId
    ) => {
      handleMortimerAidedAcolyte(acolyteId, aidType, diseaseId);
    }
  );

  socket.on(
    SocketClientToServerEvents.MORTIMER_NOTIFIED_FOR_ANGELO_DELIVERY,
    () => {
      handleMortimerNotifiedForAngeloDeliver();
    }
  );

  socket.on(SocketClientToServerEvents.ANGELO_DELIVERED, () => {
    handleAngeloDelivered();
  });

  socket.on(SocketClientToServerEvents.ANGELO_TRIAL_BEGAN, () => {
    handleAngeloTrialBegan();
  });

  socket.on(SocketGeneralEvents.DISCONNECT, () => {
    handleDisconnection(socket);
  });
}

export default subscribeToEvents;
