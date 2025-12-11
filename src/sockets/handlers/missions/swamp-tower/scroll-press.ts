import { PlayerRole } from "../../../../constants/player";
import playerDb from "../../../../db/player.db";
import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../../../constants/fcm";
import { sendMessageToOneOrMoreRecipients } from "../../../../services/fcm.services";

async function handleScrollPress(isPressed: boolean) {
  if (!isPressed) return;

  const fieldToFilterBy = { rol: PlayerRole.MORTIMER };
  const fieldsToIncludeOrExclude = "pushToken";

  const mortimer = (await playerDb.getPlayerByField(
    fieldToFilterBy,
    fieldsToIncludeOrExclude
  ))!;

  if (mortimer.pushToken) {
    const notificationBody = "Scroll found.";
    const notificationTitle = "Acolyte Discovery";
    const data = {
      type: NotificationTypes.INFO,
      destination: ScreenChangingNotificationDestinations.REMOVE_SPEEL,
    };

    await sendMessageToOneOrMoreRecipients(
      mortimer.pushToken,
      data,
      notificationBody,
      notificationTitle
    );
  }
}

export default handleScrollPress;
