import { client } from "../..";
import { MqttTopics } from "../../constants";
import handleTowerCardid from "./tower-cardid";
import { handlerTowerDoor } from "./tower-door";

function handleConnect() {
  console.log("Connection to the MQTT broker successful.");

  client.subscribe(MqttTopics.TOWER_CARDID);
  client.subscribe(MqttTopics.TOWER_DOOR);
}

function handleMessage(topic: string, message: Buffer) {
  let informativeMessage = "";
  let cardId = "";
  const messageString = message.toString();

  switch (topic) {
    case MqttTopics.TOWER_CARDID: {
      cardId = messageString;
      informativeMessage = `A message under the topic "${MqttTopics.TOWER_CARDID}" containing the card ID "${messageString}" has been received.`;
      handleTowerCardid(messageString);
      break;
    }
    case MqttTopics.TOWER_DOOR: {
      if (messageString !== "open") {
        return;
      }

      informativeMessage = `A message under the topic "${MqttTopics.TOWER_DOOR} to "${messageString}" the door`;
      handlerTowerDoor(cardId, messageString);
      break;
    }
  }

  console.log(informativeMessage);
}

export { handleConnect, handleMessage };
