import { Types } from "mongoose";
import User from "../../database/userDatabase";
import { PlayerRole } from "../../constants/player";
import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../constants/fcm";
import { SocketServerToClientEvents } from "../../constants/socket";
import { sendMessageToOneOrMoreRecipients } from "../../utils";
import { VoidFunction } from "../../interfaces/generics";
import { io } from "../..";

async function handleAcolyteOrMortimerEnteredOrExitedHS(
  acolyteOrMortimerId: Types.ObjectId,
  isInsideHS: boolean,
  acknowledgeEvent: VoidFunction
) {
  // Make the client know the event has been received, so that it does not have to emit it again
  acknowledgeEvent();

  const updatedPlayer = await User.updateUserByField(
    { _id: acolyteOrMortimerId },
    { is_inside_hs: isInsideHS }
  );

  const enteredOrExitedHS = updatedPlayer!.is_inside_hs ? "entered" : "exited";

  console.log(
    `${
      updatedPlayer!.name
    } has ${enteredOrExitedHS} The Hall of Sages with great success.`
  );

  if (updatedPlayer!.rol === PlayerRole.ACOLYTE) {
    const { allArtifactsCollected, allAcolytesInsideHS } =
      await checkAcolytesStatus();

    if (allAcolytesInsideHS && allArtifactsCollected) {
      sendAcolytesAreInsideHSNotification();
    }
  }

  io.emit(
    SocketServerToClientEvents.ENTERED_EXITED_HS,
    acolyteOrMortimerId,
    isInsideHS
  );
}

async function checkAcolytesStatus() {
  const acolytes = await User.getAcolytes();

  const allFoundArtifacts = acolytes.reduce((acc, acolyte) => {
    if (acolyte.found_artifacts) {
      acc.push(...acolyte.found_artifacts);
    }

    return acc;
  }, [] as Types.ObjectId[]);

  const allArtifactsCollected = allFoundArtifacts.length === 4;

  const allAcolytesInsideHS = acolytes.reduce((acc, acolyte) => {
    if (!acolyte.is_inside_hs) {
      return false;
    }

    return acc;
  }, true);

  return { allArtifactsCollected, allAcolytesInsideHS };
}

async function sendAcolytesAreInsideHSNotification() {
  const fieldToFilterBy = { rol: PlayerRole.MORTIMER };
  const fieldsToIncludeOrExclude = "pushToken";

  const mortimer = (await User.getUserByField(
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

export { handleAcolyteOrMortimerEnteredOrExitedHS };
