import { UserRole } from "../../constants/player";
import User from "../../database/userDatabase";
import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../constants/fcm";
import { sendMessageToOneOrMoreRecipients } from "../../utils";

async function handleAcolyteScrollPress(isPressed: boolean) {
  if (!isPressed) return;

  const fieldToFilterBy = { rol: UserRole.MORTIMER };
  const fieldsToIncludeOrExclude = "pushToken";

  const mortimer = (await User.getUserByField(
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

export { handleAcolyteScrollPress };
