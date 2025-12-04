import { Socket } from "socket.io";
import User from "../../database/userDatabase";
import USER_ROLES from "../../roles/roles";
import { FieldsToUseInDisconnection } from "../../interfaces/socket";
import {
  SocketServerToClientEvents,
  SocketClientToServerEvents,
  SocketGeneralEvents,
} from "../../constants";
import { handleAccessToExitFromLab } from "./angelo-lab";
import { handleAcolyteTowerEntranceStatus } from "./acolyte-tower";
import { sendAcolyteEnteredExitedNotification } from "../../mqtt/handlers/tower-door";
import { HydratedDocument, Types } from "mongoose";
import IPlayer from "../../interfaces/IPlayer";
import { handleAcolyteScrollPress } from "./acolyte-scroll-press";
import handleRemoveSpellPress from "./remove-spell-press";
import handleAcolyteMoved from "./acolyte-moved";
import handleArtifactPressed from "./artifact-pressed";
import { handleAcolyteOrMortimerEnteredOrExitedHS } from "./entered-exited-hs";
import { VoidFunction } from "../../interfaces/generics";
import handleRequestedToShowArtifacts from "./requested-to-show-artifacts";
import handleArtifactsSearchValidatedReset from "./artifacts-search-validated-reset";
import { io } from "../..";
import { getNonAcolytePlayersSocketId } from "../../helpers/socket.helpers";
import { Location } from "../../interfaces/geolocalization";

function handleConnection(socket: Socket) {
  console.log("Client connected to the server socket.");

  socket.on(SocketClientToServerEvents.CONNECTION_OPEN, (userEmail: string) => {
    handleConnectionOpening(socket, userEmail);
  });

  socket.on(
    SocketClientToServerEvents.ENTERED_EXITED_HS,
    (
      acolyteOrMortimerId: Types.ObjectId,
      isInsideHS: boolean,
      acknowledgeEvent: VoidFunction
    ) => {
      handleAcolyteOrMortimerEnteredOrExitedHS(
        acolyteOrMortimerId,
        isInsideHS,
        acknowledgeEvent,
        socket
      );
    }
  );

  socket.on(SocketClientToServerEvents.REQUESTED_TO_SHOW_ARTIFACTS, () => {
    handleRequestedToShowArtifacts();
  });

  socket.on(
    SocketClientToServerEvents.INSIDE_OUTSIDE_TOWER_ENTRANCE,
    async (isInTowerEntrance: boolean) => {
      handleAcolyteTowerEntranceStatus(socket.id, isInTowerEntrance);
    }
  );

  socket.on(
    SocketClientToServerEvents.ACCESS_TO_EXIT_FROM_LAB,
    (acolyteEmail: string, isInside: boolean) => {
      handleAccessToExitFromLab(socket.id, acolyteEmail, isInside);
    }
  );

  socket.on(SocketClientToServerEvents.SCROLL_PRESS, (isPressed: boolean) => {
    handleAcolyteScrollPress(isPressed);
  });

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
      artifactId: Types.ObjectId
    ) => {
      handleArtifactPressed(acolyteId, acolyteLocation, artifactId, socket.id);
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

async function handleConnectionOpening(socket: Socket, userEmail: string) {
  console.log(`The user with the email "${userEmail}" opened a connection.`);

  await User.updateUserByField({ email: userEmail }, { socketId: socket.id });
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
  } else if (socketUser?.rol === USER_ROLES.ACOLYTE) {
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
    rol: USER_ROLES.MORTIMER,
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

export default handleConnection;
