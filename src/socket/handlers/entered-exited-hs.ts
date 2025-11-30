import { Types } from "mongoose";
import User from "../../database/userDatabase";
import USER_ROLES from "../../roles/roles";
import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
  SocketServerToClientEvents,
} from "../../constants";
import { sendMessageToOneOrMoreRecipients } from "../../utils";
import { Socket } from "socket.io";

async function handleAcolyteOrMortimerEnteredOrExitedHS(
  acolyteOrMortimerId: Types.ObjectId,
  isInsideHS: boolean,
  socket: Socket
) {
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

  if (updatedPlayer!.rol === USER_ROLES.ACOLYTE) {
    const { allArtifactsCollected, allAcolytesInsideHS } =
      await checkAcolytesStatus();

    if (allAcolytesInsideHS && allArtifactsCollected) {
      sendAcolytesAreInsideHSNotification();
    }
  }

  socket.broadcast.emit(
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
  const fieldToFilterBy = { rol: USER_ROLES.MORTIMER };
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
