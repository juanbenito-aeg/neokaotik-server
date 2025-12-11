import { MqttTopics } from "../../constants/mqtt";
import handleTowerCardid from "./missions/swamp-tower/tower-cardid";
import { handlerTowerDoor } from "./missions/swamp-tower/tower-door";

function handleMessage(topic: string, message: Buffer) {
  let informativeMessage = "";
  const messageString = message.toString();

  switch (topic) {
    case MqttTopics.TOWER_CARDID: {
      informativeMessage = `A message under the topic "${MqttTopics.TOWER_CARDID}" containing the card ID "${messageString}" has been received.`;
      handleTowerCardid(messageString);
      break;
    }
    case MqttTopics.TOWER_DOOR: {
      const messageJson = JSON.parse(messageString);
      const { isDoorOpen, cardId } = messageJson;

      if (!isDoorOpen) {
        return;
      }

      informativeMessage = `A message under the topic "${MqttTopics.TOWER_DOOR} to "${messageString}" the door`;
      handlerTowerDoor(cardId);
      break;
    }
  }

  console.log(informativeMessage);
}

export default handleMessage;
