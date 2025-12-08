import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../constants/fcm";
import User from "../../database/userDatabase";
import USER_ROLES from "../../roles/roles";
import { sendMessageToOneOrMoreRecipients } from "../../utils";

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
  const fieldToFilterBy = { rol: USER_ROLES.ACOLYTE };
  const changeToApply = {
    has_been_summoned_to_hos: true,
  };

  await User.updateUsersByField(fieldToFilterBy, changeToApply);
}

async function sendSummonedToHosMessage() {
  const acolytes = await User.getAcolytes();
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
