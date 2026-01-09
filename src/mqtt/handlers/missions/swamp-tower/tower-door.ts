import io from "../../../../config/sockets";
import client from "../../../../config/mqtt";
import {
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../../../constants/fcm";
import { MqttTopics } from "../../../../constants/mqtt";
import { SocketServerToClientEvents } from "../../../../constants/socket";
import playerDb from "../../../../db/player.db";
import { PlayerRole } from "../../../../constants/player";
import { sendMessageToOneOrMoreRecipients } from "../../../../services/fcm.services";
import IPlayer from "../../../../interfaces/IPlayer";

async function handlerTowerDoor(cardId: string) {
  const acolyte = await playerDb.getPlayerByField({ card_id: cardId });
  const newStatus = {
    is_in_tower_entrance: !acolyte!.is_in_tower_entrance,
    is_inside_tower: !acolyte!.is_inside_tower,
  };
  const updatedAcolyte = await playerDb.updatePlayerByField(
    { card_id: cardId },
    newStatus
  );

  if (updatedAcolyte?.socketId) {
    const acolyteData = {
      is_in_tower_entrance: updatedAcolyte.is_in_tower_entrance ?? false,
      is_inside_tower: updatedAcolyte.is_inside_tower ?? false,
    };

    io.to(updatedAcolyte.socketId).emit(
      SocketServerToClientEvents.ACOLYTE_TOWER_ACCESS,
      acolyteData
    );

    if (!updatedAcolyte.isBetrayer) {
      await sendAcolyteEnteredExitedNotification(updatedAcolyte);
    }

    client.publish(
      MqttTopics.TOWER_DOOR,
      JSON.stringify({ isDoorOpen: false })
    );
  } else {
    console.log("The acolyte's socketId was not found");
  }
}

async function sendAcolyteEnteredExitedNotification(acolyte: IPlayer) {
  const fieldToFilterBy = { rol: PlayerRole.MORTIMER };
  const fieldsToIncludeOrExclude = "pushToken";

  const mortimer = (await playerDb.getPlayerByField(
    fieldToFilterBy,
    fieldsToIncludeOrExclude
  ))!;

  if (mortimer.pushToken) {
    const notificationBody = acolyte.is_inside_tower
      ? `${acolyte.nickname} entered the Swamp Tower!`
      : `${acolyte.nickname} exited the Swamp Tower!`;
    const notificationTitle = "Swamp Tower";
    const data = {
      type: NotificationTypes.SUCCESS,
      destination: ScreenChangingNotificationDestinations.SWAMP_TOWER,
      email: acolyte.email,
      is_inside_tower: String(acolyte.is_inside_tower),
    };

    await sendMessageToOneOrMoreRecipients(
      mortimer.pushToken,
      data,
      notificationBody,
      notificationTitle
    );
  }
}

export { handlerTowerDoor, sendAcolyteEnteredExitedNotification };
