import client from "../../../../config/mqtt";
import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../../../constants/fcm";
import { MqttTopics } from "../../../../constants/mqtt";
import playerDb from "../../../../db/player.db";
import { PlayerRole } from "../../../../constants/player";
import { sendMessageToOneOrMoreRecipients } from "../../../../services/fcm.services";

async function handleTowerCardid(cardId: string) {
  const acolyteWithReceivedCardId = await getAcolyteWithReceivedCardId(cardId);

  let messageToSendToClient = "";

  if (!acolyteWithReceivedCardId) {
    console.log(
      "The card ID is not registered in the DB, so the access to the Swamp Tower has been denied."
    );

    await sendUnauthorizedAccessMessageToMortimer();

    messageToSendToClient = "denied";
  } else if (
    acolyteWithReceivedCardId.is_in_tower_entrance ||
    acolyteWithReceivedCardId.is_inside_tower
  ) {
    console.log(
      "The card ID is registered in the DB, so the access to the Swamp Tower has been authorized."
    );

    messageToSendToClient = "authorized";
  }

  if (messageToSendToClient) {
    client.publish(MqttTopics.TOWER_ACCESS, messageToSendToClient);
  } else {
    console.log(
      "As the card ID belongs to an acolyte whose 'is_in_tower_entrance' & 'is_inside_tower' fields are set to 'false', no message is published."
    );
  }
}

async function getAcolyteWithReceivedCardId(cardId: string) {
  const fieldToFilterBy = { card_id: cardId };
  const fieldsToIncludeOrExclude = "is_in_tower_entrance is_inside_tower";

  const acolyteWithReceivedCardId = await playerDb.getPlayerByField(
    fieldToFilterBy,
    fieldsToIncludeOrExclude
  );

  return acolyteWithReceivedCardId;
}

async function sendUnauthorizedAccessMessageToMortimer() {
  const fieldToFilterBy = { rol: PlayerRole.MORTIMER };
  const fieldsToIncludeOrExclude = "pushToken";

  const mortimer = (await playerDb.getPlayerByField(
    fieldToFilterBy,
    fieldsToIncludeOrExclude
  ))!;

  if (mortimer.pushToken) {
    const data = {
      type: NotificationTypes.ERROR,
      destination: ScreenChangingNotificationDestinations.SWAMP_TOWER,
    };

    const notificationBody =
      "An unauthorized bastard tried to enter the Swamp Tower!";
    const notificationTitle = "Swamp Tower";

    await sendMessageToOneOrMoreRecipients(
      mortimer.pushToken,
      data,
      notificationBody,
      notificationTitle
    );
  }
}

export default handleTowerCardid;
