import { client, io } from "../..";
import { MqttTopics, SocketServerToClientEvents } from "../../constants";
import User from "../../database/userDatabase";

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

    client.publish(
      MqttTopics.TOWER_DOOR,
      JSON.stringify({ isDoorOpen: false })
    );
  } else {
    console.log("The acolyte's socketId was not found");
  }
}

export { handlerTowerDoor };
