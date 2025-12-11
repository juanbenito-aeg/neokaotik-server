import { Socket } from "socket.io";
import User from "../database/userDatabase";
import { UserRole } from "../constants/player";
import { FieldsToUseInDisconnection } from "../interfaces/socket";
import {
  SocketServerToClientEvents,
  SocketClientToServerEvents,
  SocketGeneralEvents,
} from "../constants/socket";
import handleAccessToExitFromLab from "./handlers/missions/angelo-lab/access-to-exit-from-lab";
import handleAcolyteInsideOutsideTower from "./handlers/missions/swamp-tower/acolyte-inside-outside-tower";
import { sendAcolyteEnteredExitedNotification } from "../mqtt/handlers/tower-door";
import { HydratedDocument, Types } from "mongoose";
import IPlayer from "../interfaces/IPlayer";
import handleScrollPress from "./handlers/missions/swamp-tower/scroll-press";
import handleRemoveSpellPress from "./handlers/missions/swamp-tower/remove-spell-press";
import handleAcolyteMoved from "./handlers/missions/artifacts/acolyte-moved";
import handleArtifactPressed from "./handlers/missions/artifacts/artifact-pressed";
import handleRequestedToShowArtifacts from "./handlers/missions/artifacts/requested-to-show-artifacts";
import handleArtifactsSearchValidatedReset from "./handlers/missions/artifacts/artifacts-search-validated-reset";
import { io } from "../";
import { getNonAcolytePlayersSocketId } from "../helpers/socket.helpers";
import { Location } from "../interfaces/geolocalization";
import { VoidFunction } from "../interfaces/generics";
import handleConnectionOpen from "./handlers/connections/connection-open";
import handlePlayerEnteredExitedHS from "./handlers/missions/artifacts/player-entered-exited-hs";

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

  socket.on(SocketGeneralEvents.DISCONNECT, () => {
    handleDisconnection(socket);
  });
}

async function handleDisconnection(socket: Socket) {
  console.log("Client disconnected from the server socket.");

  const fieldToFilterBy: FieldsToUseInDisconnection = {
    socketId: socket.id,
  };

  const changesToApply: FieldsToUseInDisconnection = {
    socketId: "",
  };

  const socketUser = await User.getUserByField(fieldToFilterBy);

  if (socketUser?.isInside) {
    changesToApply.isInside = false;

    await notifyMortimerAboutAcolyteDisconnection(socket, socketUser);
  } else if (socketUser?.is_in_tower_entrance) {
    changesToApply.is_in_tower_entrance = false;
  } else if (socketUser?.is_inside_tower) {
    changesToApply.is_inside_tower = false;
  } else if (socketUser?.is_inside_hs) {
    changesToApply.is_inside_hs = false;

    // Reflect acolytes' & Mortimer's app closing in others' screen when they are inside The Hall of Sages
    socket.broadcast.emit(
      SocketServerToClientEvents.ENTERED_EXITED_HS,
      socketUser._id,
      false
    );
  } else if (socketUser?.rol === UserRole.ACOLYTE) {
    await informNonAcolytesAboutAcolyteExitFromSwamp(socketUser._id);
  }

  const updatedUser = (await User.updateUserByField(
    fieldToFilterBy,
    changesToApply
  ))!;

  if ("is_inside_tower" in changesToApply) {
    sendAcolyteEnteredExitedNotification(updatedUser);
  }
}

async function notifyMortimerAboutAcolyteDisconnection(
  socket: Socket,
  acolyte: HydratedDocument<IPlayer>
) {
  const mortimer = await User.getUserByField({
    rol: UserRole.MORTIMER,
  });
  const mortimerSocketId = mortimer?.socketId;

  if (mortimerSocketId) {
    socket
      .to(mortimerSocketId)
      .emit(SocketServerToClientEvents.ACOLYTE_DISCONNECTED, acolyte.email);
  }
}

async function informNonAcolytesAboutAcolyteExitFromSwamp(
  exitingAcolyteId: Types.ObjectId
) {
  const nonAcolytePlayersSocketId = await getNonAcolytePlayersSocketId();

  const nullLocation: Location = {
    type: "Point",
    coordinates: [0, 0],
  };

  // Reflect acolyte's app closing when they are inside "The Swamp" screen in non-acolyte players' app
  io.to(nonAcolytePlayersSocketId).emit(
    SocketServerToClientEvents.ACOLYTE_POSITION_CHANGED,
    exitingAcolyteId,
    nullLocation
  );
}

export default subscribeToEvents;
