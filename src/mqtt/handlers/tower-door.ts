import { HydratedDocument } from "mongoose";
import { client, io } from "../..";
import {
  MqttTopics,
  NotificationTypes,
  ScreenChangingNotificationDestinations,
} from "../../constants";
import { SocketServerToClientEvents } from "../../constants/socket";
import User from "../../database/userDatabase";
import USER_ROLES from "../../roles/roles";
import { sendMessageToOneOrMoreRecipients } from "../../utils";
import IPlayer from "../../interfaces/IPlayer";

async function handlerTowerDoor(cardId: string) {
  const acolyte = await User.getUserByField({ card_id: cardId });
  const newStatus = {
    is_in_tower_entrance: !acolyte!.is_in_tower_entrance,
    is_inside_tower: !acolyte!.is_inside_tower,
  };
  const updatedAcolyte = await User.updateUserByField(
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

    await sendAcolyteEnteredExitedNotification(updatedAcolyte);

    client.publish(
      MqttTopics.TOWER_DOOR,
      JSON.stringify({ isDoorOpen: false })
    );
  } else {
    console.log("The acolyte's socketId was not found");
  }
}

async function sendAcolyteEnteredExitedNotification(
  acolyte: HydratedDocument<IPlayer>
) {
  const fieldToFilterBy = { rol: USER_ROLES.MORTIMER };
  const fieldsToIncludeOrExclude = "pushToken";

  const mortimer = (await User.getUserByField(
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
