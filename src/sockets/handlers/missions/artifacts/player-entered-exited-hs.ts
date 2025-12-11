import { Types } from "mongoose";
import playerDb from "../../../../db/player.db";
import { PlayerRole } from "../../../../constants/player";
import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../../../constants/fcm";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import { sendMessageToOneOrMoreRecipients } from "../../../../services/fcm.services";
import { VoidFunction } from "../../../../interfaces/generics";
import { io } from "../../../..";

async function handlePlayerEnteredExitedHS(
  playerId: Types.ObjectId,
  isInsideHS: boolean,
  acknowledgeEvent: VoidFunction
) {
  // Make the client know the event has been received, so that it does not have to emit it again
  acknowledgeEvent();

  const updatedPlayer = await playerDb.updatePlayerByField(
    { _id: playerId },
    { is_inside_hs: isInsideHS }
  );

  const enteredOrExited = updatedPlayer!.is_inside_hs ? "entered" : "exited";

  console.log(
    `${
      updatedPlayer!.name
    } has ${enteredOrExited} The Hall of Sages with great success.`
  );

  if (updatedPlayer!.rol === PlayerRole.ACOLYTE) {
    const { allArtifactsCollected, allAcolytesInsideHS } =
      await checkAcolytesStatus();

    if (allAcolytesInsideHS && allArtifactsCollected) {
      sendAcolytesAreInsideHSNotification();
    }
  }

  io.emit(
    SocketServerToClientEvents.PLAYER_ENTERED_EXITED_HS,
    playerId,
    isInsideHS
  );
}

async function checkAcolytesStatus() {
  const acolytes = await playerDb.getAcolytes();

  const allFoundArtifacts = acolytes.reduce((accumulator, acolyte) => {
    if (acolyte.found_artifacts) {
      accumulator.push(...acolyte.found_artifacts);
    }

    return accumulator;
  }, [] as Types.ObjectId[]);

  const allArtifactsCollected = allFoundArtifacts.length === 4;

  const allAcolytesInsideHS = acolytes.reduce((accumulator, acolyte) => {
    if (!acolyte.is_inside_hs) {
      return false;
    }

    return accumulator;
  }, true);

  return { allArtifactsCollected, allAcolytesInsideHS };
}

async function sendAcolytesAreInsideHSNotification() {
  const fieldToFilterBy = { rol: PlayerRole.MORTIMER };
  const fieldsToIncludeOrExclude = "pushToken";

  const mortimer = (await playerDb.getPlayerByField(
    fieldToFilterBy,
    fieldsToIncludeOrExclude
  ))!;

  if (mortimer.pushToken) {
    const notificationBody = "All acolytes have gathered in The Hall of Sages.";
    const notificationTitle = "Acolytes in The Hall of Sages";
    const data = {
      type: NotificationTypes.INFO,
      destination: ScreenChangingNotificationDestinations.HALL_SAGES,
    };

    await sendMessageToOneOrMoreRecipients(
      mortimer.pushToken,
      data,
      notificationBody,
      notificationTitle
    );
  }
}

export default handlePlayerEnteredExitedHS;
