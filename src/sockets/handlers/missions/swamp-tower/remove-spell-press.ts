import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../../../constants/fcm";
import playerDb from "../../../../database/userDatabase";
import { UserRole } from "../../../../constants/player";
import { sendMessageToOneOrMoreRecipients } from "../../../../utils";

async function handleRemoveSpellPress() {
  console.log("Mortimer has pressed the 'Remove spell' button.");

  await updateAcolytesSummonedToHosField();
  console.log(
    "Acolytes' 'has_been_summoned_to_hos' field has been set to true."
  );

  await sendSummonedToHosMessage();
  console.log(
    "Acolytes have been summoned to The Hall of Sages & informed about it via a push notification."
  );
}

async function updateAcolytesSummonedToHosField() {
  const fieldToFilterBy = { rol: UserRole.ACOLYTE };
  const changeToApply = {
    has_been_summoned_to_hos: true,
  };

  await playerDb.updateUsersByField(fieldToFilterBy, changeToApply);
}

async function sendSummonedToHosMessage() {
  const acolytes = await playerDb.getAcolytes();
  const acolytesPushToken = acolytes.map((acolyte) => acolyte.pushToken);

  const data = {
    type: NotificationTypes.INFO,
    destination: ScreenChangingNotificationDestinations.HALL_SAGES,
  };

  const notificationBody = "Mortimer summons you to The Hall of Sages.";
  const notificationTitle = "Summoned to The Hall of Sages";

  await sendMessageToOneOrMoreRecipients(
    acolytesPushToken,
    data,
    notificationBody,
    notificationTitle
  );
}

export default handleRemoveSpellPress;
