import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../../../constants/fcm";
import { PlayerRole } from "../../../../constants/player";
import playerDb from "../../../../db/player.db";
import { sendMessageToOneOrMoreRecipients } from "../../../../services/fcm.services";

async function handleMortimerNotifiedForAngeloDeliver() {
  const mortimer = (await playerDb.getPlayerByField({
    rol: PlayerRole.MORTIMER,
  }))!;

  const data = {
    type: NotificationTypes.INFO,
    destination: ScreenChangingNotificationDestinations.HALL_SAGES,
  };

  const notificationBody =
    "Angelo has been detained, the acolytes are waiting for you to deliver him";
  const notificationTitle = "Summoned to The Hall of Sages";

  if (mortimer.pushToken) {
    await sendMessageToOneOrMoreRecipients(
      mortimer.pushToken,
      data,
      notificationBody,
      notificationTitle
    );
  }
}

export default handleMortimerNotifiedForAngeloDeliver;
