import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../../../constants/fcm";
import { AngeloLocation } from "../../../../constants/missions";
import { PlayerRole } from "../../../../constants/player";
import playerDb from "../../../../db/player.db";
import { sendMessageToOneOrMoreRecipients } from "../../../../services/fcm.services";

async function handleAngeloTrialBegan() {
  const angelo = (await playerDb.getPlayerByField({ rol: PlayerRole.ANGELO }))!;

  if (angelo.location === AngeloLocation.HALL_SAGES) return;

  const updatedAngelo = (await playerDb.updatePlayerByField(
    { _id: angelo._id },
    { location: AngeloLocation.HALL_SAGES }
  ))!;

  const acolytes = (await playerDb.getPlayersByFields({
    isBetrayer: false,
    rol: PlayerRole.ACOLYTE,
  }))!;

  const acolytesPushToken = acolytes.map((acolyte) => {
    return acolyte.pushToken;
  });

  const nonAcolytes = (await playerDb.getPlayersByFields({
    rol: { $ne: "acolyte" },
  }))!;

  let nonAcolytesPushToken: string[] = [];

  nonAcolytes.map((nonAcolyte) => {
    if (nonAcolyte.rol !== PlayerRole.ANGELO) {
      nonAcolytesPushToken.push(nonAcolyte.pushToken);
    }
  });

  const playersPushToken = [...acolytesPushToken, ...nonAcolytesPushToken];

  const data = {
    type: NotificationTypes.INFO,
    destination: ScreenChangingNotificationDestinations.HALL_SAGES,
    angeloLocation: updatedAngelo.location!,
  };

  const notificationBody =
    "Angelo's trial is about to begin. Be prepared to judge";
  const notificationTitle = "Summoned to The Hall of Sages";

  await sendMessageToOneOrMoreRecipients(
    playersPushToken,
    data,
    notificationBody,
    notificationTitle
  );
}

export default handleAngeloTrialBegan;
